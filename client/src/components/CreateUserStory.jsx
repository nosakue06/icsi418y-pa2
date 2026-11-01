import { useState, useEffect } from "react";

// this creates CreateUserStory component for PA4
function CreateUserStory({ onStoryCreated }) {

    // this stores selected project ID
    const [selectedProject, setSelectedProject] = useState("");

    // this stores user story title
    const [title, setTitle] = useState("");

    // this stores user story description
    const [description, setDescription] = useState("");

    // this stores priority selected by user
    const [priority, setPriority] = useState("Medium");

    // this stores selected assigned member ID
    // an empty string - story is unassigned
    const [assignedMember, setAssignedMember] = useState("");

    // this stores available projects
    const [projects, setProjects] = useState([]);

    // this stores members of selected project
    const [members, setMembers] = useState([]);

    // this stores success or error messages
    const [message, setMessage] = useState("");

    // this retrieves all existing projects when component loads
    useEffect(() => {

        // this sends a GET request to Express backend
        fetch("http://localhost:9000/projects")

              // this converts backend response into JavaScript data
              .then((response) => {
                 if (!response.ok) {
                    throw new Error("Could not retrieve projects");
                }

                return response.json();
            })

            // this saves retrieved projects in React state
            .then((data) => {
                setProjects(data);
            })

            // this handles errors when retrieving projects
            .catch((error) => {
                console.error("Error loading projects:", error);
                setMessage("Could not load projects");
            });

        }, []);


    // this retrieves members whenever selected project changes
    useEffect(() => {

        // this clears members and assignments from previous project
        setMembers([]);
        setAssignedMember("");

        // this stops if no project has been selected
        if (!selectedProject) {
            return;
        }

        // this prevents outdated request from updating component
        let cancelled = false;

        // this retrieves members of selected project
        fetch(`http://localhost:9000/projects/${selectedProject}/members`)

              // this checks whether backend request succeeded
              .then((response) => {
                if (!response.ok) {
                    throw new Error("Could not retrieve project members");
                }

                return response.json();
            })

            // this stores the selected project's members
            .then((data) => {
                if (!cancelled) {
                    setMembers(data);
                }
            })

            // this handles errors when loading members
            .catch((error) => {
                if (!cancelled) {
                    console.error("Error loading project members:", error);
                    setMessage("Could not load project members");
                }
            });

            // this ignores an older request if project changes
            return () => {
                cancelled = true;
            };

        }, [selectedProject]);

        // this runs when user submits Create User Story form
        async function handleSubmit(e) {

            // this prevents webpage from refreshing
            e.preventDefault();

            // this checks whether a project is selected
            if (!selectedProject) {
                setMessage("Please select a project");
                return;
            }

            // this checks whether required fields are empty
            if (!title.trim() || !description.trim()) {
                setMessage("Title and description are required");
                return;
            }

            try {

                // clears any previous feedback message
                setMessage("");

                // this sends user story to Express backend
                const response = await fetch(
                    `http://localhost:9000/projects/${selectedProject}/stories`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            title: title.trim(),
                            description: description.trim(),
                            priority: priority,
                            assigned_user_id: assignedMember === ""
                                ? null
                                : assignedMember
                        })
                    }
                );

                // this converts backend response into JavaScript data
                const data = await response.json();

                // this checks whether backend accepted the request
                if (!response.ok) {
                    throw new Error(data.message || "Could not create user story");
                }

                // this displays a success message
                setMessage("User story created successfully");

                // this notifies App.jsx to refresh Project Backlog
                if (onStoryCreated) {
                    onStoryCreated();
                }

                // this clears the form after successful creation
                setTitle("");
                setDescription("");
                setPriority("Medium");
                setAssignedMember("");

            } catch (error) {

                // this displays error in browser console
                console.error("Error creating user story:", error);

                // this displays error message to user
                setMessage(error.message || "Could not create user story");
            }
        }

    // this describes what appears in Create User Story section
    return (
        <div>
            {/* this is the heading for creating a user story */}
            <h2>Create User Story</h2>

            <form onSubmit={handleSubmit}>

            {/* this is the label for selecting an existing project */}
            <label htmlFor="storyProject">Select Project:</label>

            {/* this dropdown displays projects that are retrieved from MongoDB */}
            <select
                id="storyProject"
                value={selectedProject}
                onChange={(e) => {
                    setSelectedProject(e.target.value);

                    // this clears previous feedback message
                    setMessage("");

                    // this clears members from previous project
                    setMembers([]);

                    // this resets assigned member
                    setAssignedMember("");
                }}
            >
                {/* the default option when no project is selected */}
                <option value="">Select a project</option>

                {/* this creates one option for each project */}
                {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                        {project.name}
                    </option>
                ))}

                </select>

                <label htmlFor="storyAssignedMember">Assigned Member:</label>

                {/* this dropdown shows only members of selected project */}
                <select
                    id="storyAssignedMember"
                    value={assignedMember}
                    onChange={(e) => setAssignedMember(e.target.value)}
                    disabled={!selectedProject}
                >
                    {/* empty value - the story is unassigned */}
                    <option value="">Unassigned</option>

                    {/* this displays members of selected project */}
                    {members.map((member) => (
                        <option key={member._id} value={member._id}>
                            {member.f_name} {member.l_name} ({member.username})
                        </option>
                    ))}

                </select>

                {/* label for user story title */}
                <label htmlFor="storyTitle">Title:</label>

                {/* this stores title entered by user */}
                <input
                    type="text"
                    id="storyTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter user story title"
                    required
                />

                {/* label for user story description */}
                <label htmlFor="storyDescription">Description:</label>

                {/* this stores user story description */}
                <textarea
                    id="storyDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="As a [type of user], I want [goal], so that [benefit]."
                    required
                />

                {/* label for selecting user story priority */}
                <label htmlFor="storyPriority">Priority:</label>

                {/* this enables the user to select a valid priority */}
                <select
                    id="storyPriority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>

                <button type="submit" disabled={!selectedProject}>
                    Create User Story
                </button>
            </form>


                {/* displays success or error messages */}
                {message && <p>{message}</p>}
            </div>
    );
}

// this enables component to be imported into App.jsx
export default CreateUserStory;
