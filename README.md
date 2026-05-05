# 🚀 Team Task Manager (Full-Stack)

A modern full-stack web application to manage projects and tasks with secure authentication and role-based access control (Admin / Member).

This project demonstrates real-world backend architecture, REST APIs, and frontend integration.

---

## 📌 Overview

The **Team Task Manager** allows teams to:
- Create and manage projects
- Assign and track tasks
- Control access based on user roles

---

## ✨ Features

### 🔐 Authentication
- User Signup & Login
- JWT-based authentication
- Secure password hashing (bcrypt)

### 👥 Role-Based Access Control
- **Admin**
  - Create projects
  - Create & assign tasks
- **Member**
  - View assigned tasks
  - Update task status

### 📁 Project Management
- Create projects
- View all projects

### ✅ Task Management
- Create tasks
- Assign tasks to users
- Link tasks to projects
- Update task status:
  - `todo`
  - `in-progress`
  - `done`

### 🔗 Relationships
- Task → User
- Task → Project

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- bcrypt (Password hashing)

### Frontend
- React (Vite)
- Axios (API calls)
- Tailwind CSS (optional UI)

---

## 📁 Folder Structure
