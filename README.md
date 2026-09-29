# HireMate — AI Interview & Placement Preparation Platform

HireMate is an **AI-powered interview and placement preparation platform** built using the MERN stack. It helps students and job seekers prepare for technical interviews, coding interviews, resume screening, skill-gap analysis, and personalized learning.

The platform combines **React, Node.js, Express, MongoDB, JWT authentication, and AI APIs** to provide an interactive preparation experience.

---

## 🚀 Features

### 🔐 Authentication

* User registration and login
* JWT-based authentication
* Protected routes
* Role-based access
* Secure password hashing using bcrypt

### 📄 AI Resume Analysis

* Upload resume in PDF format
* Extract resume text automatically
* Analyze resume using AI
* Resume score
* Extracted skills
* Strengths
* Weaknesses
* Missing skills
* Improvement suggestions
* Resume analysis stored in MongoDB
* Uploaded PDF is temporarily stored and deleted after processing

### 🎤 Mock Interviews

* Technical and HR interview modes
* Difficulty selection
* AI-generated interview questions
* Answer submission
* AI-based answer evaluation
* Individual question scores
* Overall interview score
* Interview feedback

### 💻 Coding Interviews

* AI-generated coding questions
* Easy, Medium, and Hard difficulty
* Java coding support
* Problem description
* Input/output format
* Constraints
* AI-based code evaluation
* Score and feedback
* Time and space complexity evaluation

### 📊 Performance Tracking

* Interview history
* Coding interview history
* Overall scores
* Score trends
* Performance statistics

### 🎯 Skill Gap Analysis

* Analyze current skills
* Identify missing skills
* AI-generated skill-gap recommendations
* Personalized improvement areas

### 🗺️ Learning Roadmap

* Personalized learning roadmap
* Recommended topics
* Skill-based preparation path

### 👨‍💼 Admin Dashboard

* Admin authentication
* Dashboard statistics
* User-related information
* Platform monitoring

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* Tailwind CSS
* Lucide React
* Recharts

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer
* pdf-parse

### AI

* OpenRouter / OpenAI-compatible API
* AI-powered resume analysis
* AI-generated interview questions
* AI-based interview evaluation
* AI-generated coding problems
* AI code evaluation
* Skill-gap analysis
* Learning roadmap generation

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## 🏗️ Project Architecture

```text
HireMate
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── server
    ├── controllers
    ├── middleware
    ├── models
    ├── routes
    ├── services
    ├── uploads
    ├── server.js
    └── package.json
```

---

## 🔄 Application Workflow

```text
                 ┌─────────────────┐
                 │      User       │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Authentication  │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │    Dashboard    │
                 └────────┬────────┘
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
    Resume Analysis   Mock Interview   Coding Interview
          │               │                │
          ▼               ▼                ▼
       AI API          AI API           AI API
          │               │                │
          └───────────────┼────────────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │     MongoDB     │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │   Performance  │
                 │    & History   │
                 └─────────────────┘
```

---

## 📁 Installation

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Interview_Prep_MERN
```

---

# ⚙️ Backend Setup

Go to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

OPENROUTER_API_KEY=your_openrouter_api_key
```

Start the development server:

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

---

# 💻 Frontend Setup

Open another terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

## 🔑 Environment Variables

### Server

| Variable             | Description                        |
| -------------------- | ---------------------------------- |
| `PORT`               | Backend server port                |
| `MONGO_URI`          | MongoDB connection string          |
| `JWT_SECRET`         | Secret used for JWT authentication |
| `OPENROUTER_API_KEY` | API key for AI functionality       |

### Client

| Variable       | Description          |
| -------------- | -------------------- |
| `VITE_API_URL` | Backend API base URL |

> Never commit `.env` files or API keys to GitHub.

---

## 🔐 Authentication Flow

HireMate uses JWT-based authentication.

```text
Register
   ↓
Password hashed using bcrypt
   ↓
User stored in MongoDB
   ↓
Login
   ↓
JWT generated
   ↓
Token stored on client
   ↓
Protected API requests
   ↓
Auth Middleware verifies token
```

---

## 🤖 AI Integration

AI functionality is used throughout the platform.

### Resume Analysis

```text
PDF Upload
    ↓
PDF Text Extraction
    ↓
AI Resume Analysis
    ↓
JSON Response
    ↓
MongoDB
```

### Mock Interview

```text
Select Interview Type
        ↓
AI Generates Questions
        ↓
User Answers
        ↓
AI Evaluates Answers
        ↓
Score + Feedback
```

### Coding Interview

```text
Select Difficulty
        ↓
AI Generates Problem
        ↓
User Writes Code
        ↓
AI Evaluates Code
        ↓
Score + Feedback
```

---

## 📊 Database

MongoDB is used as the primary database.

The application stores information such as:

* User accounts
* Target roles
* Skills
* Resume analysis
* Mock interview results
* Coding interview results
* Performance data
* Skill-gap information
* Learning roadmap information

---

## 🧪 Testing Locally

### Backend Syntax Check

```bash
cd server
npm run check
```

### Frontend Lint

```bash
cd client
npm run lint
```

### Frontend Production Build

```bash
cd client
npm run build
```

---

## 🌐 Deployment

### Frontend

The React frontend can be deployed using Vercel.

Configure:

```env
VITE_API_URL=<YOUR_BACKEND_URL>
```

### Backend

The Express backend can be deployed using Render.

Configure the required environment variables:

```env
MONGO_URI=<YOUR_MONGODB_URI>
JWT_SECRET=<YOUR_JWT_SECRET>
OPENROUTER_API_KEY=<YOUR_API_KEY>
PORT=5000
```

### Database

MongoDB Atlas is used for cloud database hosting.

---

## 🔒 Security Considerations

* Passwords are hashed using bcrypt.
* Protected APIs require JWT authentication.
* Environment variables are used for secrets.
* API keys are not exposed to the frontend.
* Resume PDFs are processed temporarily and deleted after analysis.
* File uploads should be restricted to supported PDF files.

---

## 📱 Main Modules

| Module            | Purpose                    |
| ----------------- | -------------------------- |
| Authentication    | Register and login         |
| Dashboard         | User overview              |
| Resume Analyzer   | AI-powered resume analysis |
| Mock Interview    | AI interview preparation   |
| Coding Interview  | Coding problem practice    |
| Interview History | Previous interview results |
| Coding History    | Previous coding results    |
| Performance       | Track progress             |
| Skill Gap         | Identify missing skills    |
| Learning Roadmap  | Personalized preparation   |
| Admin Dashboard   | Platform administration    |

---

## 🎯 Project Objective

The main objective of HireMate is to provide students and job seekers with a single platform where they can:

* Analyze and improve their resume
* Practice technical and HR interviews
* Practice coding problems
* Receive AI-generated feedback
* Identify skill gaps
* Follow a personalized learning roadmap
* Track interview preparation progress

---

## 🔮 Future Enhancements

Possible future improvements include:

* Voice-based AI interviews
* Real-time interview conversations
* Webcam-based interview practice
* More programming languages
* Online code execution
* Advanced resume templates
* Job recommendation system
* Job description vs resume matching
* Email notifications
* Advanced analytics
* Interview difficulty personalization

---

## 👨‍💻 Author

**Vishal Tyagi**

B.Tech — Computer Science & Engineering

GitHub: `visty-exe`

---

## ⭐ Project Highlights

> HireMate is a full-stack AI-powered interview preparation platform that combines **MERN development, authentication, document processing, AI integration, coding evaluation, performance analytics, and personalized learning** into a single application.

---

## 📄 License

This project is developed for educational and academic purposes.
