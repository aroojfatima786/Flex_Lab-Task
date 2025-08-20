<<<<<<< HEAD
# Flex_Lab-Task
This repository contains the tasks assigned during my internship at Flexlab Software House. It includes practical implementations, coding exercises, and mini-projects that are part of the internship program
=======
# User CRUD API
A simple Node.js API for user management with Express and Mongoose.

## Setup & Running the App
1. Install dependencies:
npm install

2. Create a `.env` file with the following content:
PORT=4000
MONGO_URI=mongodb://localhost:27017/user_crud_dev
NODE_ENV=development

Make sure MongoDB is running locally or update MONGO_URI if using a remote DB.

3. Start the app:
npm run dev   # for development (uses nodemon)
npm start     # for production

## API Endpoints, Request & Responses, Example curl
{
  "Base path": "/api/users",
  "1. Create User": {
    "POST /api/users": {
      "body": {
        "email": "user@example.com",
        "username": "user123",
        "password": "123456",
        "age": 22,
        "phonenumber": "1234567890"
      },
      "response": {
        "_id": "64d1f0f9c8b8a1234567890a",
        "email": "user@example.com",
        "username": "user123",
        "age": 22,
        "phonenumber": "1234567890",
        "createdAt": "2025-08-14T08:00:00.000Z",
        "updatedAt": "2025-08-14T08:00:00.000Z"
      },
    }
  },
  "2. List All Users": {
    "GET /api/users": {
      "response": [
        {
          "_id": "64d1f0f9c8b8a1234567890a",
          "email": "user@example.com",
          "username": "user123",
          "age": 22,
          "phonenumber": "1234567890",
          "createdAt": "2025-08-14T08:00:00.000Z",
          "updatedAt": "2025-08-14T08:00:00.000Z"
        }
      ],
      
    }
  },
  "3. Get User by ID": {
    "GET /api/users/:id": {
      "response": {
        "_id": "64d1f0f9c8b8a1234567890a",
        "email": "user@example.com",
        "username": "user123",
        "age": 22,
        "phonenumber": "1234567890",
        "createdAt": "2025-08-14T08:00:00.000Z",
        "updatedAt": "2025-08-14T08:00:00.000Z"
      },
      
    }
  },
  "4. Update User (Partial)": {
    "PATCH /api/users/:id": {
      "body": {
        "age": 23,
        "phonenumber": "9876543210"
      },
      "response": {
        "_id": "64d1f0f9c8b8a1234567890a",
        "email": "user@example.com",
        "username": "user123",
        "age": 23,
        "phonenumber": "9876543210",
        "createdAt": "2025-08-14T08:00:00.000Z",
        "updatedAt": "2025-08-14T09:00:00.000Z"
      },
      
    }
  },
  "5. Delete User": {
    "DELETE /api/users/:id": {
      "response": {
        "deleted": true,
        "user": {
          "_id": "64d1f0f9c8b8a1234567890a",
          "email": "user@example.com",
          "username": "user123",
          "age": 23,
          "phonenumber": "9876543210",
          "createdAt": "2025-08-14T08:00:00.000Z",
          "updatedAt": "2025-08-14T09:00:00.000Z"
        }
      },
      
    }
  }
}

 "Example curl Commands": {
    "Create User": "curl -X POST http://localhost:4000/api/users -H \"Content-Type: application/json\" -d '{\"email\":\"user@example.com\",\"username\":\"user123\",\"password\":\"123456\"}'",
    "List Users": "curl http://localhost:4000/api/users",
    "Get User by ID": "curl http://localhost:4000/api/users/689da60a8d77edd475c00974",
    "Update User": "curl -X PATCH http://localhost:4000/api/users/689da60a8d77edd475c00974 -H "Content-Type: application/json" -d "{\"age\":25}",
    "Delete User": "curl -X DELETE http://localhost:4000/api/users/689da60a8d77edd475c00974"
  }
**Notes:** Password is excluded from API responses. Errors return proper status codes (400, 404, 409, 500). Minimal request logging enabled in development.


### update .env file
PORT=4000
MONGO_URI=mongodb://localhost:27017/user_crud_dev
NODE_ENV=development
JWT_SECRET=sup3rS3cretKey@2025!_random
JWT_EXPIRES_IN=30m


### Authentication API (`/api/auth`)
- Sign Up: POST `/signup`  
Request body: `{"email":"user@example.com","username":"john_doe","password":"Pass@123","age":25,"phonenumber":"+923001234567"}`  
Response: `{"message":"User registered successfully","user":{"_id":"64c4...","email":"user@example.com","username":"john_doe","age":25,"phonenumber":"+923001234567"}}`  
Token is set in HTTP-only cookie automatically.

- Sign In: POST `/signin`  
Request body: `{"email":"user@example.com","password":"Pass@123"}`  
Response: `{"message":"Login successful"}`

- Get Profile: GET `/profile` (Requires authentication)  
Headers: `Cookie: token=<jwt>`  
Response: `{"_id":"64c4...","email":"user@example.com","username":"john_doe","age":25,"phonenumber":"+923001234567"}`

### Example curl Commands
- Authentication:  
signup: `curl -X POST http://localhost:4000/api/auth/signup -H "Content-Type: application/json" -d '{"email":"user@example.com","username":"john_doe","password":"Pass@123"}'`  
signin: `curl -X POST http://localhost:4000/api/auth/signin -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"Pass@123"}' -c cookies.txt`  
profile: `curl -X GET http://localhost:4000/api/auth/profile -b cookies.txt`
refreshtoken: `curl -X POST http://localhost:4000/api/auth/refresh-token ^
-H "Content-Type: application/json" ^
-H "Authorization: Bearer <ACCESS_TOKEN>" ^
-d "{\"token\":\"<REFRESH_TOKEN>\"}"`
logout: `curl -X POST http://localhost:4000/api/auth/logout ^
-H "Content-Type: application/json" ^
-H "Authorization: Bearer <ACCESS_TOKEN>"`

### update .env file
PORT=4000
MONGO_URI=mongodb://localhost:27017/user_crud_dev
NODE_ENV=development
JWT_SECRET=sup3rS3cretKey@2025!_random
JWT_EXPIRES_IN=30m
ACCESS_TOKEN_SECRET=js87hs8sjsn8sh2nsnsu72727shshhs
REFRESH_TOKEN_SECRET=928hsnjs9shhsh27shs8hsh2828hhsns


### Install Swagger dependencies
npm install swagger-ui-express swagger-jsdoc

### Summary of Testing via Swagger UI

All User CRUD and Authentication API endpoints were tested successfully using Swagger UI:

- **User CRUD Endpoints (`/api/users`)**  
  - Create, List, Get by ID, Update, Delete operations tested.  
  - Password field is properly excluded from responses.  
  - Proper status codes returned for errors (400, 404, 409, 500).  

- **Authentication Endpoints (`/api/auth`)**  
  - Signup and Signin tested successfully; tokens issued and stored in HTTP-only cookies.  
  - Profile endpoint works correctly with authentication token.  
  - Refresh token functionality verified; initial header usage issue resolved by sending token in request body.  
  - Logout endpoint clears token cookie successfully.  

No further issues were found. Minimal request logging confirmed for development environment.

 "Example curl Commands": {
    "Auth - signup": "curl -X POST http://localhost:4000/api/auth/signup -H \"Content-Type: application/json\" -d '{\"email\":\"user@example.com\",\"username\":\"john_doe\",\"password\":\"Pass@123\"}'",
    "Auth - signin": "curl -X POST http://localhost:4000/api/auth/signin -H \"Content-Type: application/json\" -d '{\"email\":\"user@example.com\",\"password\":\"Pass@123\"}' -c cookies.txt",
    "Auth - profile": "curl -X GET http://localhost:4000/api/auth/profile -b cookies.txt",
    "Auth - refresh-token": "curl -X POST http://localhost:4000/api/auth/refresh-token -H \"Content-Type: application/json\" -d '{\"token\":\"<REFRESH_TOKEN>\"}'",
    "Auth - logout": "curl -X POST http://localhost:4000/api/auth/logout -H \"Content-Type: application/json\"",
    "Users - list": "curl http://localhost:4000/api/users",
    "Users - get": "curl http://localhost:4000/api/users/<USER_ID>",
    "Users - update": "curl -X PATCH http://localhost:4000/api/users/<USER_ID> -H \"Content-Type: application/json\" -d '{\"age\":25}'",
    "Users - delete": "curl -X DELETE http://localhost:4000/api/users/<USER_ID>"
  }


## Notes Security & Validation
- Passwords hashed using bcrypt (10 salt rounds)
- JWT stored in HTTP-only cookies
- JWT expires in 30 minutes; refresh token valid 7 days
- Duplicate email/username checked at signup
- Input validated via express-validator
- Password excluded from API responses
- Proper HTTP status codes used: 400, 401, 403, 404, 409, 500
- Minimal logging enabled for development
- Role-based access: admin/moderator/user

## Payment Integration
1. Install Stripe SDK
npm install stripe

## Update user profile
1. Install dependencies
npm install multer cloudinary multer-storage-cloudinary


### update .env file
PORT=4000
MONGO_URI=mongodb://localhost:27017/user_crud_dev
NODE_ENV=development
JWT_SECRET=<secret>
JWT_EXPIRES_IN=30m
ACCESS_TOKEN_SECRET=<secret>
REFRESH_TOKEN_SECRET=<secret>
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
>>>>>>> 0f15463 (Initial commit)
