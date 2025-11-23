User Authentication API Documentation
Base URL
http://localhost:5000/api/auth

1. Register User
Create a new user account.

Endpoint: /register
Method: POST
Access: Public
Request Body (JSON)
Parameter	Type	Required	Description
fullName	string	Yes	Full name of the user
email	string	Yes	Valid email address
password	string	Yes	Password (min 6 characters)
profilePicture	string	No	URL to profile picture (optional)
Example Request:

json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "profilePicture": ""
}
Success Response
Status: 201 Created
Content:
json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65abc123...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "profilePicture": "",
    "createdAt": "2023-11-23T12:00:00.000Z",
    "updatedAt": "2023-11-23T12:00:00.000Z",
    "__v": 0
  }
}
Error Response
Status: 400 Bad Request
Content: { "message": "User already exists" } or { "message": "Server error" }
2. Login User
Authenticate an existing user and receive a JWT token.

Endpoint: /login
Method: POST
Access: Public
Request Body (JSON)
Parameter	Type	Required	Description
email	string	Yes	Registered email address
password	string	Yes	User's password
Example Request:

json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
Success Response
Status: 200 OK
Content:
json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65abc123...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "profilePicture": "",
    "createdAt": "2023-11-23T12:00:00.000Z",
    "updatedAt": "2023-11-23T12:00:00.000Z",
    "__v": 0
  }
}
Error Response
Status: 400 Bad Request
Content: { "message": "Invalid credentials" }
3. Get Current User
Retrieve the profile of the currently authenticated user.

Endpoint: /me
Method: GET
Access: Private (Requires Token)
Headers
Header	Value	Description
Authorization	Bearer <your_jwt_token>	The token received from login/register
Success Response
Status: 200 OK
Content:
json
{
  "user": {
    "_id": "65abc123...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "profilePicture": "",
    "createdAt": "2023-11-23T12:00:00.000Z",
    "updatedAt": "2023-11-23T12:00:00.000Z",
    "__v": 0
  }
}
Error Response
Status: 401 Unauthorized
Content: { "message": "No token, authorization denied" } or { "message": "Token is not valid" }
4. Logout User
Invalidate the user session on the client side.

Method: Client-Side Action
Description: Since the backend uses stateless JWT authentication, there is no specific API endpoint for logout.
Implementation: To log out a user, simply remove the token from the client's storage (e.g., localStorage, sessionStorage, or Cookies) and redirect the user to the login page.
Client-Side Example (JavaScript):

javascript
// Logout function
const logout = () => {
  localStorage.removeItem('token'); // Remove token
  window.location.href = '/login';  // Redirect to login
};