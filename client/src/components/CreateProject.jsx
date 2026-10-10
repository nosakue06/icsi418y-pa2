import { useState, useEffect } from "react";

// this will create "CreateProject" component
function CreateProject({ onProjectCreated }) {

    // it stores project description that's entered by user
    const [description, setDescription] = useState("");

    // it stores project name entered by user
    const [projectName, setProjectName] = useState("");

    // it stores project status that is selected by user 
    const [status, setStatus] = useState("");

    // it stores registered users that's retrieved from MongoDB
    const [users, setUsers] = useState([]);

    // it stores user selected as project lead
    const [projectLead, setProjectLead] = useState("");

    // it stores message shown after user tries to create project
    const [message, setMessage] = useState("");

    // this gets registered users from backend when component loads
    useEffect(() => {

        fetch("http://localhost:9000/users")
            .then((response) => response.json())
            .then((data) => {
                setUsers(data);
            })
            .catch((error) => {
                console.error("Error getting users:", error);
            });

    }, []);

    // this function will run when user creates project
    const handleCreateProject = () => {

        // this checks whether all of those required fields are filled 
        if (
            !projectName.trim() ||
            !description.trim() ||
            !status ||
            !projectLead
        ) {
            setMessage("Please fill out all project fields");
            return;
        }

        // this stores all project info that will be sent to backend
        const projectData = {
            name: projectName.trim(),
            description: description.trim(),
            status: status,
            projectLead: projectLead
        };

         // this sends project info to backend
        fetch("http://localhost:9000/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(projectData)
        })
        .then(async (response) => {

            // this reads response from backend
            const data = await response.json();

            // it checks whether project creation failed
            if (!response.ok) {
                throw new Error(data.message || "Failed to create project");
            }

            return data;
        })
        .then((data) => {

            // displays success message
            setMessage(data.message);

            // clears all project fields after successful creation
            setProjectName("");
            setDescription("");
            setStatus("");
            setProjectLead("");

            // this notifies App that new project was created
            onProjectCreated();

        })
        .catch((error) => {

            // this displays errors in console
            console.error("Error creating project:", error);

            // this displays error message to user
            setMessage(error.message);

        });
    };
    
    return (
        <div>
            <h2>Create Project</h2>

            {/* label for the project name */}
            <label htmlFor="projectName">Project Name:</label>

            {/* input box where user enters project name */}
            <input
                type="text"
                id="projectName"
                name="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
            />    

            {/* label for project description */}
            <label htmlFor="description">Description:</label>

            {/* input box where the user enters project description */}
            <input
                type="text"
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />    

            {/* label for project status */}
            <label htmlFor="status">Status:</label>

            {/* dropdown where user selects project status */}
            <select
                id="status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}

            >
                <option value="">Select Status</option>
                <option value="Planning">Planning</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
            </select>   

            {/* label for the project lead */}
            <label htmlFor="projectLead">Project Lead:</label>

            {/* dropdown where the user selects a registered user as project lead */}
            <select
                id="projectLead"
                name="projectLead"
                value={projectLead}
                onChange={(e) => setProjectLead(e.target.value)}
            >
                <option value="">Select Project Lead</option>

                {users.map((user) => (
                    <option key={user._id} value={user._id}>
                        {user.f_name} {user.l_name} ({user.username})
                    </option>
                ))}
                </select>

                {/* button that was used to create project */}
                <button 
                    type="button"
                    onClick={handleCreateProject}
                >
                    Create Project
                </button>
                {/* this displays a message after user tries to create project */}
                <p>{message}</p>
        </div>
    );
}

// this enables CreateProject to be imported and used in other files
export default CreateProject; 








