import { useState } from "react";

// this creates Signup component
// React component - a resuable part of user interface
function Signup() {

    // it stores the first name entered by user
    const [firstName, setFirstName] = useState("");

    // it stores the last name entered by user
    const [lastName, setLastName] = useState("");

    // it stores the username entered by user
    const [username, setUsername] = useState("");

    // it stores the password entered by user
    const [password, setPassword] = useState("");

    // this function runs when user submits signup form
    async function handleSubmit(e) {
        // this prevents webpage from refreshing when form is submitted
        e.preventDefault();

        // it checks whether those required fields are filled
        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !username.trim() ||
            !password
        ) {
            alert("Please fill out all signup fields");
            return;
        }

        try {

        // this sends the signup information to Express backend
        const response = await fetch("http://localhost:9000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                f_name: firstName.trim(),
                l_name: lastName.trim(),
                username: username.trim(),
                password: password
            })
        });

        // this reads backend response
        const data = await response.json();

        // checks whether signup was successful
        if (!response.ok) {
           throw new Error(data.message || "Signup failed");
        }

        // this displays success message
        alert(data.message);

        // this clears signup fields
        setFirstName("");
        setLastName("");
        setUsername("");
        setPassword("");
    
    } catch (error) {

         // this runs if React can't connect to backend
         console.error("Signup error:", error);
         
         // this displays error message
         alert(error.message);

    }
}

    // the "return" describes what should appear on the webpage
    return (
        <div>
            {/* this is the heading for Signup section. */}
            <h2>Sign Up</h2>

            {/* the form will contain the user's signup information. */}
            <form onSubmit={handleSubmit}>
                {/* label tells user what information to enter. */}
                <label htmlFor= "firstName">First Name:</label>

                {/* the input box where the user enters their first name. */}
                <input 
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />  

                {/* label for user's last name. */}
                <label htmlFor="lastName">Last Name:</label>

                {/* the input box where user enters their last name. */}
                <input 
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                /> 

                {/* label for user's username. */}
                <label htmlFor="username">Username:</label>

                {/* the input box where user enters their username. */}
                <input 
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />    

                {/* label for user's password. */}
                <label htmlFor="password">Password:</label>

                {/* the input box where urser enters their password. */}
                <input 
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />    
                {/* the button the user clicks to submit the signup form. */}
                <button type="submit">
                    Sign up
                </button>
            </form>
        </div>
    );
}

// this allows the "Signup" to be imported and used in other files. 
// for example, App.jsx.
export default Signup;


