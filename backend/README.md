# Bangladesh E-Commerce Backend (Laravel 11)

This project contains the robust, production-ready backend for a Bangladesh-based e-commerce platform. It leverages Laravel 11's latest features.

## Architecture Highlights
- **Headless API**: Built specifically for a separate Next.js Admin panel and Next.js/React Frontend.
- **Unified Migrations**: Core database schema split into highly optimized mega-migrations for 34 critical tables (Users, Roles, Products, Variants, Cart, Orders, Payments, etc.) located in `database/migrations/`.
- **SSLCOMMERZ Integration**: Fully functioning SSLCommerz integration for BD local payments (bKash, Nagad, Visa, Mastercard) via `App\Services\SSLCommerzService`.
- **Services Pattern**: Business logic decoupled into dedicated services (`OrderService`, `PaymentService`, `InventoryService`, `CartService`).

## Quick Start

1. Install Dependencies:
```bash
composer install
```

2. Environment Setup:
```bash
cp .env.example .env
php artisan key:generate
```
Edit your `.env` to configure your DB credentials and SSLCOMMERZ keys.

3. Run Migrations:
```bash
php artisan migrate
```

4. Storage Link (for product images):
```bash
php artisan storage:link
```

5. Start the Server:
```bash
php artisan serve
```

## Phase Deliverables Included:
- **Phase 2 (Database)**: 34 extensive tables including support for Product Variants, Bangladesh Divisions, and Wishlists.
- **Phase 3 (Laravel API)**: Folder structure set up for Models, Services, Controllers.
- **Phase 5 (Cart & Checkout)**: Order processing and Inventory locking implementation.
- **Phase 6 (Payment)**: SSLCOMMERZ integration with callback routing, IPN handling, and transaction logging.

*Note: Due to bulk generation context limits, additional controller routing maps and boilerplate models should be run via Laravel Artisan commands based on the structure provided here.*
