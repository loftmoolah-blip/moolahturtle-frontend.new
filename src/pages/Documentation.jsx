import React from 'react';

const CodeBlock = ({ language, code }) => (
  <div className="my-4 rounded-lg overflow-hidden bg-gray-900">
    <div className="px-4 py-2 bg-gray-800 text-gray-300 text-sm font-medium">
      {language}
    </div>
    <pre className="p-4 text-sm text-gray-100 overflow-x-auto">
      <code>{code.trim()}</code>
    </pre>
  </div>
);

const readmeContent = `# Moolahturtle

Moolahturtle is a platform designed to connect property sellers directly with real estate investors, streamlining the process of getting cash offers for homes.

---

## Table of Contents

- [Docker-Based Setup (Recommended)](#docker-based-setup-recommended)
- [Manual Local Setup (Alternative)](#manual-local-setup-alternative)
- [Backend Integration Guide](#backend-integration-guide)
- [Code Conventions](#code-conventions)

---

## Docker-Based Setup (Recommended)

Using Docker is the recommended way to run this project for development. It ensures a consistent and isolated environment.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Instructions

1.  **Create Files**: Create the \`Dockerfile\` and \`docker-compose.yml\` files in the project root with the content provided in the sections below.

2.  **Backend \`Dockerfile\`**: The backend developer must first create a \`Dockerfile\` for the backend service. It should expose port \`3001\`.

3.  **Update \`docker-compose.yml\`**: Modify the \`backend\` service in the \`docker-compose.yml\` file to use the backend's \`Dockerfile\` instead of the placeholder image.

4.  **Run the Application**: From the project root directory, run the following command:
    \`\`\`bash
    docker-compose up --build
    \`\`\`
    This command will build the frontend and backend images and start both containers. The frontend code is already configured to communicate with the backend service named 'backend' within the Docker network.

5.  **Access the App**:
    -   The frontend will be available at **http://localhost:3000**.
    -   The backend API will be available at **http://localhost:3001**.

---

## Manual Local Setup (Alternative)

If you are not using Docker, you can run the frontend and backend services separately.

### Prerequisites
-   Node.js (v16 or higher)
-   Your backend server running on \`http://localhost:3001\`

### Frontend Setup
1.  **Update API Host**: In \`components/utils/api.js\`, ensure \`API_BASE_URL\` points to your local backend:
    \`\`\`javascript
    const API_BASE_URL = 'http://localhost:3001/api';
    \`\`\`
2.  **Install Dependencies**:
    \`\`\`bash
    npm install
    \`\`\`
3.  **Run the Development Server**:
    \`\`\`bash
    npm start
    \`\`\`
    The frontend will be running on **http://localhost:3000**.

---

## Backend Integration Guide

The backend server must adhere to the following specifications to work with the frontend.

### 1. Server and CORS Configuration
-   **Base URL**: The server must expose all its endpoints under the \`/api\` prefix (e.g., \`http://localhost:3001/api\`).
-   **CORS**: You must enable CORS to accept requests from the frontend's origin (\`http://localhost:3000\` for local development).

### 2. Authentication Flow (JWT)
The application uses JWT for investor authentication.
-   **Login (\`POST /api/investors/login\`)**: On successful login, the backend must respond with a JSON object containing a \`token\` and \`user\` object.
-   **Authenticated Requests**: The frontend will send the token in the \`Authorization: Bearer <token>\` header for all protected routes.

### 3. Data Models (Schemas)
The source of truth for all data structures is located in the \`entities/\` directory of the frontend project. The backend should adhere to these JSON schemas for request payloads and response bodies.

- \`entities/Investor.json\`
- \`entities/Seller.json\`  
- \`entities/Property.json\`

### 4. Required API Endpoints
The backend must implement the following endpoints. The full list is defined in the frontend file \`components/utils/api.js\`.

**Seller Flow:**
- \`POST /api/sellers/register\`
- \`POST /api/sellers/send-sms\`
- \`POST /api/sellers/:id/verify\`
- \`GET /api/sellers/:id\`
- \`PUT /api/sellers/:id\`

**Investor Flow:**
- \`POST /api/investors/register\`
- \`POST /api/investors/login\`
- \`POST /api/investors/send-otp\` (For phone verification)
- \`POST /api/investors/forgot-password\`
- \`POST /api/investors/reset-password\`
- \`POST /api/investors/send-email-confirmation\`
- \`POST /api/investors/verify-email\`
- \`GET /api/investors/me\` (Gets current user profile from token)
- \`GET /api/investors/:id/leads\`
- \`GET /api/investors/:id\`
- \`PUT /api/investors/:id\`

**Property Flow:**
- \`POST /api/properties\`
- \`GET /api/properties/:id\`
- \`POST /api/properties/:id/upload-photo\` (Should handle file uploads)

**Offers Flow:**
- \`POST /api/offers\`
- \`GET /api/offers/:id\`

---

## Code Conventions
-   **Component Style**: Use functional components with React Hooks.
-   **Styling**: Use Tailwind CSS and shadcn/ui components.
-   **API Interaction**: All API calls are centralized in service classes located in \`components/services/\`.
`;

