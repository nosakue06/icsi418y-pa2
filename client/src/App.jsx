import { useState } from "react";

// this imports Signup component that I created
import Signup from "./components/Signup";
import Login from "./components/Login";
import CreateProject from "./components/CreateProject";
import ViewProjects from "./components/ViewProjects";
import ManageMemberships from "./components/ManageMemberships";

// this imports Create User Story component for PA4
import CreateUserStory from "./components/CreateUserStory";

// this imports Project Backlog component for PA4
import ProjectBacklog from "./components/ProjectBacklog";


// App - the main component of React application
function App() {

  // this tracks when new project is created 
  const [projectRefresh, setProjectRefresh] = useState(0);

  // this tracks when new user is created
  const [storyRefresh, setStoryRefresh] = useState(0);

  // this notifies Project Backlog when story is created
  const handleStoryCreated = () => {
    setStoryRefresh((previous) => previous + 1);
  };
  
  // this updates project list after creating project
  const handleProjectCreated= () => {
    setProjectRefresh((previous) => previous + 1);
  };


  return (
    <>
      {/* this displays the Signup component on webpage. */}
      <Signup />
      <Login />  

      {/* this creates projects and notifies App when its successful */}
      <CreateProject onProjectCreated={handleProjectCreated} />

      {/* displays updated projects */}
      <ViewProjects projectRefresh={projectRefresh} />

      {/* manages memberships for those updated projects */}
      <ManageMemberships projectRefresh={projectRefresh} />

      {/* this displays Create User Story form for PA4 */}
      <CreateUserStory onStoryCreated={handleStoryCreated} />

      {/* this displays Project Backlog section for PA4 */}
      <ProjectBacklog storyRefresh={storyRefresh} />
    </>
  );
}

// this enables App to be used by main.jsx.
export default App;

