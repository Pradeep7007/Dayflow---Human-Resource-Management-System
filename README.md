# 🏢 DayFlow — Human Resource Management System (HRMS)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)

**DayFlow** is an enterprise-grade, modern Human Resource Management System designed to govern workforce attendance, time-off requests, administrative reviews, payroll disbursement, smart insights, health risk alerts, and organizational reporting through a high-contrast light-mode SaaS interface.

---

## 🚀 Key Features & Architectural Phases

### 1. 🎨 Design System & High-Contrast Light Mode
* High-contrast design tokens (`bg-white` cards, `bg-slate-50` secondary containers, `border-slate-200` crisp borders, and `text-slate-900` deep black typography).
* Accessible UI components: `Button`, `Card`, `Badge`, `Input`, `Select`, `Textarea`, `Modal`, `ConfirmationDialog`, `Avatar`, `Table`.

### 2. 🔐 Role-Based Authentication & Security
* JWT-based authentication with `AuthContext` token persistence.
* Role-gated route protection for `Admin`, `HR`, and `Employee` roles.
* Interactive login, forgot password, and email verification screens.

### 3. ⏱️ Shift Attendance & Time Tracking
* Real-time **Check-In** and **Check-Out** attendance widget.
* Working hours calculation and status breakdown (Present, Half-day, Absent, Leave).
* Filterable monthly attendance history logs.

### 4. 📅 Leave & Time-Off Approval Workspace
* Employee leave applications featuring Start/End dates **plus mandatory From Time and To Time fields** (`type="time"`).
* Interactive leave balance widgets (Paid, Sick, Unpaid).
* Admin workspace with Pending, Approved, and Rejected queue tabs and administrative comment logs.
* Bootstrap-style detailed leave review modal.

### 5. 👥 Employee Directory & Role-Gated Governance
* Full employee catalog with dual rendering (Desktop table view & Mobile card grid).
* **Strict Admin-only CRUD operations** (Add, Edit, and Delete employee records).

### 6. 💰 Payroll & Salary Governance
* Gross salary budgeting, net disbursement tracking, and statutory deduction calculations (PF & Income Tax TDS).
* Interactive payslip generator with modal view.

### 7. 📊 Smart Insights & Workforce Risk Alerts
* Automated organizational health observations and department availability tracking.
* Real-time risk alerts categorized by severity (Critical, Warning, Info) with action triggers.

### 8. ❓ HR Help Center, Notifications & Reports
* Searchable HR knowledge base, policy download cards, and support ticket submission form.
* Real-time notification feed filtered by category.
* Comprehensive analytics reports for attendance, leaves, and payroll budgets.

---

## 🛠️ Technology Stack

* **Frontend**: React.js, Tailwind CSS, Lucide React Icons, React Router DOM
* **Backend**: Node.js, Express.js, MongoDB (Mongoose ODM)
* **Authentication**: JSON Web Tokens (JWT), BcryptJS password hashing
* **Design & Fonts**: Plus Jakarta Sans, Inter, Modern SaaS Light-Mode Tokens

---

## 📁 Repository Directory Structure

```
dayflow/
├── About.txt                         # Detailed text overview of DayFlow
├── README.md                         # Full project documentation & instructions
├── client/                           # React Frontend Client
│   ├── public/                       # Public assets (logo.png, index.html)
│   └── src/
│       ├── components/               # UI design system components
│       ├── context/                  # AuthContext global state
│       ├── pages/                    # Application pages (Admin, Employee, Auth, Leave, Payroll, etc.)
│       ├── routes/                   # AppRoutes navigation & ProtectedRoute wrappers
│       └── services/                 # Axios API service instance
└── server/                           # Express Backend Server
    ├── controllers/                  # API Controllers (Leave, Attendance, Payroll, Employee, etc.)
    ├── models/                       # Mongoose Schemas (User, Leave, Attendance, Payroll, etc.)
    ├── routes/                       # Express Route Handlers
    ├── middleware/                   # JWT Auth & Role Middleware
    ├── seedUsers.js                  # Database seeder script
    └── server.js                     # Express App Initialization Entry Point
```

---

## ⚡ Quick Start & Setup Guide

### Prerequisites
* Node.js (v16+ recommended)
* MongoDB database instance (local or MongoDB Atlas)

### 1. Clone & Setup Environment Variables
Ensure `server/.env` contains your database URI and JWT secret:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dayflow
JWT_SECRET=dayflow_super_secret_jwt_key
```

### 2. Start the Backend Server
```bash
cd server
npm install
npm run dev
```

### 3. Start the Frontend Client
```bash
cd client
npm install
npm start
```
The client application will run automatically at `http://localhost:3000`.

---

## 🔑 Default Login Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@dayflow.com` | `adminpass123` |
| **Employee** | `alex@dayflow.com` | `employee123` |

---


## 📄 License
This project is open-source under the [MIT License](LICENSE).
