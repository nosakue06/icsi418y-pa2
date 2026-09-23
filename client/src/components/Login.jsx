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

        try {

        // it sends the username and password to Express backend
        const response = await fetch("http://localhost:9000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        // this converts the response from Express into JavaScript data
        const data = await response.json();

        // this displays the backend response
        alert(data.message);
   
    } catch (error) {

         // this runs if React cannot connect to backend
         console.error(error);

         alert("Could not connect to the server");
         
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

