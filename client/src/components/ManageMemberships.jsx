import { useState, useEffect } from "react";

function ManageMemberships() {

    // this stores all of those projects from MongoDB
    const [projects, setProjects] = useState([]);

    // this stores project selected by user
    const [selectedProject, setSelectedProject] = useState("");

    // this stores project lead ID
    const [projectLeadId, setProjectLeadId] = useState(""); 

    // this stores members of the selected project
    const [members, setMembers] = useState([]);

    // this stores all these registered users from MongoDB
    const [users, setUsers] = useState([]);

    // this stores user selected to add to the project
    const [selectedUser, setSelectedUser] = useState("");

    // this gets all the projects from the backend when component loads
    useEffect(() => {

        fetch("http://localhost:9000/projects")
            .then((response) => response.json())
            .then((data) => {
                setProjects(data);
            })
            .catch((error) => {
                console.error("Error getting projects:", error);
            });
    }, []);

    // this gets the project members when selected project changes
    useEffect(() => {

        if (selectedProject) {
            getProjectMembers();

            const project = projects.find((project) => project._id === selectedProject);

            if (project) {
                setProjectLeadId(project.project_lead_id);
            }
        }

    }, [selectedProject]);

    // this gets all those registered users from backend when component loads
    useEffect(() => {

        fetch("http://localhost:9000/users")
            .then((response) => response.json())
            .then((data) => {
                setUsers(data);
            });

    }, []);

    // this gets members of the selected project
    const getProjectMembers = () => {

        // this checks if project has been selected
        if (!selectedProject) {
            return;
        }

        console.log("Selected project ID:", selectedProject);

        // this requests members of the selected project from the backend
        fetch(`http://localhost:9000/projects/${selectedProject}/members`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Members received:", data);
                setMembers(data);
            })
            .catch((error) => {
                console.error("Error getting project members:", error);
            })

    };

    // this adds selected user to the selected project
    const addMember = () => {

        // this checks that project and user have been selected
        if (!selectedProject ||  !selectedUser) {
            return;
        }

        // this sends a request to backend to add user to the project
        fetch(`http://localhost:9000/projects/${selectedProject}/members` , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: selectedUser
            })
        })
         .then(async (response) => {

            // this reads response from backend
            const data = await response.json();

            // this checks whether adding member failed
            if (!response.ok) {
                throw new Error(data.message || "Failed to add member");
            }

            return data;
        })
        .then((data) => {

            // this displays success message
            console.log(data.message);

            // this resets selected user
            setSelectedUser("");

            // this refreshes project members
            getProjectMembers();


        })
        .catch((error) => {

            // this displays errors in console
            console.error("Error adding member:", error);

            // this displays error message to user 
            alert(error.message);
        })

    };

    // this removes selected member from project
    const removeMember = (userId) => {

        // this sends request to backend to remove member
        fetch(`http://localhost:9000/projects/${selectedProject}/members/${userId}`, {
            method: "DELETE"
        })

        .then(async (response) => {

            // this reads response from backend
            const data = await response.json();

            // this checks whether removal failed
            if (!response.ok) {
                throw new Error(data.message || "Failed to remove member");
            }

            return data;
        })
        .then((data) => {

            // this displays success message
            console.log(data.message);

            // this refreshes current project members 
            getProjectMembers();
        })
        .catch((error) => {

            // this displays errors in console
            console.error("Error removing member:", error);

            // this displays error message to user 
            alert(error.message);
        })
    };    


     return (
        <div>
            <h2>Manage Memberships</h2>

            {/* label for selecting project */}
            <label htmlFor="project">Select Project:</label>

            {/* dropdown where user selects a project */}
            <select
                id="project"
                name="project"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
            >
                <option value="">Select Project</option>    

                {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                        {project.name}
                    </option>
                ))}
            
            </select>    

                {/* label for selecting user to add */}
                <label htmlFor="user">Add Member:</label> 

                {/* dropdown where the user selects a registered user */}
                <select
                    id="user"
                    name="user"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                >
                    <option value="">Select User</option>

                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.f_name} {user.l_name} ({user.username})
                        </option>
                    ))}
                </select>  
                 
                <button onClick={addMember}>Add Member</button> 

            {/* the title for current project members */}
            <h3>Current Members</h3>

            {/* this goes through each member of the selected project */}
            {members.map((member) => (
                <p key={member._id}>
                    {member.f_name} {member.l_name} ({member.username})

                    {member._id !== projectLeadId && (
                        <button onClick={() => removeMember(member._id)}>
                            Remove
                        </button>
                    )}    
                </p>
            ))}
        </div>
     );

}

export default ManageMemberships;



