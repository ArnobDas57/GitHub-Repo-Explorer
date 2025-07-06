# 🔎 Repo Explorer: GitHub Repository Manager

Repo Explorer is a full-stack web application designed to help users discover trending GitHub repositories and curate their collection of favourites. It features secure authentication and seamless integration with GitHub data for an intuitive Browse experience.

## 🌐 Live Demo

Frontend (Vercel): https://repo-explorer-chi.vercel.app/

Backend (Render): https://repoexplorer-backend.onrender.com/api (API only)

Database: Supabase (PostgreSQL)

##  ✨ Features

🔐 User Authentication: Secure sign-up, login, and protected routes using JWT.

⭐ Favorite Repositories: Authenticated users can easily add and remove GitHub repositories from their personalized favorites list.

🔍 Repository Discovery: (Assumed from project name, integrate with GitHub API on frontend).

💾 Persistent Storage: All user data and favorited repositories are securely stored and managed via Supabase.


##  ⚙️ Technologies

React (Vite)

Node.js / Express

Supabase (Postgres)

JWT Auth

React Router

TypeScript

##  🚀 Getting Started (Local Development)

### To set up and run this project locally, ensure you have Node.js and npm installed.

1. Clone the Repository
   
- git clone <your-repository-url>
- cd repo-explorer-root # Navigate to your project's root directory

2. Supabase Setup
   
- Create a Supabase Project.
- From Settings > API, get your Project URL and the service_role (secret) key.
- Create a public.repos table in your Supabase SQL editor. It should include columns like id (PK, uuid), user_id (FK to auth.users.id, uuid), name, description, starCount, link, language, owner_login, owner_avatar_url, and timestamps. A UNIQUE (user_id, link) constraint is recommended.

3. Backend Setup

- cd backend
- npm install
  
### Create a .env file in backend/ and populate it:

- PORT=5000
- JWT_SECRET=<your_very_strong_jwt_secret>
- SUPABASE_URL=<your_supabase_project_url>
- SUPABASE_SERVICE_ROLE_KEY=<your_supabase_service_role_secret_key>

### Run the backend server:

- npm run dev

4. Frontend Setup

### In a new terminal, navigate to the frontend/ directory:

- cd ../frontend
- npm install

### Create a .env file in frontend/ and add your backend URL:

VITE_REACT_APP_BACKEND_URL=http://localhost:5000/api

### Run the frontend application:

- npm run dev

### Your frontend should open at http://localhost:5173.
   
##  ✅ Future Enhancements

- Search Functionality: Allow users to search for specific repositories.
- Filtering/Sorting: Options to filter and sort favorited repos.
- User Profiles: Enhanced user profile pages.
