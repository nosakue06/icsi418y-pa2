# ICSI 418Y - Programming Assignment 4

## User Stories and Project Backlog

### Project Overview

This project extends application that was developed in Programming Assignment 3 by
adding user story management and project backlogs.

The application enables users to create projects, manage project memberships, create and
assign user stories, track story progress, and update or delete existing stories.

The application uses React for frontend, Node.js and Express for backend, and MongoDB
Atlas for both storing and managing data.

### Technologies Used

• Frontend: React, Vite, JavaScript
• Backend: Node.js, Express
• Database: MongoDB Atlas
• Database Driver: MongoDB Node.js Driver
• Development Environment: Visual Studio Code
• Version Control: Git and GitHub

### Application Features:

1. User Registration and Login (PA2)

 • Register users with both their information and login credentials.
 • Log in using those registered credentials.
 • Store those registered users in MongoDB.

2. Project Management (PA3)

 • Create projects with name, description, status, and Project Lead.
 • View those projects that are stored in MongoDB.
 • Select the registered users as Project Leads.
 • Automatically add those Project Leads as project members.
 • Add and remove those project members
 • Prevent any duplicate project memberships.
 • Prevent those Project Leads from being removed.
 • Enable users to belong to multiple projects.

3. User Story Creation (PA4)

 • Select existing project when creating user story.
 • Enter story title and description.
 • Select priority of High, Medium, or Low.
 • Assign story to current project member or leave it Unassigned.
 • Automatically assign those newly created stories the status To Do.
 • Validate all required information before storing stories in MongoDB.

 User story descriptions follow this particular format:

 As a [type of user], I want [goal], so that [benefit].

 4. Project Backlog (PA4)

  • View user stories that belongs to selected project.
  • Display each story's title, description, priority, status, and lastly, assigned member.
  • Include stories with these: To Do, In Progress, and Done statuses.
  • Display message when project has no stories.
  • Automatically refresh backlog after creating new story.

5. Editing and Deleting User Stories (PA4)

 • Edit both existing story titles and descriptions.
 • Change these story priorities and statuses.
 • Reassign stories to another eligible member or leave them to be Unassigned.
 • Cancel edits w/o saving changes.
 • Save any changes to existing MongoDB documents.
 • Delete the stories after confirmation.
 • Cancel deletion w/o removing the story.
 • Update backlog after editing or deleting stories.

 6. Membership and Assignment Validation (PA4)

  • Restrict story assignments to members of selected project.
  • Verify assigned users and project memberships through backend.
  • Prevent removing members who do have assigned user stories.
  • Apply membership protection even when those assigned stories are marked Done.
  • Enable non-lead members to be removed after stories are reassigned, unassigned, or deleted.
  • Preserve existing restriction against removing Project Leads.

### Database Structure

The application uses MongoDB database named pa2.

It contains four collections:

1. users

Stores registered user information which includes: names, usernames, and account information.

2. projects

Stores project information which includes: project name, description, status, and Project Lead
reference.

3. projectMemberships

Stores relationships between users and projects using MongoDB ObjectId references.

4. UserStories

Stores user stories that are associated with existing projects.

Each user story document contains:

 • _id - MongoDB-generated ObjectId
 • project_id - ObjectId that references selected project
 • title - User story title
 • description - User story description
 • priority - High, Medium, or Low
 • status - To Do, In Progress, or Done
 • assigned_user_id - ObjectId that references an assigned user or null for Unassigned

The project_id remains unchanged when existing story is editied.

### How to Run Application

Step 1: Install Dependencies

Open project folder in Visual Studio Code.

In terminal, navigate to backend folder and install dependencies:

cd server
npm install

Then navigate to frontend folder:

cd ../client
npm install

Step 2: Configure MongoDB Atlas

Create .env file inside server folder.

Add MongoDB connection string using environment variable:

MONGO_URI=your_mongodb_connection_string

Replace placeholder with your MongoDB Atlas connection string.

