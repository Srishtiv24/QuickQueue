# 🏥 Quick Queue – Smart Hospital Queue Management System

## 🚀 Overview

**Quick Queue** is a full-stack application designed to digitize hospital queues and reduce patient waiting time. It enables patients to join a department queue remotely, track their position in real time, and arrive only when their turn is near.

👉 This project models a **single-hospital system** using a **department-based queue** (no doctor selection), reflecting real-world OPD workflows.

---

## 💡 Problem Statement

Traditional hospital queues:

* Long physical waiting lines
* No visibility into wait time
* Inefficient crowd management

**Quick Queue solves this by:**

* Digital token generation
* Live queue tracking
* Smart notifications
* Better flow control for hospitals

---

## 🧠 Core Concept

### Department-Based Queue

* User selects a **department** (e.g., General OPD, Dental)
* System assigns a **token number**
* Multiple doctors serve from a **shared queue**

✅ Simple UX
✅ Faster throughput
✅ Realistic for government/private hospitals

---

## ✨ Features

### 👤 Patient App

* Register / Login (JWT/OTP-ready)
* View departments with live stats
* Join queue → get token + ETA
* Real-time queue tracking
* Check-in at hospital
* Cancel / rejoin queue
* Appointment history
* Feedback & ratings

### 👨‍⚕️ Doctor Panel (Optional in MVP)

* View current queue
* Call next patient
* Pause / resume queue
* Handle emergency insertions

### 🏥 Admin Dashboard

* Create & manage departments
* Configure average consultation time
* Monitor live queues
* View analytics (daily patients, avg wait time)

---

## 📱 User Flow (Patient)

1. Login → Select Department
2. View queue stats (current token, waiting count, ETA)
3. Join queue → receive token
4. Track position in real time
5. Get notification when turn is near
6. Check-in at hospital
7. Consultation → marked complete

---

## 🏗️ System Architecture

```
Frontend (React / Next.js)
        ↓
Backend API (Node.js + Express)
        ↓
Database (MongoDB)
        ↓
Real-time Layer (Socket.io / Firebase)
        ↓
Notification Service (Push / SMS - optional)
```

---

## 🧩 Tech Stack

### 🌐 Frontend

* React / Next.js
* Tailwind CSS / CSS Modules
* Axios / Fetch API
* State Management (Context / Redux)

### ⚙️ Backend

* Node.js
* Express.js
* JWT Authentication

### 🗄️ Database

* MongoDB (Mongoose)

### 🔄 Real-Time

* Socket.io (preferred) or Firebase

---

## 📁 Project Structure
quick-queue/
│
├── client/                # Frontend (React)
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── utils/
│
├── server/                # Backend (Node.js)
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── config/
│
├── README.md
└── package.json
