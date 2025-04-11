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
/api/auth/signup, 
/api/auth/admin/signup, 
/api/auth/login, 
/api/auth/logout, 
/api/auth/complete-profile,
/api/auth/GetProfile 
```

## Signup Customer

- **Endpoint**: `/api/auth/signup`
- **Method**: `POST`

Sample Dataset

```json
{
  "name": "Janindu Chamod",
  "email": "janinduchamod25@gmail.com",
  "password": "123456"
}
```

## Complete Profile (Customer)

- **Endpoint**: `/api/auth/complete-profile`
- **Method**: `POST`

Sample Dataset

```json
{
  "contact": "0704830006",
  "address": "9/9A, Kalegana, Galle",
  "isProfileComplete": true
}
```

## Signup By Admin

### Create System Admin Account

- **Endpoint**: `/api/auth/admin/signup`
- **Method**: `POST`

Sample Dataset

```json
{
  "name": "System Owner",
  "email": "admin@first.com",
  "password": "Admin@1234",
  "role": "system_admin"
}
```

### Create Restaurant Admin Account

- **Endpoint**: `/api/auth/admin/signup`
- **Method**: `POST`

Sample Dataset

```json
{
  "name": "Restaurant Owner",
  "email": "owner@restaurant.com",
  "password": "restaurantadmin123",
  "contact": "0762145639",
  "role": "restaurant_admin"
}
```

### Complete Profile (Restaurant Admin)

- **Endpoint**: `/api/auth/complete-profile`
- **Method**: `POST`

Sample Dataset

```json
{
  "restaurantId": "rest_123",
  "contact": "0704830006",
  "isProfileComplete": true
}
```

### Create Delivery Personnel Account

- **Endpoint**: `/api/auth/admin/signup`
- **Method**: `POST`

Sample Dataset

```json
{
  "name": "Delivery Man 1",
  "email": "deliveryman1@gmail.com",
  "password": "deliver123",
  "role": "delivery_personnel"
}
```

### Complete Profile (Delivery Personnel)

- **Endpoint**: `/api/auth/complete-profile`
- **Method**: `POST`

Sample Dataset

```json
{
  "vehicleNumber": "DL-01-AB-1234",
  "contact": "0710597867",
  "isProfileComplete": true
}
```