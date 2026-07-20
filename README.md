# Invoice Generator (Student Training Project)

A basic full-stack Invoice Generator built with **React (Vite) + Tailwind CSS** on the frontend
and **Node.js + Express** on the backend. Data is stored in a simple **JSON file** (`backend/db/db.json`)
acting as a lightweight file-based database — no separate database server needed, perfect for a
short training project.

## Tech Stack
- **Frontend:** React, React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express, JWT auth, bcryptjs
- **Database:** JSON file store (`backend/db/db.json`)

## Project Structure
```
invoice-generator/
├── backend/
│   ├── db/
│   │   ├── db.json          # data file (users + invoices)
│   │   └── database.js      # read/write helper functions
│   ├── middleware/
│   │   └── auth.js          # JWT auth middleware
│   ├── routes/
│   │   ├── auth.js          # register/login/me
│   │   └── invoices.js      # CRUD for invoices
│   ├── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.jsx
    │   ├── components/ (Navbar, ProtectedRoute)
    │   ├── pages/ (Home, Login, Register, Profile, MyInvoices, CreateInvoice, InvoiceView)
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── tailwind.config.js
    └── package.json
```

## Setup & Run

### 1. Backend
```bash
cd backend
npm install
npm run dev        # starts on http://localhost:5000 (uses nodemon)
# or: npm start
```

### 2. Frontend
Open a **second terminal**:
```bash
cd frontend
npm install
npm run dev         # starts on http://localhost:5173
```

Then open **http://localhost:5173** in your browser.

## Pages
| Page            | Route              | Access        |
|-----------------|--------------------|---------------|
| Home            | `/`                | Public        |
| Login           | `/login`           | Public        |
| Register        | `/register`        | Public        |
| Profile         | `/profile`         | Logged-in only|
| My Invoices     | `/my-invoices`     | Logged-in only|
| Create Invoice  | `/create-invoice`  | Logged-in only|
| View Invoice    | `/invoices/:id`    | Logged-in only|

## API Endpoints
| Method | Endpoint             | Description                     |
|--------|-----------------------|----------------------------------|
| POST   | `/api/auth/register`  | Create a new account             |
| POST   | `/api/auth/login`     | Log in and get a JWT token       |
| GET    | `/api/auth/me`        | Get logged-in user profile       |
| POST   | `/api/invoices`       | Create a new invoice             |
| GET    | `/api/invoices`       | List invoices for logged-in user |
| GET    | `/api/invoices/:id`   | Get one invoice (owner only)     |
| PUT    | `/api/invoices/:id`   | Update an invoice (owner only)   |
| DELETE | `/api/invoices/:id`   | Delete an invoice (owner only)   |

All `/api/invoices/*` routes require an `Authorization: Bearer <token>` header —
handled automatically by the frontend once you log in.

## Notes for Students
- The "database" is literally a JSON file (`backend/db/db.json`), read and re-written
  on every change via `backend/db/database.js`. This keeps things simple — no SQL setup needed —
  while still demonstrating a proper data-access layer pattern that you'd later swap for a real DB.
- Passwords are hashed with `bcryptjs` before being stored — never store plain text passwords.
- Invoice totals (subtotal, tax, grand total) are recalculated on the **server**, not trusted
  from the client, which is good practice even in a small project.
- The theme uses Tailwind's `emerald` palette on a dark `bg-emerald-950` background throughout.
