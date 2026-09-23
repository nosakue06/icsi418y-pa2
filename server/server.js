require("dotenv").config();

// this imports Express so that we can create our backend server
const express = require("express");

// this imports CORS so that React frontend can communicate with the backend
const cors = require("cors");

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

const database = client.db("pa2");
const usersCollection = database.collection("users");

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

// this starts the backend server on port 9000
app.listen(9000, () => {

    // this prints the message in the terminal when server starts successfully
    console.log("Server running on port 9000");
});
