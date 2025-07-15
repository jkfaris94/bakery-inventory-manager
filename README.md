# Maeve’s Fine Baked Goods Inventory Manager

A full‑stack bakery inventory management application built with React, React Router, Express, and Knex/PostgreSQL.  Track raw ingredients, compose recipes, and record baked goods in real time.

\--

## 📂 Repository

**GitHub:** [jkfaris94](https://github.com/jkfaris94/bakery-inventory-manager.git)

## 🏠 Live Demo
* launch backend to start database then view frontend 
**Backend (API):** [https\://\](https://bakery-inventory-manager.onrender.com/)
**Frontend:** [https\://\](https://bakery-inventory-manager-frontend.onrender.com/)

\--

## 📋 Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Environment Variables](#environment-variables)
  * [Installation](#installation)
  * [Database Setup](#database-setup)
  * [Migrations & Seeding](#migrations--seeding)
  * [Running Tests](#running-tests)
  * [Running the App](#running-the-app)
* [Project Structure](#project-structure)
* [User Stories](#user-stories)
* [Contributing](#contributing)
* [License](#license)

\--

## ✨ Features

* **Recipes CRUD** with images, descriptions, and cascading delete
* **Ingredients CRUD** with quantity tracking
* **Recipe‑Ingredients** join allowing custom units & amounts
* **Bake** a recipe to decrement ingredients and increment baked goods
* **Cascade deletes** ensure database integrity
* **404 & 405 handlers** on both API & client side
* **Toast notifications** for success & error feedback
* **AbortController** on data loading to prevent memory leaks

## 🧰 Tech Stack

* **Frontend:** React, React Router v6, Bootstrap 5, react‑hot‑toast
* **Backend:** Node.js, Express, Knex.js, PostgreSQL (dev), SQLite (test)
* **Testing:** Jest, Supertest (backend), in‑memory SQLite for tests
* **Deployment:** Vercel / Netlify (frontend), Heroku / Render (backend)

## 🚀 Getting Started

### Prerequisites

* Node.js v16+ & npm
* PostgreSQL 12+ (for development)
* Git

### Environment Variables

Create a `.env` in the **backend** folder from the sample:

```bash
dir backend\cp .env.sample .env
```

Then edit `backend/.env`:

```
DATABASE_URL=postgresql://bakery_inventory_manager_user:ZN4Vh8KBk1bvpMnZC12nFoTlop8jNcXe@dpg-d1cthv95pdvs73c5f7ag-a.oregon-postgres.render.com/bakery_inventory_manager?ssl=true
LOG_LEVEL=info
```

### Installation

```bash
# Clone
git clone https://github.com/jkfaris94/bakery-inventory-manager.git
cd YOUR_REPO_NAME

# Install deps for both projects
npm install          
cd backend && npm install
cd ../frontend && npm install
```

### Database Setup

1. Create your development database in PostgreSQL:

   ```sql
   CREATE DATABASE bakery_inventory;
   ```
2. In `backend/knexfile.js`, ensure `DATABASE_URL` matches your `.env`.

### Migrations & Seeding

From `/backend`:

```bash
# Run migrations
npx knex migrate:latest

# Seed development data
npx knex seed:run
```

### Running Tests

Tests run against an in‑memory SQLite database.

```bash
# From project root
npm test
```

### Running the App

**Backend** (runs on :5001 by default):

```bash
cd backend
npm start
```

**Frontend** (runs on :3000 by default):

```bash
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.


## 📖 User Stories

1. Landing page navigation
2. Recipes listing, viewing, creating, deleting
3. Ingredients listing, viewing, creating, editing, deleting
4. Recipe‑ingredient management
5. Bake functionality with ingredient depletion & baked\_goods tracking
6. Error & not‑found handling

## 🤝 Contributing

This repo is a final capstone submission—please do not submit PRs. Feel free to fork and build on it!

© Johnny Faris 
