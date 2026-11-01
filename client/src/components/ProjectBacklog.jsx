import { useState, useEffect } from "react";

// this creates refresh notification from App.jsx
function ProjectBacklog({ storyRefresh }) {

    // this stores all those existing projects
    const [projects, setProjects] = useState([]);

    // this stores selected project ID
    const [selectedProject, setSelectedProject] = useState("");

    // this stores stories that belongs to selected project
    const [stories, setStories] = useState([]);

    // this stores members of selected project
    const [members, setMembers] = useState([]);

    // stores success or error messages
    const [message, setMessage] = useState("");

    // stores whether data is currently loading
    const [loading, setLoading] = useState(false);

    // this'll store story selected for editing later
    const [editingStory, setEditingStory] = useState(null);

    // these stores values that are entered while editing user story
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPriority, setEditPriority] = useState("Medium");
    const [editStatus, setEditStatus] = useState("To Do");
    const [editAssignedMember, setEditAssignedMember] = useState("");


     // this retrieves all existing projects when component loads
    useEffect(() => {

        // this sends a GET request to Express backend
        fetch("http://localhost:9000/projects")

              // this checks whether request succeeded
              .then((response) => {
                 if (!response.ok) {
                    throw new Error("Could not retrieve projects");
                }

                return response.json();
            })

            // this stores retrieved projects in React state
            .then((data) => {
                setProjects(data);
            })

            // this handles errors when retrieving projects
            .catch((error) => {
                console.error("Error loading projects:", error);
                setMessage("Could not load projects");
            });

        }, []);

         // this loads stories and members when selected project changes
         useEffect(() => {

             // this clears members and assignments from previous project
             setStories([]);
             setMembers([]);
             setEditingStory(null);
             setMessage("");

            // this stops if no project has been selected
            if (!selectedProject) {
                setLoading(false);
                return;
            }

            // this prevents outdated request from updating component
            let cancelled = false;

            // this indicates data is loading
            setLoading(true);

            // this retrieves stories and members for selected project
            async function loadBacklog() {

                try {

                    // this requests selected project's stories and members
                    const [storiesResponse, membersResponse] = await Promise.all([
                        fetch(`http://localhost:9000/projects/${selectedProject}/stories`),
                        fetch(`http://localhost:9000/projects/${selectedProject}/members`)
                    ]);

                    // this checks whether those requests succeeded
                    if (!storiesResponse.ok || !membersResponse.ok) {
                        throw new Error("Could not load project backlog");
                    }

                    // this converts these responses into JavaScript data
                    const [storiesData, membersData] = await Promise.all([
                        storiesResponse.json(),
                        membersResponse.json()
                    ]);

                    // this updates React only if project is still selected
                    if (!cancelled) {
                        setStories(storiesData);
                        setMembers(membersData);
                    }

                } catch (error) {

                    // this displays errors only for current project
                    if (!cancelled) {
                        console.error("Error loading backlog:", error);
                        setMessage("Could not load project backlog");
                    }

                } finally {

                    // this ends loading indicator
                    if (!cancelled) {
                        setLoading(false);
                    }
                }
            }

            loadBacklog();

            // this ignores those outdated responses when switching projects
            return () => {
                cancelled = true;
            };

        }, [selectedProject, storyRefresh]);

        // this returns assigned member's readable name
        function getAssignedMemberName(assignedUserId) {

            // this displays Unassigned when there isn't any member that's assigned
            if (!assignedUserId) {
                return "Unassigned";
            }

            // this finds assigned user in selected project's members
            const member = members.find(
                (member) => member._id === assignedUserId
            );

            // this handles a member who can't be found
            if (!member) {
                return "Unknown Member";
            }

            // this displays member's full name and username
            return `${member.f_name} ${member.l_name} (${member.username})`;
        }

        // this loads existing user story into editing form
        function handleEdit(story) {

            // this stores story currently being edited
            setEditingStory(story);

            // this loads existing story title
            setEditTitle(story.title);

            // this loads the existing description
            setEditDescription(story.description);

            // this loads existing priority
            setEditPriority(story.priority);

            // this loads existing status
            setEditStatus(story.status);

            // this loads assigned member or Unassigned
            setEditAssignedMember(story.assigned_user_id || "");

            // this clears those previous feedback messages
            setMessage("");
        }

        // this saves changes made to existing user story
        async function handleSaveEdit() {

            // checks whether a story is selected for editing
            if (!editingStory || !selectedProject) {
                setMessage("Please select a story to edit");
                return;
            }

            // checks whether required text fields are empty
            if (!editTitle.trim() || !editDescription.trim()) {
                setMessage("Title and description are required");
                return;
            }

            try {

                // this clears those previous feedback messages
                setMessage("");

                // this sends updated story info to backend
                const response = await fetch(
                    `http://localhost:9000/projects/${selectedProject}/stories/${editingStory._id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            title: editTitle.trim(),
                            description: editDescription.trim(),
                            priority: editPriority,
                            status: editStatus,
                            assigned_user_id: editAssignedMember === ""
                                ? null
                                : editAssignedMember

                        })
                    }
                );

                // this converts backend response into JavaScript data
                const data = await response.json();

                // this checks whether backend accepted changes
                if (!response.ok) {
                    throw new Error(data.message || "Could not update user story");
                }

                // this reloads selected project's stories from MongoDB
                const storiesResponse = await fetch(
                    `http://localhost:9000/projects/${selectedProject}/stories`
                );

                if (!storiesResponse.ok) {
                    throw new Error("Story saved, but could not refresh backlog");
                }

                const updatedStories = await storiesResponse.json();

                // this updates displayed backlog
                setStories(updatedStories);

                // this closes editing form
                setEditingStory(null);

                // this displays success message
                setMessage("User story updated successfully");

            } catch (error) {

                // this displays error in browser console
                console.error("Error updating user story:", error);

                // this displays error message to user
                setMessage(error.message || "Could not update user story");
            }
        }

        // this deletes user story after confirmation
        async function handleDeleteStory(story) {

            // this asks user to confirm deletion
            const confirmed = window.confirm(
                `Are you sure you want to delete "${story.title}"?`
            );

            // this stops if user cancels
            if (!confirmed) {
                return;
            }

            try {

                // this clears those previous feedback messages
                setMessage("");

                // this sends DELETE request to backend
                const response = await fetch(
                    `http://localhost:9000/projects/${selectedProject}/stories/${story._id}`,
                    {
                        method: "DELETE"
                    }
                );

                // this reads backend response
                const data = await response.json();

                // this checks whether deletion succeeded
                if (!response.ok) {
                    throw new Error(data.message || "Could not delete user story");
                }

                // this removes deleted story from displayed backlog
                setStories((previousStories) =>
                    previousStories.filter(
                        (existingStory) => existingStory._id !== story._id
                   )
                );

                // this closes editing form if it was open for story
                if (editingStory?._id === story._id) {
                    setEditingStory(null);
                }

                // this displays success message
                setMessage("User story deleted successfully");

            } catch (error) {

                // this displays error in browser console
                console.error("Error deleting user story:", error);

                // this displays error message to user
                setMessage(error.message || "Could not delete user story");
            }
        }

    // this displays Project Backlog interface
    return (
        <div>
            {/* this is the heading for Project Backlog section */}
            <h2>Project Backlog</h2>

            {/* this is the label for selecting a project */}
            <label htmlFor="backlogProject">Select Project:</label>

            {/* this dropdown displays existing projects */}
            <select
                id="backlogProject"
                value={selectedProject}
                onChange={(e) => {

                    // this stores newly selected project ID
                    setSelectedProject(e.target.value);

                    // this clears stories from previous project
                    setStories([]);

                    // this clears members from previous project
                    setMembers([]);

                    // closes any open story editing form
                    setEditingStory(null);

                    // this clears those previous feedback messages
                    setMessage("");
                }}
            >
                {/* the default option when no project is selected */}
                <option value="">Select a project</option>

                {/* displays each project as an option */}
                {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                        {project.name}
                    </option>
                ))}

                </select>

                {/* displays a message when no project is selected */}
                {!selectedProject && (
                    <p>Please select a project to view its backlog</p>
                )}

                {/* displays a loading message */}
                {selectedProject && loading && (
                    <p>Loading project backlog...</p>
                )}

                {/* this displays selected project's stories */}
                {selectedProject && !loading && !message && (
                    <div>

                        {/* this displays message if project has no stories */}
                        {stories.length === 0 ? (
                            <p>No user stories found for this project.</p>
                        ) : (

                            // this goes through each story in backlog
                            stories.map((story) => (
                                <div key={story._id}>

                                    {/* this displays story title */}
                                    <h3>{story.title}</h3>

                                    {/* this displays story description */}
                                    <p>Description: {story.description}</p>

                                    {/* this displays priority */}
                                    <p>Priority: {story.priority}</p>

                                    {/* this displays story status */}
                                    <p>Status: {story.status}</p>

                                    {/* this displays assigned member */}
                                    <p>
                                        Assigned Member: {getAssignedMemberName(
                                            story.assigned_user_id
                                        )}
                                    </p>

                                    {/* this opens editing form for selected story */}
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(story)}
                                    >
                                        Edit Story
                                    </button>

                                     {/* this deletes selected story after confirmation */}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteStory(story)}
                                    >
                                        Delete Story
                                    </button>

                                    {/* this displays editing form for selected story */}
                                    {editingStory?._id === story._id && (

                                        <div>
                                            <h4>Edit User Story</h4>

                                            {/* this edits story title */}
                                            <label htmlFor="editStoryTitle">Title:</label>
                                            <input
                                                type="text"
                                                id="editStoryTitle"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                required
                                            />

                                            {/* this edits story description */}
                                            <label htmlFor="editStoryDescription">Description:</label>
                                            <textarea
                                                id="editStoryDescription"
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                required
                                            />

                                            {/* this edits story priority */}
                                            <label htmlFor="editStoryPriority">Priority:</label>
                                            <select
                                                id="editStoryPriority"
                                                value={editPriority}
                                                onChange={(e) => setEditPriority(e.target.value)}
                                            >
                                                <option value="High">High</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Low">Low</option>
                                            </select>

                                              {/* this edits story status */}
                                            <label htmlFor="editStoryStatus">Status:</label>
                                            <select
                                                id="editStoryStatus"
                                                value={editStatus}
                                                onChange={(e) => setEditStatus(e.target.value)}
                                            >
                                                <option value="To Do">To Do</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Done">Done</option>
                                            </select>

                                            {/* this edits assigned project member */}
                                            <label htmlFor="editStoryMember">Assigned Member:</label>
                                            <select
                                                id="editStoryMember"
                                                value={editAssignedMember}
                                                onChange={(e) => setEditAssignedMember(e.target.value)}
                                            >
                                                <option value="">Unassigned</option>

                                                {members.map((member) => (
                                                    <option key={member._id} value={member._id}>
                                                        {member.f_name} {member.l_name} ({member.username})
                                                    </option>
                                                ))}
                                            </select>

                                             {/* this saves edited story in MongoDB */}
                                            <button
                                                type="button"
                                                onClick={handleSaveEdit}
                                            >
                                                Save Changes
                                            </button>


                                            {/* this closes the form w/o saving changes */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingStory(null);
                                                    setMessage("");
                                                }}
                                            >
                                                Cancel
                                            </button>

                                        </div>

                                    )}

                                    <hr />

                                </div>

                            ))
                        )}

                        </div>

                )}

                {/* displays success or error messages */}
                {message && <p>{message}</p>}
            </div>
    );
}

// this enables App.jsx to import component
export default ProjectBacklog;
