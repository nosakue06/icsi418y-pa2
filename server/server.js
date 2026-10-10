require("dotenv").config();

// this imports Express so that we can create our backend server
const express = require("express");

// this imports CORS so that React frontend can communicate with the backend
const cors = require("cors");

const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

const database = client.db("pa2");

const usersCollection = database.collection("users");

// this connects to projects collection in MongoDB
const projectsCollection = database.collection("projects"); 

// this connects to project memberships collection in MongoDB
const projectMembershipsCollection = database.collection("projectMemberships");

async function connectDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Could not connect to MongoDB");
        console.error(error);
    }
}

connectDatabase();

// this creates the Express application/server
const app = express();

// this stores the users who create accounts
const users = [];

// this allows the server to understand JSON data sent from frontend
app.use(express.json());

// this allows requests to come from React frontend
app.use(cors());

// this creates a GET route for main "/" address. when someone
// visits localhost:9000, this function runs
app.get("/", (req, res) => {

     // this sends a JSON response back to browser
    res.json({
        message: "Server is running"
    });

});

// this retrieves all registered users from MongoDB
app.get("/users", async (req, res) => {

    try {

        // this gets all users stored in users collection
        const registeredUsers = await usersCollection.find(
            {},
            {
                projection: {
                    password: 0
                }
            }
        ).toArray();

        // this sends users back to React frontend
        res.status(200).json(registeredUsers);

    } catch (error) {

        // this displays error in server terminal
        console.error(error);

        // this sends error response if something goes wrong
        res.status(500).json({
            message: "Server error"
        });
    } 

});

// this retrieves all those projects from MongoDB
app.get("/projects", async (req, res) => {

    try {

        // this gets all projects that are stored in projects collection
        const allProjects = await projectsCollection.find({}).toArray();

        // this will store the projects with project lead information
        const projectsWithLeads = [];

        // this goes through each project
        for (const project of allProjects) {

            // this finds the user who's the project lead
            const projectLead = await usersCollection.findOne(
                {
                    _id: project.project_lead_id
                },
                { 
                    projection: {
                        password: 0
                    }
                }
            );

            // this adds both project and project lead info to array
            projectsWithLeads.push({
                ...project,
                projectLead: projectLead
            });

        }

        // this sends all those projects back to the React frontend
        res.status(200).json(projectsWithLeads);

    } catch (error) {

        // this displays error in the server terminal
        console.error(error);

        // this sends error response if something does go wrong
        res.status(500).json({
            message: "Server error"
        });

    }

});

// this retrieves those members of selected project
app.get("/projects/:projectId/members", async (req, res) => {

    try {

        // this gets project id from the URL
        const projectId = req.params.projectId;

        // this converts project id into MongoDB ObjectId
        const projectObjectId = new ObjectId(projectId); 

        // this finds all the memberships for the selected project
        const projectMemberships = await projectMembershipsCollection.find({
            project_id: projectObjectId
        }).toArray();

        // this'll store user info for project members
        const members = [];

        // this goes through each membership for the selected project
        for (const membership of projectMemberships) {

            // this finds the user connected to membership
            const memberUser = await usersCollection.findOne(
                {
                _id: membership.user_id
            },
            {
                projection: {
                    password: 0
                }
            }
        );
       
            // this adds the user info to members array
            members.push(memberUser);

        }

        // this sends project members back to the React frontend
        res.status(200).json(members);

    } catch (error) {

        // this displays error in the server terminal
        console.error(error);

        // this sends an error response if something goes wrong
        res.status(500).json({
            message: "Server error"
        })

    }

});

// this adds user as a member of project
app.post("/projects/:projectId/members", async (req, res) => {

    try {

        // this gets project ID from the URL
        const projectId = req.params.projectId;

        // this gets the user ID sent from the frontend
        const { userId } = req.body;

        // checks whether both IDs are valid
        if (
            !ObjectId.isValid(projectId) ||
            !ObjectId.isValid(userId)
        ) {
            return res.status(400).json({
                message: "Invalid project or user ID"
            });
        }

        // this converts project ID into MongoDB ObjectId
        const projectObjectId = new ObjectId(projectId);

        // converts user ID into MongoDB ObjectId
        const userObjectId = new ObjectId(userId); 

        // checks whether the selcted project exists
        const project = await projectsCollection.findOne({
            _id: projectObjectId
        });

        if (!project) {
            return res.status(404).json({
                message: "Project does not exist"
            });
        }

         // checks whether the selcted user exists
        const user = await usersCollection.findOne({
            _id: userObjectId
        });

        if (!user) {
            return res.status(400).json({
                message: "User does not exist"
            });
        }

        // this checks if the user is already a member of project
        const existingMembership = await projectMembershipsCollection.findOne({
            project_id: projectObjectId,
            user_id: userObjectId
        });

        // this prevents the duplicate project memberships
        if (existingMembership) {
            return res.status(400).json({
                message: "User is already a project member"
            });
        }

        // adds new membership to MongoDB
        await projectMembershipsCollection.insertOne({
            project_id: projectObjectId,
            user_id: userObjectId
        });

        // this sends a success message after the member is added
        res.status(201).json({
            message: "Member added successfully"
        });

    } catch (error) {

        // displays errors in server terminal
        console.error(error);

        // sends an error response if something does go wrong 
        res.status(500).json({
            message: "Server error"
        });

    }

});

