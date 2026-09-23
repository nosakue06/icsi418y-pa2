// this imports Signup component that I created
import Signup from "./components/Signup";

import Login from "./components/Login";


// App - the main component of React application
function App() {
  return (
    <>
      {/* this displays the Signup component on webpage. */}
      <Signup />
      <Login />
    </>
  );
}

// this enables App to be used by main.jsx.
export default App;
