# 🏢 Mini HRM (Human Resource Management) System

Mini HRM is a modern, lightweight web application designed to streamline employee management and attendance tracking. It provides a secure, role-based platform where administrators can manage workforce data and employees can easily record their attendance.

## 🚀 Features

### For Administrators
- **Dashboard**: Overview of system status and quick stats.
- **Employee Management**: CRUD operations for employee records.
- **Attendance Monitoring**: View entire attendance history and approve/reject records.
- **User Management**: Approve new employee registrations.

### For Employees
- **Self-Service Portal**: View personal details.
- **Attendance**: Easy "Clock In" and "Clock Out" functionality.
- **History**: View personal attendance logs.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | React.js (Vite) | Fast, modern UI library |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Backend** | Node.js + Express | Robust REST API server |
| **Database** | MySQL | Relational database management |
| **Auth** | JWT + Bcrypt | Secure authentication & hashing |
| **Uploads** | Multer | Handling file uploads (e.g. photos) |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **MySQL Server** (v8.0 recommended) - [Download](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download](https://git-scm.com/)

---

## ⚙️ Installation & Setup Guide

Follow these steps to set up the project locally.

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mini-hrm.git
cd mini-hrm
```

### 2. Backend Setup
Navigate to the server directory and install dependencies.
```bash
cd server
npm install
```

**Configuration (.env):**
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   *(Or manually rename `.env.example` to `.env`)*
   
2. Open `.env` and configure your database settings:
   ```ini
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=hrm_db
   JWT_SECRET=secure_random_string
   ```

**Database Initialization:**
Run the setup script to create the database and required tables automatically.
```bash
node setup-db.js
```
*Output should show: `✅ Database setup complete!`*

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies.
```bash
cd client
npm install
```

---

## 🏃‍♂️ Running the Application

You need to run both the backend server and frontend client simultaneously.

### Start Backend Server
```bash
# In the 'server' directory
npm run dev
```
server will run on `http://localhost:5000`

### Start Frontend Client
```bash
# In the 'client' directory
npm run dev
```
Client will run on `http://localhost:5173` (Open this URL in your browser)

---

## 🔑 Default Login Credentials

The setup script creates a default administrator account:

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `admin123` |

> **Note:** For security, please change the admin password after the first login.

---

## 📂 Project Structure

```
mini-hrm/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Full page views (Dashboard, Login, etc.)
│   │   └── services/       # API service functions (Axios)
│   └── ...
├── server/                 # Backend Node.js application
│   ├── config/             # Database connection & setup
│   ├── controllers/        # Request logic handler
│   ├── middlewares/        # Auth & Role verification
│   ├── models/             # Database queries (SQL)
│   ├── routes/             # API Endpoints
│   └── uploads/            # Storage for user uploads
└── README.md
```

---

## 🔧 Troubleshooting

### Database Connection Error
- Ensure MySQL server is running.
- Verify `DB_USER` and `DB_PASSWORD` in `server/.env` are correct.
- If using XAMPP, ensure Apache and MySQL services are started.

### CORS Errors
- If the frontend cannot communicate with the backend, check that the backend is running on the expected port (default: 5000) and that the frontend API service is pointing to the correct URL.

### "Unknown At Rule @apply" (VS Code)
- This is a harmless linting warning for Tailwind CSS. 
- A `.vscode/settings.json` file is included to suppress this specific warning.

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
