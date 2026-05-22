# LostLink

LostLink is a full-stack MERN application designed to streamline the process of reporting, tracking, and recovering lost or found items through a centralized digital platform.  

The platform enables users to create item reports, manage claims securely, and interact with an admin moderation system for ownership verification. It focuses on structured workflow handling, secure authentication, and scalable backend organization.

---

## Live Demo

🔗 [https://lostlink-jbqg.onrender.com]

---

## Motivation

LostLink was built to simplify the traditional lost-and-found process commonly seen in campuses, public spaces, and organizations.  

Instead of relying on disconnected announcements or manual coordination, the platform provides a centralized system where users can:
- report lost/found items,
- track claim requests,
- securely authenticate identities,
- and manage ownership verification through an admin workflow.

The project also helped strengthen concepts related to backend architecture, authentication systems, middleware handling, and full-stack application integration.

---

# Features

## Authentication & Security
- Session-based user authentication
- Google OAuth login using Passport.js
- Protected routes for authorized access
- OTP-based password recovery flow

## Lost & Found Workflow
- Create and manage lost/found item reports
- Upload item images with metadata
- Track claim requests and report status
- Search and browse reported items

## Admin Moderation System
- Review ownership claims
- Approve or reject recovery requests
- Monitor active reports and platform activity

## User Experience
- Responsive frontend interface
- Dashboard for managing reports and claims
- Real-time status visibility for submitted items
- Integrated chatbot-based assistance module

---

# Tech Stack

## Frontend
- React.js
- Bootstrap
- Vanilla CSS

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication & Sessions
- Passport.js
- Google OAuth Strategy
- express-session

## Additional Tools & Services
- Multer (image uploads)
- Nodemailer (OTP/email support)
- dotenv
- MongoDB Atlas

---

# Architecture Overview

1. Users authenticate using local login or Google OAuth.
2. Protected routes allow authenticated users to create lost/found reports.
3. Uploaded images are processed through Multer middleware.
4. Item metadata and user information are stored in MongoDB using Mongoose schemas.
5. Claims submitted by users are routed through an admin moderation workflow.
6. Admins can verify and approve/reject ownership requests.
7. Session management maintains secure authenticated access across routes.

---

# Folder Structure

```bash
LostLink/
│
├── client/                 # React frontend
│
├── server/                 # Backend services
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── config/
│   └── app.js
│
├── public/                 # Static assets
├── views/                  # EJS views (if applicable)
├── .env
├── package.json
└── README.md
```

---

# Screenshots

## Home Page
![Home Page](./screenshots/home.png)

## Dashboard
![Dashboard](./screenshots/dashboard.png)

## Report Item Page
![Report Page](./screenshots/report.png)

## Admin Panel
![Admin Panel](./screenshots/admin.png)

---

# Sample API Routes

```http
POST   /api/auth/login
POST   /api/auth/register
POST   /api/items/report
GET    /api/items/:id
POST   /api/claims/create
PATCH  /api/admin/claims/:id
```

---

# Installation & Setup

## Prerequisites

- Node.js
- npm
- MongoDB Atlas or local MongoDB instance
- Git

---

## Clone Repository

```bash
git clone https://github.com/yourusername/LostLink.git

cd LostLink
```

---

## Install Dependencies

### Backend

```bash
npm install
```

### Frontend

```bash
cd client
npm install
cd ..
```

---

# Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8080

MONGO_URL_ATLAS=your-atlas-uri
MONGO_URL_LOCAL=mongodb://127.0.0.1:27017/lostlink

SESSION_SECRET=your-session-secret

EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

# Run Development Server

```bash
npm run dev
```

---

# Challenges Faced

- Managing session persistence across authentication flows
- Structuring scalable Express routes and middleware
- Handling secure OTP verification logic
- Managing image uploads and associated metadata
- Synchronizing frontend dashboard updates with backend state

---

# Future Improvements

- AI-based image similarity matching for item recovery
- WebSocket-based real-time notifications
- Advanced search and filtering
- Dockerized deployment pipeline
- Role-based analytics dashboard
- Automated spam and duplicate report detection

---

# Key Learnings

Through this project, I improved my understanding of:
- Full-stack MERN application architecture
- Authentication and session management
- REST API structuring
- Middleware-based backend organization
- MongoDB schema design
- Deployment and environment configuration

---

# Deployment

The application is deployed and accessible online.

Frontend Deployment: Vercel / Netlify  
Backend Deployment: Render / Railway / Node Server  
Database: MongoDB Atlas

---

# Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

# License

This project is licensed under the MIT License.
