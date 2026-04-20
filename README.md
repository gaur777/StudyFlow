# Student Task Manager

A simple MERN stack project for students to manage study tasks, view basic analytics, and update simple preferences.
The goal of this project was to understand how frontend, backend, database and deployment work in a full-stack app.

Live Demo- https://study-flow-eight-mu.vercel.app/

## Features

-   User signup and login (JWT-based auth)
-   Create, update, and delete study tasks (CRUD)
-   Track study hours per task
-   Basic profile and settings management
-   Protected routes for authenticated users
-   Clean dashboard UI

## Tech Stack

### Frontend

-   React (Vite)
-   Tailwind CSS
-   Fetch API

### Backend

-   Node.js
-   Express.js

### Database

-   MongoDB (Mongoose)

### Deployment

-   Frontend: Vercel
-   Backend: Render

## Run Locally

1. Create a `.env` file from `.env.example`
2. Make sure MongoDB is running locally or update `MONGODB_URI`
3. Start frontend and backend together:

```bash
npm run dev:full
```

Frontend runs on `http://localhost:5173` and backend runs on `http://localhost:5001`.

## Folder Structure

    StudyFlow/
    ├── backend/
    │   ├── models/
    │   ├── routes/
    │   ├── controllers/
    │   ├── config/
    │   └── server.js
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   ├── api/
    │   │   └── App.jsx
    │   └── index.html

