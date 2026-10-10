ICSI 418Y - Programming Assignment 3

Projects and Project Memberships:

This project extends PA2 by adding project creation and project 
membership management to a full-stack application. 

Technologies Used:

• React (Vite) - Frontend
• Node.js and Express - Backend
• MongoDB Atlas - Database
• JavaScript - Programming Language

Features:

• Register users through Signup form
• Log in using the registered credentials
• Create projects with: name, description, status, and Project Lead
• View projects that are stored in MongoDB
• Select those registered users as Project Leads
• Automatically add those Project Leads as project members
• Add and also remove project members
• Prevent any duplicate project memberships 
• Prevent any Project Leads from being removed
• Support users that belong to multiple projects
• Automatically refresh project lists after project creation

Database Collections:

MongoDB database has three collections:

• users - It stores registered user information
• projects - It stores project details and project lead references
• projectMemberships - It stores relationships between users and projects using MongoDB
ObjectIds

How to Run Application:

1. Install dependencies 

From project folder, install those dependecies for both backend and frontend

cd server
npm install 

cd ../client
npm install

2. Configure MongoDB

Create .env file inside server folder and configure the MongoDB Atlas connection
using environment variable expected by server.js

Ensure current IP address is authorized in MongoDB Atlas Network Access

3. Start the backend

From server folder:

 node server.js

Backend runs on http://localhost:9000.

4. Start the frontend

Open a separate terminal and navigate to client folder:

 npm run dev

Open local URL displayed by Vite, typically http://localhost:5173/.

Project Structure:

• client/ - React frontend and components 
• server/ - Express backend and MongoDB connection
• README.md - Project documentation

Programming Assignment 3

ICSI 418Y - Software Engineering

This application demonstrates full-stack development and many-to-many relationships
between both users and projects using MongoDB.







