# Simple Todo App

A simple full-stack Todo app built with React Native, Node.js/Express, and MongoDB.

## Tech Stack

- React Native with Expo
- TypeScript
- Node.js
- Express.js
- MongoDB
- Mongoose

## Features

- Add tasks
- View tasks
- Mark tasks as Done / To Do
- Delete tasks
- Search tasks by title
- Filter tasks by status: To Do, Done, All
- Empty state when there are no tasks
- Created date for each task

## Task Fields

Each task has:

-title
-description
-status (todo / done)
-completed (boolean)
-createdAt
-updatedAt

## Project Structure

```text
backend/
  index.js
  models/Task.js
  routes/TaskRoutes.js

frontend/
  app/(tabs)/index.tsx
  app/add-task.tsx
  components/TaskCard.tsx
  config/api.ts
```

## API Endpoints

```http
GET /tasks
POST /tasks
GET /tasks/:id
PATCH /tasks/:id
PATCH /tasks/:id/toggle
DELETE /tasks/:id
```

## Setup

### Backend

```bash
cd backend
npm install
npm start
```

Create `backend/.env`:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### Frontend

```bash
cd frontend
npm install
npx expo start
```

Set the API URL in `frontend/config/api.ts`:

```ts
export const API_URL = "http://YOUR_LOCAL_IP:5000";
```
# Screenshots

<p align="center">
  <img src="frontend/screenshots/IMG_2455.png" width="180"/>
  <img src="frontend/screenshots/IMG_2456.png" width="180"/>
  <img src="frontend/screenshots/IMG_2458.png" width="180"/>
  <img src="frontend/screenshots/IMG_2459.png" width="180"/>
</p>




