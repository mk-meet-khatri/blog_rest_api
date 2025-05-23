Project: Blog RESTful API (Backend)

Q: How to Run the Project?
1.	Install Dependencies
npm install
2.	Start the Project
To run the application: npm start
3.	Using the API with Postman
A Postman collection has already been exported.
Import the collection file into Postman to begin testing the API.
You can start sending requests based on the defined routes.
4.	Environment Credentials
Environment credentials have been provided for initial setup.
Note: These credentials are for your use only and should not be shared with others for security reasons.
5.	Project Documentation
Proper documentation is included to guide you through the API functionalities and structure.

Features:
Admin Functionality
Register an admin user first.
Then, manually change the user's role to 1 or 2 in the database to grant admin privileges.
Admins can:
Add, update, and delete categories.
Manage all posts, files and comments.

Post Functionality
Any user can:
Create, read, update, and delete their own posts as well as of others.
View posts created by other users, comments, files etc

Comment Functionality
Only the author of a comment or an admin can:
Update or delete the comment.

Objective of the Project
This project demonstrates CRUD operations (Create, Read, Update, Delete) at various access levels:
Normal user
Admin user

Extra Features Implemented
In addition to the core features, I have implemented several additional routes:
Authentication & User Management:
Send verification code,
Verify user,
Forgot password,
Recover password,
Change password,
Update profile,
Get current user details,
Category and File Management:
Category routes for admin,
File routes for handling uploads and access.
