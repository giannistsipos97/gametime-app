# Gametime

Gametime is a full-stack web application for discovering games, building a personal library, tracking progress, and managing a wishlist. The frontend is built with Angular, while the backend provides authentication and user-specific game library storage through MongoDB.

## Features

- User registration, login, and password reset
- JWT-based authentication
- Search and game discovery through the RAWG API
- Personal game library per user
- Wishlist and currently-playing style tracking
- Progress fields such as played status, hours played, platform, completion date, and play-next flag
- Stats view for library insights
- Responsive Angular UI with PrimeNG, Tailwind CSS, and Chart.js

## Tech Stack

### Frontend

- Angular 18
- TypeScript
- PrimeNG
- Tailwind CSS
- Chart.js
- IndexedDB via `idb`

### Backend

- Node.js
- Express
- MongoDB / Mongoose
- JWT authentication
- bcrypt password hashing
- dotenv configuration

## Project Structure

```text
Gametime/
+-- front-end/     # Angular application
`-- back-end/      # Express API and MongoDB models
```

## Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB Atlas database or a local MongoDB connection string
- RAWG API key

## Environment Variables

Create a `.env` file inside the `back-end` folder:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:4200
```

The Angular environment is configured in:

```text
front-end/src/environments/environment.ts
```

Default local API URL:

```ts
apiUrl: 'http://localhost:3000/api'
```

## Installation

Install backend dependencies:

```bash
cd back-end
npm install
```

Install frontend dependencies:

```bash
cd ../front-end
npm install
```

## Running Locally

Start the backend API:

```bash
cd back-end
npm run dev
```

The backend runs on:

```text
http://localhost:3000
```

Start the Angular app in a second terminal:

```bash
cd front-end
npm start
```

The frontend runs on:

```text
http://localhost:4200
```

## Available Scripts

### Frontend

```bash
npm start     # Start Angular dev server
npm run build # Build the Angular app
npm test      # Run Angular unit tests
```

### Backend

```bash
npm start     # Start server with Node
npm run dev   # Start server with Nodemon
```

## API Routes

### Auth

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/reset-password
```

### Library

All library routes require a valid JWT token.

```text
GET    /api/library
POST   /api/library
PUT    /api/library/sync/:rawgId
DELETE /api/library/:id
PATCH  /api/library/:id/play-next
```

## Build

Create a production build of the frontend:

```bash
cd front-end
npm run build
```

The generated files will be placed in the Angular `dist/` folder.

## Security Notes

- Do not commit `.env` files.
- Keep `JWT_SECRET`, `MONGO_URI`, and API keys private.
- Use different secrets for development and production.

## License

This project is currently private/personal. Add a license before publishing if you want others to use or contribute to it.
