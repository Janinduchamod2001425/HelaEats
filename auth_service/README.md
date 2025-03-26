# Auth Service 🔐🔑

- **Description**: Handles user authentication, authorization, and user management.
- **User Roles**: Customer, Restaurant Admin, Delivery Driver, System Admin.

### Tech Stack 

- Node.js
- Express
- MongoDB
- JWT
- Docker
- Kubernetes

### API Endpoints
```
/api/v1/auth/signup, 
/api/v1/auth/login, 
/api/v1/auth/logout, 
/api/v1/auth/profile, 
/api/v1/auth/forgotpassword, 
/api/v1/auth/resetpassword, 
/api/v1/auth/updatepassword, 
/api/v1/auth/updatedetails, 
/api/v1/auth/deleteaccount
```

### Backend Setup

1. Install node modules

```bash
npm init -y
```

2. Install nodemon devDependencies

```bash
npm i nodemon -D
```