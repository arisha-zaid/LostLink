# LostLink

LostLink is a MERN-based Lost & Found platform that enables users to report, search, and claim lost or found items efficiently. The platform integrates machine learning for image-based item matching and offers a user-friendly interface to manage reports, track claims, and ensure secure handling through admin approval.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User authentication with session management
- Report lost or found items with images and details
- ML-based matching system to recommend potential matches
- Admin panel for approving or rejecting item claims
- OTP-based password recovery via mobile
- Google Sign-In support
- Real-time dashboard and alerts
- Integrated chatbot-based help desk

---

## Tech Stack

**Frontend:**
- React.js
- Tailwind CSS
- Axios
- EJS (for SSR-based modules if used)

**Backend:**
- Node.js
- Express.js
- MongoDB (Atlas + Local fallback)
- Mongoose
- Passport.js (Authentication)

**Machine Learning:**
- Python-based ML model for image similarity detection
- Flask API or Python service to interface with Node.js

**Other Tools:**
- Multer (File/image uploads)
- dotenv (Environment config)
- Express-session
- Nodemailer (for OTP & email support)
- JWT (optional for tokenized routes)

---

## Folder Structure
LostLink/
├── client/ # React frontend
│ └── ...
├── server/ # Node.js backend
│ ├── routes/
│ ├── models/
│ ├── controllers/
│ ├── middleware/
│ ├── ml/ # Python ML interaction (if any)
│ └── app.js
├── views/ # EJS views (if used)
├── public/ # Static assets
├── .env
├── package.json
└── README.md

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB (local or Atlas)
- Python (for ML integration)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/LostLink.git
   cd LostLink
2. Install dependencies:
    npm install
    cd client
    npm install
    cd ..
3. Set up environment variables:
     PORT=8080
     MONGO_URL_ATLAS=your-atlas-uri
     MONGO_URL_LOCAL=mongodb://127.0.0.1:27017/lostlink
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     JWT_SECRET=your-jwt-secret
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     SMS_API_KEY=your-sms-api-key (if using for OTP)
4. Start the development servers:
     npm run dev

   Contributions are welcome. Please fork the repository, create a new branch, and submit a pull request with a clear explanation of your changes.


