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
/api/auth/signup/customer, 
/api/auth/signup/admin, 
/api/auth/login, 
/api/auth/logout, 
/api/auth/profile, 
/api/auth/forgotpassword, 
/api/auth/resetpassword, 
/api/auth/updatepassword, 
/api/auth/updatedetails, 
/api/auth/deleteaccount
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

3. Install All dependencies

```bash
npm i express dotenv mongoose bcryptjs jsonwebtoken cookie-parser cors
```
