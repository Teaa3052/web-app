# Self-Improvement App

A full-stack web application for tracking personal goals, habits, and self-improvement journeys.

## Tech Stack

**Frontend**
- React (Vite)
- React Router DOM
- React Hook Form
- Axios
- Tailwind CSS

**Backend**
- Node.js
- Express
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt
- dotenv

## Project Structure
```
web-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
└── backend/
    ├── routes/
    │   └── auth.js
    ├── controllers/
    │   └── authController.js
    ├── models/
    │   └── userModel.js
    ├── middleware/
    │   ├── validateRequest.js
    │   └── authMiddleware.js
    ├── app.js
    ├── database.js
    ├── .env
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v22.x or later)
- PostgreSQL
- Git

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in `backend/` folder:
```env
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
JWT_SECRET=your_secret_key_here
```

4. Create PostgreSQL database and users table:
```sql
CREATE DATABASE your_database_name;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    date_of_birth DATE,
    profile_picture TEXT
);
```

5. Start backend server:
```bash
node app.js
```

Backend runs on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Authentication Flow

1. **Register**: User creates account → Backend hashes password with bcrypt → Stores in PostgreSQL
2. **Login**: User submits credentials → Backend validates → Returns JWT token
3. **Protected Routes**: Frontend sends token in Authorization header → Backend middleware verifies token

## Current Features

- User Registration
- User Login
- JWT Token Authentication
- Password Hashing (bcrypt)
- Input Validation
- CORS Configuration
- Dashboard (In Progress)
- Protected Routes (In Progress)

## Planned Features

- User Dashboard
- Habit Tracker
- To-Do Lists
- Goal Setting & Tracking
- Progress Statistics
- Profile Management
- Categorized Journals/Diaries

## Development

### Backend API Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Testing

Use Thunder Client (VS Code extension) or Postman to test API endpoints.

**Example Register Request:**
```json
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "nickname": "testuser",
  "dateOfBirth": null,
  "profilePicture": null
}
```

**Example Login Request:**
```json
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

## Author

Tea 

## License

This project is for educational purposes.