Make sure current IP address authorized in MongoDB Atlas Network Access.

The .env file shouldn't be committed to GitHub.

Step 3: Start Backend

From project's server folder, run:

node server.js

The backend runs at:

http://localhost:9000

A successful connection displays:

Server running on port 9000
Connected to MongoDB

Keep that terminal running

Step 4: Start Frontend

Open separate terminal in Visual Studio Code.

Navigate to client folder and run:

npm run dev

Open localhost URL displayed by Vite, usually:

http://localhost:5173/

Port may differ depending on whether another Vite server is running.

### Preparing Test Data

For PA4, the application should contain at least three registered users, two projects,
and five user stories across those projects.

The test data should include all those three priorities, all three statuses, assigned
and unassigned stories, and at least one non-lead project member.

Example Registered Users

 • Harper Wilson
 • Jordan Johnson
 • Taylor Smith

Example Projects

TeamFlow

 • Project Lead: Harper Wilson
 • Project Status: Planning
 • Members: Harper Wilson and Jordan Johnson

 StudyHub

  • Project Lead: Taylor Smith
  • Project Status: Active

Example User Stories

TeamFlow

1. View project tasks
    • Priority: High
    • Status: Done
    • Assigned Member: Harper Wilson
2. Update project progress
    • Priority: Medium
    • Status: Done
    • Assigned Member: Unassigned

StudyHub

3. Create study groups
    • Priority: High
    • Status: To Do
    • Assigned Member: Taylor Smith
4. Join study groups
     • Priority: Low
     • Status: To Do
     • Assigned Member: Unassigned
5. Track study sessions
     • Priority: Medium
     • Status: In Progress
     • Assigned Member: Taylor Smith

These example stories demonstrate required priority levels, story statuses, and
assignment options.

### Testing and Validation

The following functionality can be tested through React interface and Express backend:

User Story Creation

 • Create story with valid information.
 • Verify new stories begin with To Do status.
 • Attempt submit blank required fields.
 • Verify invalid assignments are rejected.

Project Backlog

 • Switch between those two projects.
 • Verify only selected project's stories appear.
 • Verify projects w/o stories display appropriate message.
 • Confirm newly created stories appear in backlog.

Story Editing

 • Edit story's title, description, priority, status, or assigned member.
 • Verify Cancel leaves original story unchanged.
 • Save changes and refresh page to confirm persistence.
 • Verify Done stories can be reopened.

Story Deletion

 • Cancel deletion and confirm story remains.
 • Confirm deletion of temporary test story.
 • Refresh backlog to verify deleted story no longer appears.

Membership Protection

 • Attempt to remove member who has assigned stories.
 • Verify backend rejects removal with explanation.
 • Verify Done stories also prevent removal.
 • Unassign or reassign the member's stories.
 • Verify removal becomes possible once no stories remain assigned in project.
 • Verify Project Leads can't be removed.

Database Verification

 • Inspect UserStories collection in MongoDB Atlas.
 • Verify ObjectId references projects and assigned users.
 • Confirm changes remain after refreshing application.

### Project Structure

icsi418y-pa2/
├── client/
│    └── src/
│       ├── App.jsx
│       └── components/
│           ├── Signup.jsx
│           ├── Signup.jsx
│           ├── Login.jsx
│           ├── CreateProject.jsx
│           ├── ViewProjects.jsx
│           ├── ManageMemberships.jsx
│           ├── CreateUserStory.jsx
│           ├── ProjectBacklog.jsx
├── server/
│   └── server.js
├── .gitignore
└── README.md

### Conclusion

PA4 demonstrates development of full-stack project management application using React, Express, and MongoDB Atlas.

The application builds on user registration and project membership  functionality from previous assignments by introducing user stories,
project backlogs, status tracking, editing, deletion, and assignment validation.

The project demonstrates how these frontend components communicate with the backend API routes and how MongoDB ObjectId references support relationships between users, projects, memberships, and user stories.
