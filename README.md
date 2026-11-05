# Kinbo

Kinbo is a full-stack online shopping website built for the Bangladesh market. It has a customer storefront, an admin dashboard and a REST API. Customers can register with OTP verification, browse products, manage a cart, check out and track orders. Admins manage orders and products from a separate dashboard.

> Personal portfolio project by MD. Mahmudul Hasan.

## Live Demo

| Part | Link |
|---|---|
| Storefront | https://bazaarbd-ecommerce.vercel.app/ |
| Admin Dashboard | https://bazaarbd-admin-pfy5ehjg2-md-mahmudul-hasans-projects-5eead7ea.vercel.app/ |
| API Health Check | https://bazaarbd-api.onrender.com/api/v1/health |

*The API runs on a free Render plan and may take up to a minute to wake up on the first request.*

## Tech Stack

| Layer | Technology |
|---|---|
| Backend API | Laravel 11, PHP 8.2 |
| Database | MySQL 8.0 |
| Cache | Redis |
| Authentication | Laravel Sanctum (token based) |
| Storefront | Next.js, React, Tailwind CSS |
| Admin Dashboard | Next.js, React, Tailwind CSS |
| Infrastructure | Docker, Nginx |
| Deployment | Render (API), Vercel (frontends) |
| Local email testing | Mailhog |

## Features

**Customer**
- Register, login and OTP verification
- Browse products and categories
- Cart management
- Checkout and order history
- Profile

**Admin**
- Separate admin login
- Dashboard statistics
- Order list
- Product list

**Payments**
- SSLCOMMERZ: [Implemented / Sandbox only / Planned]

## Project Structure

```
kinbo-ecommerce/
|-- backend/      # Laravel REST API
|-- frontend/     # Customer storefront (Next.js)
|-- admin/        # Admin dashboard (Next.js)
|-- docker/       # Docker configuration
|-- render.yaml   # Render deployment config
`-- README.md
```

## API Overview

Base URL (local): `http://localhost:8000/api/v1`

| Access | Endpoints |
|---|---|
| Public | Register, Login, Send OTP, Verify OTP, List products, List categories, Health check |
| Customer (token required) | Profile, Cart, Checkout, Orders |
| Admin (admin token required) | Admin login, Dashboard stats, Orders, Products |

Full route list: `backend/routes/api.php`

## Getting Started

### Prerequisites
- PHP 8.2 and Composer
- Node.js 18 or higher
- MySQL 8.0 and Redis (or Docker)

### Run with Docker

```bash
git clone https://github.com/Mahmudul20-42895-1/kinbo-ecommerce.git
cd kinbo-ecommerce
docker compose up -d
```

[CHECK: add the exact command you use if different]

### Run manually

**Backend**
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8000
```

**Storefront**
```bash
cd frontend
npm install
npm run dev
```

**Admin dashboard**
```bash
cd admin
npm install
npm run dev
```

Local ports: API `8000`, Storefront [PORT], Admin [PORT], Mailhog `8025`.

### Admin account

`php artisan migrate --seed` creates a default admin account (see `backend/database/seeders`). **Change its password immediately and never use default credentials on a deployed site.**

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in your own database, Redis, mail and payment values. Never commit `.env` or real keys.

## Testing

API test cases and bug reports: [TESTING.md](TESTING.md)
Postman collection: [postman/](postman/)

## Author

MD. Mahmudul Hasan
GitHub: https://github.com/Mahmudul20-42895-1
Email: hasan.mahmudul.42895@gmail.com

## License

MIT License. See the `LICENSE` file.
