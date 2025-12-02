# Maeve’s Fine Baked Goods Inventory Manager

A full‑stack bakery inventory management application built with React, React Router, Express, and Knex/PostgreSQL.  Track raw ingredients, compose recipes, and record baked goods in real time.

\--

## 📂 Repository

**GitHub:** [jkfaris94](https://github.com/jkfaris94/bakery-inventory-manager.git)
**Source README:** [Starter Repo README](https://github.com/Thinkful-Ed/starter-bakery-inventory-manager/blob/main/README.md)

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
* [User Stories](#user-stories)
* [Contributing](#contributing)

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
* **Backend:** Node.js, Express, Knex.js, PostgreSQL (dev/production via Neon), SQLite (test)
* **Testing:** Jest, Supertest (backend), in‑memory SQLite for tests
* **Deployment:** Render (frontend & backend), Neon (PostgreSQL database)

## 🚀 Getting Started

### Prerequisites

* Node.js v16+ & npm
* PostgreSQL 12+ (for development)
* Git

### Environment Variables

Create a `.env` in the **backend** folder:

```bash
# On Windows
copy .env.sample .env

# On Mac/Linux
cp .env.sample .env
```

Then edit `backend/.env`:

```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require&channel_binding=require
LOG_LEVEL=info
```

**For Production (Neon):**
- Get your connection string from [Neon Console](https://console.neon.tech)
- The connection string should include `sslmode=require` for secure SSL connections
- Set this as the `DATABASE_URL` environment variable in your deployment platform (e.g., Render)
- Example format: `postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require&channel_binding=require`

### Installation

```bash
# Clone
git clone https://github.com/jkfaris94/bakery-inventory-manager.git
cd bakery-inventory-manager

# Install deps for both projects
npm install          
cd backend && npm install
cd ../frontend && npm install
```

### Database Setup

**For Local Development:**
1. Create your development database in PostgreSQL:

   ```sql
   CREATE DATABASE bakery_inventory;
   ```
2. Update `backend/.env` with your local PostgreSQL connection string.

**For Production (Neon):**
1. Create a free account at [Neon](https://neon.tech)
2. Create a new project and database
3. Copy the connection string from the Neon dashboard
4. Set `DATABASE_URL` in your deployment platform's environment variables (e.g., Render)
5. Migrations and seeds will run automatically on server startup

**Note:** Neon's free tier provides 0.5GB storage with no auto-deletion, making it ideal for portfolio projects.

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
