# 🇧🇩 BazaarBD — Bangladesh E-Commerce Platform

A production-ready e-commerce platform built for the Bangladesh market featuring Next.js 14, Tailwind CSS, an active REST API & Database engine, and SSLCOMMERZ gateway architecture.

## 🚀 Quick Start (Manual Run)

Open 3 separate terminals:

### 1. Database & REST API Server (Port 8000)
```powershell
cd server
node server.js
```

### 2. Customer Storefront (Port 3000)
```powershell
cd frontend
npm run dev
```

### 3. Admin Dashboard (Port 3001)
```powershell
cd admin
npm run dev -- -p 3001
```

## 🌐 Live URLs
- **Storefront**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001 (Login: `admin@bazaarbd.com` / `admin123`)
- **API Health**: http://localhost:8000/api/v1/health


## Tech Stack
- **Backend**: Laravel 11, PHP 8.2, MySQL 8.0, Redis, Sanctum
- **Frontend**: Next.js (React), Tailwind CSS
- **Admin**: Next.js (React), Tailwind CSS
- **Infrastructure**: Docker, Nginx

## Quick Start (Docker)

1. Clone the repository and navigate to the root directory.
2. Setup environment variables:
   ```bash
   cp backend/.env.example backend/.env
   # Generate APP_KEY inside workspace container or via host php if available
   ```
3. Start the infrastructure:
   ```bash
   docker-compose -f docker/docker-compose.yml up -d
   ```
4. Install backend dependencies and run migrations:
   ```bash
   docker exec -it bazaarbd_php bash
   composer install
   php artisan key:generate
   php artisan migrate --seed
   exit
   ```

## Manual Setup Instructions

If you prefer running without Docker:
1. Ensure PHP 8.2, MySQL 8.0, Redis, and Node 20 are installed locally.
2. In `backend/`: Run `composer install`, setup `.env`, `php artisan key:generate`, `php artisan migrate`, and `php artisan serve`.
3. In `frontend/` and `admin/`: Run `npm install` and `npm run dev`.

## Ports and Access
- Frontend App: `http://localhost:3000`
- Admin Panel: `http://localhost:3001`
- Backend API: `http://localhost:8000/api/v1`
- Mailhog (Email Testing): `http://localhost:8025`

## API Endpoints Summary

### Public
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/send-otp`
- `POST /api/v1/auth/verify-otp`
- `GET /api/v1/products`
- `GET /api/v1/categories`

### Customer (Requires Token)
- `GET /api/v1/profile`
- `GET /api/v1/cart`
- `POST /api/v1/checkout`
- `GET /api/v1/orders`

### Admin (Requires Admin Token)
- `POST /api/v1/admin/auth/login`
- `GET /api/v1/admin/dashboard/stats`
- `GET /api/v1/admin/orders`
- `GET /api/v1/admin/products`

## Admin Access Instructions
- **Email**: admin@bazaarbd.com
- **Password**: password
*(Assuming default seeder credentials)*
