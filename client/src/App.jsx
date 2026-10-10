import { useState } from "react";

// this imports Signup component that I created
import Signup from "./components/Signup";
import Login from "./components/Login";
import CreateProject from "./components/CreateProject";
import ViewProjects from "./components/ViewProjects";
import ManageMemberships from "./components/ManageMemberships";


// App - the main component of React application
function App() {

  // this tracks when new project is created 
  const [projectRefresh, setProjectRefresh] = useState(0);
  
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
    </>
  );
}

// this enables App to be used by main.jsx.
export default App;