const dockerfileContent = `# Stage 1: Build the React application
FROM node:18-alpine as builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
# Note: This assumes a standard React build script is available
RUN npm run build

# Stage 2: Serve the static files with a lightweight server
FROM node:18-alpine

WORKDIR /app

# Install 'serve' to run the static site
RUN npm install -g serve

# Copy the build output from the builder stage
COPY --from=builder /app/build ./build

# Expose the port the app runs on
EXPOSE 3000

# The command to run the app
# The -s flag is important for single-page applications
CMD ["serve", "-s", "build", "-l", "3000"]`;

const dockerComposeContent = `version: '3.8'

services:
  # Frontend Service (React App)
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - moolah-net

  # Backend Service (Placeholder)
  # The backend developer needs to create a Dockerfile for their service.
  # This is a sample configuration.
  backend:
    # --- TO BE COMPLETED BY BACKEND DEVELOPER ---
    # build:
    #   context: ./backend  # Assuming backend code is in a 'backend' folder
    #   dockerfile: Dockerfile
    # ---------------------------------------------
    image: node:18-alpine # Using a placeholder image for now
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=your_database_connection_string_here
      - JWT_SECRET=your_jwt_secret_here
      # Add other necessary environment variables
    networks:
      - moolah-net
    # Example command if the backend developer needs it
    # command: npm start

networks:
  moolah-net:
    driver: bridge`;

export default function Documentation() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Documentation & Setup</h1>
          <p className="text-lg text-gray-600 mb-8">
            This page contains the necessary code and instructions to set up your local development environment using Docker and to provide guidance for your backend team.
          </p>

          <section id="readme">
            <h2 className="text-3xl font-semibold text-gray-800 mt-8 border-b pb-2 mb-4">README.md</h2>
            <p className="mb-4 text-gray-700">Create a file named <code className="bg-gray-100 px-2 py-1 rounded">README.md</code> in the project root and copy the content below.</p>
            <CodeBlock language="markdown" code={readmeContent} />
          </section>

          <section id="dockerfile">
            <h2 className="text-3xl font-semibold text-gray-800 mt-8 border-b pb-2 mb-4">Dockerfile</h2>
            <p className="mb-4 text-gray-700">Create a file named <code className="bg-gray-100 px-2 py-1 rounded">Dockerfile</code> (no extension) in the project root and copy the content below.</p>
            <CodeBlock language="dockerfile" code={dockerfileContent} />
          </section>
          
          <section id="docker-compose">
            <h2 className="text-3xl font-semibold text-gray-800 mt-8 border-b pb-2 mb-4">docker-compose.yml</h2>
            <p className="mb-4 text-gray-700">Create a file named <code className="bg-gray-100 px-2 py-1 rounded">docker-compose.yml</code> in the project root and copy the content below.</p>
            <CodeBlock language="yaml" code={dockerComposeContent} />
          </section>

        </div>
      </div>
    </div>
  );
}