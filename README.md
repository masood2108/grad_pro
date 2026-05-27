# 🎓 EventSphere LMS ERP Platform

EventSphere LMS ERP Platform is a modern AI-ready Learning Management and Event Management system built using React and Firebase. The platform combines online learning, attendance tracking, QR ticketing, fee management, event organization, analytics, notifications, and live online classes into a single powerful ERP solution.

The system is designed for:

- Students
- Faculty
- Admins
- Parents
- Organizers

It provides a futuristic dashboard experience with real-time Firebase integration, responsive UI, Razorpay payment integration, QR attendance systems, and advanced management tools.

---

# 🚀 Project Overview

This project was developed as a next-generation ERP + LMS platform that combines:

- Learning Management System (LMS)
- Event Management System
- Attendance System
- Fee Management
- QR Ticketing
- Analytics Dashboard
- Online Classes
- Notifications System

The platform focuses on modern UI/UX, real-time synchronization, scalability, and smart automation.

---

# ✨ Features Implemented

## 🔐 Authentication & Role Management

- Firebase Authentication
- Role-based dashboards
- Admin / Faculty / Student / Parent / Organizer access
- Protected routes

---

## 📚 Course Management

- Add courses
- Manage course content
- Student enrollment
- Course progress tracking

---

## 📝 Assignment Management

- Create assignments
- Submit assignments
- Faculty review system
- Submission tracking

---

## 📊 Analytics Dashboard

- Real-time analytics
- Attendance insights
- Course statistics
- Event tracking
- Student progress monitoring

---

## 📅 Event Management

- Create and manage events
- Volunteer management
- Sponsor management
- Event registrations

---

## 🎟 QR Ticketing System

- QR ticket generation
- QR attendance scanner
- Event entry validation
- Smart ticket access

---

## 💳 Fee Management

- Student fee records
- Razorpay payment integration
- Online payment support
- Payment status updates
- Pending/Paid tracking

---

## 🔔 Notification System

- Realtime alerts
- Important announcements
- User-specific notifications

---

## 🎥 Online Classes

- Live class session management
- Join class functionality
- Faculty live session control

---

## 📈 Attendance System

- Student attendance tracking
- QR-based attendance
- Attendance analytics
- Faculty attendance management

---

## 🏆 Certificate Management

- Generate certificates
- Student achievement tracking
- Certificate issuing system

---

# 🛠 Tech Stack Used

## Frontend

- React.js
- Tailwind CSS
- Framer Motion
- React Icons
- Recharts

---

## Backend & Database

- Firebase Firestore
- Firebase Authentication
- Firebase Hosting

---

## Payment Integration

- Razorpay

---

## QR & Utilities

- html5-qrcode
- jsPDF
- html2canvas
- @react-pdf/renderer

---

# ⚙️ Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone <your-github-repo-link>
```

---

## 2️⃣ Navigate to Project

```bash
cd lmsed
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

## 4️⃣ Start Development Server

```bash
npm start
```

The app will run on:

```bash
http://localhost:3000
```

---

# 🔥 Firebase Setup

## Create Firebase Project

Go to:

https://console.firebase.google.com

Create a new project.

---

## Enable Services

Enable:

- Authentication
- Firestore Database
- Hosting

---

## Add Firebase Config

Create:

```bash
src/firebase/firebase.js
```

Add your Firebase credentials.

Example:

```javascript
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {

  apiKey: "YOUR_API_KEY",

  authDomain: "YOUR_AUTH_DOMAIN",

  projectId: "YOUR_PROJECT_ID",

  storageBucket: "YOUR_STORAGE_BUCKET",

  messagingSenderId: "YOUR_SENDER_ID",

  appId: "YOUR_APP_ID"

}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export const auth = getAuth(app)
```

---

# 💳 Razorpay Setup

Add Razorpay script in:

```bash
public/index.html
```

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

Use Razorpay Test Keys for development.

---

# 📁 Project Structure

```bash
src/
│
├── components/
├── pages/
├── layouts/
├── firebase/
├── context/
├── assets/
└── App.js
```

---

# 🌟 Future Enhancements

- AI Attendance Monitoring
- AI Student Performance Prediction
- AI Chatbot Assistant
- AI Recommendation Engine
- AI Smart Timetable Generator
- Face Recognition Attendance
- Deep Learning Analytics
- Video Call Integration
- AI Exam Proctoring

---

# 👨‍💻 Developed By

Masood Hussain

B.Tech ECE — VNR VJIET

---

# 📌 Conclusion

EventSphere LMS ERP Platform is a scalable and futuristic ERP ecosystem that integrates LMS, event systems, attendance management, analytics, online payments, QR systems, and online classes into a unified platform.

The project demonstrates full-stack development, real-time database handling, payment integration, responsive UI/UX design, and scalable architecture using modern technologies.