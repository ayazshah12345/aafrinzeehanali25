# Afsoo Commerce — Modern Full-Stack E-Commerce Platform

A clean, scalable, full-stack e-commerce solution engineered with a clear separation of concerns, supporting distinct **Customer** and **Admin** experiences.

---

## 🏗️ Step 1: Project Architecture Overview

```
aafrinzeeshan/
├── frontend/                     # Client Web Application (React + Vite)
│   ├── public/                   # Static browser assets
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── common/           # Generic UI (Button, Badge, Card, Spinner)
│   │   │   ├── customer/         # Customer Navbar, Footer, Product Card
│   │   │   └── admin/            # Admin Sidebar, Header, Stat Cards
│   │   ├── data/                 # Static UI mock datasets
│   │   ├── layouts/              # CustomerLayout & AdminLayout wrappers
│   │   ├── pages/                # Page View Controllers
│   │   │   ├── customer/         # Customer storefront pages (Home, Products, Detail, Cart, Checkout, Auth, Orders)
│   │   │   └── admin/            # Admin control panel pages (Login, Dashboard, Products, Edit, Orders, Customers)
│   │   ├── styles/               # CSS Design system variables & base utilities
│   │   ├── App.jsx               # React Router layout & endpoint mapping
│   │   └── main.jsx              # React DOM entry point
│   ├── index.html                # Single-page app HTML host
│   ├── package.json
│   └── vite.config.js            # Vite configuration with /api proxy
│
├── backend/                      # API Server (Node.js + Express)
│   ├── src/
│   │   ├── config/               # Environment & server settings
│   │   ├── routes/               # Express modular API routes (health, products, orders, users)
│   │   └── app.js                # Express app setup, CORS, JSON parsers, & middleware
│   ├── .env.example              # Environment variables template
│   ├── .env                      # Local server configuration
│   ├── index.js                  # Express HTTP listener entry point
│   └── package.json
│
└── README.md                     # Architecture & setup guide
```

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### 1. Running the Backend Server
```bash
cd backend
npm install
npm run dev
```
The Express backend server will start on `http://localhost:5000`. You can verify health status at:
`http://localhost:5000/api/health`

### 2. Running the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
The React + Vite frontend will start on `http://localhost:3000`. Open your browser and navigate to `http://localhost:3000`.

---

## 📂 What Each Major Folder Does

1. **`frontend/src/pages/customer/`**: Holds all customer-facing page views (Home showcase, catalog browsing, product detail view, cart management, checkout flow, auth login/register, order history).
2. **`frontend/src/pages/admin/`**: Holds all admin management views (Dashboard analytics, product CRUD catalog tables, product form builders, order fulfillment tracking, customer directory).
3. **`frontend/src/layouts/`**: Houses wrapper templates (`CustomerLayout` and `AdminLayout`) providing consistent headers, sidebars, navigation bars, and footers across page switches.
4. **`frontend/src/components/`**: Modular, reusable UI components organized into `common`, `customer`, and `admin` subdirectories for clean reusability.
5. **`frontend/src/styles/`**: Centralized design system definition with CSS variables for dark/light themes, typography tokens, glassmorphism, responsive grid breakpoints, and form controls.
6. **`backend/src/routes/`**: Modular Express route files providing RESTful API endpoint placeholders for `/api/health`, `/api/products`, `/api/orders`, and `/api/users`.

---

## ✅ What is Implemented in Step 1

- React + Vite single-page application setup with clean layout routes using `react-router-dom`.
- Express REST API server running on port 5000 with CORS enabled and `/api/health` endpoint.
- 8 Customer pages: Home, Products Catalog, Product Details, Cart Summary, Checkout Form, Customer Sign In, Register, My Orders.
- 7 Admin pages: Admin Sign In, Admin Dashboard with statistics, Manage Products table, Add Product form, Edit Product form, Manage Orders table, Manage Customers directory.
- Responsive design system built with CSS variables, typography tokens, custom buttons, badges, card containers, and mobile grid layouts.
- Realistic UI mock datasets for products, categories, orders, and customer accounts.

---

## ❌ What is NOT Implemented (Reserved for Future Steps)

- PostgreSQL database connection and ORM models.
- Real authentication (JWT, password hashing, user session cookies).
- Real Stripe / payment gateway processing.
- Persistent shopping cart state (localStorage or database sync).
- Real database queries for orders or inventory mutation.

---

## 🎯 Next Steps Roadmap (Step 2 Preview)

In **Step 2**, we will introduce:
1. PostgreSQL Database integration & schema setup.
2. User authentication system (Registration, Login, Password Hashing, JWT Tokens, Auth Middleware).
3. Database models for Users, Products, Categories, and Orders.
