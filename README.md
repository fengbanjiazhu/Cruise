# Cruise

## Tech Stack

- **Frontend**: React, Redux, React Router
- **Backend**: Node.js + Express,
- **Database**: MongoDB (Mongoose)
- **Testing**: Jest, Vitest
- **Authentication**: JWT
- **UI Framework**: Tailwind CSS, Shadcn UI, react-icons
- **Map**: React Leaflet, Leaflet Routing Machine, OSRM API

## Commands

- **Install Dependencies**: `npm i`
- **Environment Variables**: A `.env` file is required, detail as below
- **Start Server**: `npm run server`
- **Start Client**: `npm start`

## Repository Structure

- **Client/**: Frontend implementation (React)
  - `src/components/`: Reusable UI and feature components
  - `src/assets/`: Static assets
  - `src/pages/`: Main application pages
  - `src/store/`: Redux store configuration
  - `src/utils/`: API functions, helper functions
  - `App.jsx`: Application router
  - `main.jsx`: Application root
- **Server/**: Backend implementation (Node.js + Express)
  - `Controllers/`: Business logic and request handling
  - `Models/`: Mongoose database schemas(with validations)
  - `Routes/`: API route definitions, mapping endpoints to controllers
  - `utils/`: Reusable utility functions, classes
  - `config.env`: Environment configuration
    - JWT_SECRET: Secret string for JWT encryption and decryption
    - JWT_EXPIRES_IN, JWT_COOKIE_EXPIRES_IN: JWT expiration time
    - DATABASE: Database connection string (MongoDB)
    - DATABASE_PASSWORD: Database password
  - `server.js`: Entry point of the backend server
- **README.md**: Project introduction and usage guide

## Project Allocation

### F Jeffrey R

- **Frontend**
  - Landing Page
  - Login Page
  - Fav List Component (on profile page)
  - Search Bar Component (on all path page)
  - **Features**
    - `Login/Logout` functions
    - `Favorite list Management` (Browse, Add, Remove) functions
    - `Path Search Filtering` (Search, Filter) functions
- **Backend**
  - Central Controller
  - Global error handling controller
  - **Features**
    - `Auth controller` (JWT, protect, restrictTo, login, logout functions)
    - `Fav Path controller`
    - `Path Search` (Implemented By Customized Request Class)

### John L

- **Frontend**
  - Admin Page
  - Report Components (on admin page)
  - User List Components (on admin page)
  - **Features**
    - `User Lists` (browse) functions
    - `Report Submit and Handling` (user submit, admin handle) functions
- **Backend**
  - **Features**
    - `Incident controller` (Report create/submit, handle functions)
    - `User controller` (with getAll functions)

### N Jin T

- **Frontend**
  - Profile Page
  - Register Page
  - User List Components (on admin page)
  - **Features**
    - `User Profile Management` (user management) functions
    - `Admin User Control` (admin user management) functions
- **Backend**
  - **Features**
    - `Auth Controller` (Register functions)
    - `User Controller` (with Update, Delete functions)

### Sean P

- **Frontend**
  - Review and Rating Component (On detail page)
  - **Features**
    - `Review and Rating` (Leave, Update, Delete Review) functions
- **Backend**
  - **Features**
    - `Review and Rating Controller`

### Tom J

- **Frontend**
  - All Path Page
  - Create Path Page
  - Path Detail Page
  - **Features**
    - `Path Management` (Create, Browse, Update, Delete Path) functions
- **Backend**
  - **Features**
    - `Path controller`
