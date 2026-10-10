import { useState, useEffect } from "react";

function ViewProjects({ projectRefresh }) {

    // this stores projects that were retrieved from backend
    const [projects, setProjects] = useState([]);

    // this gets projects from the backend when the component loads
    useEffect(() => {

        fetch("http://localhost:9000/projects")
            .then((response) => response.json())
            .then((data) => {
                setProjects(data);
            })
            .catch((error) => {
                console.error("Error getting projects:", error);
            });
    }, [projectRefresh]);
 
     return (
        <div>

            {/* the title for view projects section */}
            <h2>View Projects</h2>

            {/* this goes through each project that's retrieved from the backend */}
            {projects.map((project) => (

                <div key={project._id}>
                    {/* this displays the project name */}
                    <h3>{project.name}</h3>

                    {/* this displays the project description */}
                    <p>Description: {project.description}</p>

                    {/* this displays the project status */}
                    <p>Status: {project.status}</p>

                    {/* this displays the project lead */}
                    <p>
                        Project Lead: {project.projectLead
                        ? `${project.projectLead.f_name} ${project.projectLead.l_name} (${project.projectLead.username})`
                        : "Unknown Project Lead"}
                    </p>

                </div>    
            ))}


        </div>
     );

}

export default ViewProjects;