// this removes member from selected project
app.delete("/projects/:projectId/members/:userId", async (req, res) => {

    try {

        // this'll get project ID and user ID from URL
        const { projectId, userId } = req.params;

        // checks whether project ID and user ID are valid
        if (
            !ObjectId.isValid(projectId) ||
            !ObjectId.isValid(userId)
        ) {
            return res.status(400).json({
                message: "Invalid project or user ID"
            });
        }

        // this converts project ID into MongoDB ObjectId
        const projectObjectId = new ObjectId(projectId);

        // this converts user ID into MongoDB ObjectId
        const userObjectId = new ObjectId(userId);

        // this searches MongoDB for selected project 
        const project = await projectsCollection.findOne({
            _id: projectObjectId
         });

        // checks whether project exists
        if (!project) {
            return res.status(404).json({
                message: "Project does not exist"
            });
        } 

        // checks if selected user is project lead
        if (project.project_lead_id.equals(userObjectId)) {
            return res.status(403).json({
                message: "Project Lead cannot be removed"
            });
        }

        // searches MongoDB for selected user
        const user = await usersCollection.findOne({
           _id: userObjectId
        });

        // this checks whether the selected user exists
        if (!user) {
            return res.status(404).json({
                message: "User does not exist"
            });
        }

        // removes user's membership from selected project
        const result = await projectMembershipsCollection.deleteOne({
            project_id: projectObjectId,
            user_id: userObjectId
        });

        // checks whether a membership was removed 
        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "User is not a member of this project"
            });
        }

       // this sends success response
       res.status(200).json({
           message: "Member removed successfully"
       });

    } catch (error) {

        // this will display errors in server terminal 
        console.error(error);

        // this sends error response if something does go wrong
        res.status(500).json({
            message: "Server error"
        });
    }

});



// this creates new project 

app.post("/projects", async (req, res) => {

    try { 

    // this gets project info sent from frontend
    const projectData = req.body; 

    // this checks if any required project info is missing
    if (
        !projectData.name ||
        !projectData.description ||
        !projectData.status ||
        !projectData.projectLead
    ) {
        return res.status(400).json({
            message: "All project fields are required"
        });
    }

    // checks if project lead ID has a valid format
    if (!ObjectId.isValid(projectData.projectLead)) {
        return res.status(400).json({
            message: "Invalid Project Lead ID"
        });
    }

    // this converts selected project lead id into a MongoDB ObjectId
    const projectLeadId = new ObjectId(projectData.projectLead);

    // this searches MongoDB for selected project lead 
    const projectLeadUser = await usersCollection.findOne({
        _id: projectLeadId
    });  

    // checks if selected project lead exists 
    if (!projectLeadUser) {
        return res.status(404).json({
            message: "Project Lead does not exist"
        });
    }
    
    // this creates the project that'll be stored in MongoDB
    const newProject = {
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        project_lead_id: projectLeadId
    };

    // this stores new project in projects collection 
    const result = await projectsCollection.insertOne(newProject);

    // this creates a membership for project lead
    const leadMembership = {
        project_id: result.insertedId,
        user_id: projectLeadId
    };

    // this stores project lead as member of the project 
    await projectMembershipsCollection.insertOne(leadMembership);

    // this sends a success response after project is created
    res.status(201).json({
        message: "Project created successfully",
        projectId: result.insertedId
    });

    } catch (error) {

        // this displays error in server terminal
        console.error(error);

        // this sends error response if something goes wrong
        res.status(500).json({
            message: "Server error"
        });
    }

    });

// this receives signup information that is sent from React frontend
app.post("/signup", async (req, res) => {

    try {

    // it gets signup information from request
    const signupData = req.body;

    // it checks to see that all required signup fields were provided
    if (
        !signupData.f_name ||
        !signupData.l_name ||
        !signupData.username ||
        !signupData.password
    ) {
        return res.status(400).json({
            message: "Required information is missing"
        });
    }

    // this checks whether the username is already being used
    const existingUser = await usersCollection.findOne({
        username: signupData.username
    });

    // if username already exists, don't create another account
    if (existingUser) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }
    
    // it stores the new user's signup information in the users array
    users.push(signupData);

    // this stores the new user's signup information in MongoDB
    await usersCollection.insertOne(signupData);

    // it displays all currently stored users for testing
    console.log("Users stored:", users);

    // this displays the received information in the server terminal for testing 
    console.log("Signup information received:", signupData);

    // it sends a response back to React frontend
    res.status(201).json({
        message: "Account created successfully!"
    });

} catch (error) {

    // this displays error in server terminal
    console.error(error);

    // this sends error response if something goes wrong
    res.status(500).json({
        message: "Server error"
    });
  
   }

});

// this receives the login information from React frontend
app.post("/login", async (req, res) => {

    try {

    // it gets the username and password sent from React
    const { username, password } = req.body;

    // checks to see that all required login fields were provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Required information is missing"
        });
    }

    // it searches MongoDB for a user with same username and password
    const user = await usersCollection.findOne({
            username: username,
            password: password
    });

    // if no matching user is found, reject login
    if (!user) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    // if a matching user is found, login is successful
    res.status(200).json({
        message: "Login successful!"
    });

} catch (error) {

     // this displays error in the server terminal
     console.error(error);

     // this sends an error response if something goes wrong
     res.status(500).json({
        message: "Server error"
     });

   }

});

console.log("POST /projects exists:", typeof app.post);

// this starts the backend server on port 9000
app.listen(9000, () => {

    // this prints the message in the terminal when server starts successfully
    console.log("Server running on port 9000");
});


