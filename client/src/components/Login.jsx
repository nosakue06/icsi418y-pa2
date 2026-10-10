import { useState } from "react";

// this creates Login component
function Login() {

    // it stores the username entered by user
    const [username, setUsername] = useState("");

    // it stores the password entered by user
    const [password, setPassword] = useState("");

    // this function runs when the user submits login form 
    async function handleSubmit(e) {

        // this prevents webpage from refreshing when form submitted
        e.preventDefault();

        // checks to see whether both fields are filled 
        if (!username.trim() || !password) {
            alert("Please enter your username and password");
            return;
        }

        try {

        // it sends the username and password to Express backend
        const response = await fetch("http://localhost:9000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username.trim(),
                password: password
            })
        });
        
        // this converts the response from Express into JavaScript data
        const data = await response.json();

        // checks whether login failed
        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        // this displays the backend response
        alert(data.message);

        // clears login fields after success
        setUsername("");
        setPassword("");

    } catch (error) {

         // this displays error in console
         console.error("Login error:", error);

         // it displays error message
         alert(error.message);
         
    }

}

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                {/* username input */}
                <label htmlFor= "loginUsername">Username:</label>
                <input 
                    type="text"
                    id="loginUsername"
                    name="loginUsername"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />  

                {/* password input */}
                <label htmlFor="loginPassword">Password:</label>
                <input 
                    type="password"
                    id="loginPassword"
                    name="loginPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />    

                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;

