# 🎶 Sonatta

> **Cloud-ready SaaS platform for music schools built with React, Node.js, Express, PostgreSQL, and modern software engineering practices.**

Sonatta is an end-to-end Software-as-a-Service (SaaS) platform designed to simplify the management of music schools by connecting students, teachers, and educational institutions in a single ecosystem.

The platform focuses on **security**, **scalability**, **multi-tenant architecture**, **real-time communication**, **payment processing**, and **automated testing**, providing a complete digital experience for music education.

---

# 🚀 Project Highlights

- 🔐 JWT Authentication & Role-Based Access Control (RBAC)
- 🏫 Multi-tenant architecture for institutions
- 💬 Real-time messaging with Socket.IO
- 📅 Lesson scheduling with conflict validation
- 💳 Mercado Pago payment integration
- 📁 File uploads with Supabase Storage
- 🔔 Real-time notification system
- ⭐ Teacher review system
- 📊 Student learning progress tracking
- 🧪 Automated Unit, Integration and End-to-End Tests
- ⚙️ GitHub Actions Continuous Integration

---

# 🏗️ Architecture

```
                 React + Vite
                       │
                  REST API
                       │
               Node.js + Express
                       │
          JWT Authentication (RBAC)
                       │
                 PostgreSQL
                       │
              Supabase Storage
                       │
      Mercado Pago • Socket.IO
```

---

# 🛠 Tech Stack

## Backend

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Socket.IO
- Multer
- Mercado Pago SDK
- Supabase Storage

---

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Socket.IO Client

---

## Testing

- Jest
- Supertest
- Playwright

---

## DevOps & CI

- Git
- GitHub
- GitHub Actions

---

# 🔐 Security

The project follows modern backend security practices, including:

- JWT Authentication
- Role-Based Access Control (RBAC)
- Protected Routes
- Input Validation
- Password Encryption
- Multi-Tenant Isolation

---

# 👥 User Roles

### 🎓 Student

- Enroll in courses
- Access lessons
- Track learning progress
- Chat with teachers
- Receive notifications

---

### 🎼 Independent Teacher

- Manage students
- Schedule lessons
- Upload learning materials
- Public professional profile
- YouTube & Spotify integration

---

### 🏫 Institution

- Manage teachers
- Manage students
- Financial dashboard
- Reports
- Course management

---

### 👑 Super Admin

- Institution approval
- SaaS subscription management
- Platform administration
- Global monitoring

---

# ⭐ Core Features

- Authentication & Authorization
- Student Dashboard
- Teacher Dashboard
- Institution Dashboard
- Course Management
- Lesson Scheduling
- Student Progress Tracking
- Teacher Marketplace
- Notifications
- Chat
- Reviews
- File Upload
- Financial Management
- Payment Integration
- Reporting System

---

# 🧪 Automated Testing

## Backend

- Unit Tests (Jest)
- Integration Tests (Supertest)

```bash
cd server
npm test
```

---

## Frontend

End-to-End Tests with Playwright.

```bash
cd client
npx playwright test
```

---

# ⚙️ Running Locally

## Prerequisites

- Node.js 20+
- PostgreSQL
- Supabase Account

---

## Backend

```bash
cd server
npm install
```

Create:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection
JWT_SECRET=your_secret
NODE_ENV=development
```

Run:

```bash
npm run dev
```

---

## Frontend

```bash
cd client
npm install
```

Create:

```env
VITE_API_URL=http://localhost:5000
```

Run:

```bash
npm run dev
```

---

# 📂 Repository Structure

```
client/
 ├── src/
 ├── public/

server/
 ├── controllers/
 ├── middleware/
 ├── models/
 ├── routes/
 ├── services/
 ├── tests/
```

---

# 📈 Engineering Highlights

This project demonstrates practical experience with:

- REST API Design
- Authentication & Authorization
- Backend Architecture
- Software Security
- Database Modeling
- Automated Testing
- CI/CD Pipelines
- Real-Time Communication
- Payment Gateway Integration
- File Storage
- Multi-Tenant Systems

---

# 🚧 Roadmap

## ✅ Completed

- Authentication
- RBAC
- Chat
- Notifications
- Payments
- Teacher Marketplace
- Institution Management
- File Upload
- Automated Tests
- CI Pipeline

## 🔄 Planned

- Kubernetes Deployment
- AWS Infrastructure
- Observability
- Performance Improvements
- API Documentation
- Mobile Application

---

# 📸 Screenshots

> Screenshots will be added soon.

- Login
- Student Dashboard
- Teacher Dashboard
- Institution Dashboard
- Marketplace
- Chat

---

# 👨‍💻 Authors

Developed by:

- Felipe Cardoso Lopes
- Kayo Muller
- Guilherme Barros
- João Roberto

Students of **Centro Universitário de Brasília (CEUB)**.

---

# 📄 License

This project was developed for educational and portfolio purposes.

All rights reserved.
