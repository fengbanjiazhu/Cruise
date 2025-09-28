# Cruise

## Tech Stack

- **Frontend**: React, Redux, React Router
- **Backend**: Node.js + Express,
- **Database**: MongoDB (Mongoose)
- **Testing**: Jest, Vitest
- **Authentication**: JWT
- **UI Framework**: Tailwind CSS, Shadcn UI, react-icons
- **Map**: React Leaflet, Leaflet Routing Machine, OSRM API

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
  - `server.js`: Entry point of the backend server
- **README.md**: Project introduction and usage guide

## Project Allocation

### F Jeffrey R

- **Frontend**
  - Project initialization and structure setup
    - React Router setup
    - Redux setup
  - Reusable API handling functions
  - **Features**
    - `Login` (page), `logout` functionality
    - `Favorite list` (components) functionality
    - `Path search` (components) functionality
- **Backend**
  - Database setup and connection (MongoDB + Mongoose)
    - Mongoose schemas initialization
  - Server initialization (Node.js + Express)
  - Reusable Central Controller
  - Global error handling controller
  - **Features**
    - `Auth controller` (JWT, protect, restrictTo, login, logout functions)
    - `Fav Path controller` (with Add, Delete functions)

### John L

### N Jin T

### Sean P

### Tom J
