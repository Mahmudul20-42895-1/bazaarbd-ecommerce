<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Auth\OtpController;
use App\Http\Controllers\Api\V1\User\ProfileController;
use App\Http\Controllers\Api\V1\User\AddressController;
use App\Http\Controllers\Api\V1\Shop\ProductController;
use App\Http\Controllers\Api\V1\Shop\CategoryController;
use App\Http\Controllers\Api\V1\Shop\BannerController;
use App\Http\Controllers\Api\V1\Shop\SearchController;
use App\Http\Controllers\Api\V1\Shop\ReviewController;
use App\Http\Controllers\Api\V1\Cart\CartController;
use App\Http\Controllers\Api\V1\Cart\CartItemController;
use App\Http\Controllers\Api\V1\Cart\CouponController;
use App\Http\Controllers\Api\V1\Cart\WishlistController;
use App\Http\Controllers\Api\V1\Order\CheckoutController;
use App\Http\Controllers\Api\V1\Order\OrderController;
use App\Http\Controllers\Api\V1\Payment\PaymentController;
use App\Http\Controllers\Api\V1\Admin\Auth\AuthController as AdminAuthController;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\V1\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\V1\Admin\CustomerController;
use App\Http\Controllers\Api\V1\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\Api\V1\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\V1\Admin\BrandController;
use App\Http\Controllers\Api\V1\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Api\V1\Admin\BannerController as AdminBannerController;
use App\Http\Controllers\Api\V1\Admin\ShippingController;
use App\Http\Controllers\Api\V1\Admin\SettingController;
use App\Http\Controllers\Api\V1\Admin\InventoryController;

// Public routes
Route::prefix('v1')->group(function () {
    // Auth
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login', [AuthController::class, 'login']);
    Route::post('auth/send-otp', [OtpController::class, 'send']);
    Route::post('auth/verify-otp', [OtpController::class, 'verify']);

    // Shop - Public
    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{slug}', [ProductController::class, 'show']);
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('categories/{slug}', [CategoryController::class, 'show']);
    Route::get('banners', [BannerController::class, 'index']);
    Route::get('search', [SearchController::class, 'search']);

    // Payment webhooks (no auth)
    Route::post('payment/ipn', [PaymentController::class, 'ipn']);
    Route::post('payment/success', [PaymentController::class, 'success']);
    Route::post('payment/fail', [PaymentController::class, 'fail']);
    Route::post('payment/cancel', [PaymentController::class, 'cancel']);

    // Order tracking (public)
    Route::get('orders/track/{orderNumber}', [OrderController::class, 'track']);

    // Authenticated customer routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me', [AuthController::class, 'me']);

        // Profile & Addresses
        Route::get('profile', [ProfileController::class, 'show']);
        Route::put('profile', [ProfileController::class, 'update']);
        Route::apiResource('addresses', AddressController::class);
        Route::patch('addresses/{address}/default', [AddressController::class, 'setDefault']);

        // Cart
        Route::get('cart', [CartController::class, 'show']);
        Route::post('cart/items', [CartItemController::class, 'store']);
        Route::put('cart/items/{cartItem}', [CartItemController::class, 'update']);
        Route::delete('cart/items/{cartItem}', [CartItemController::class, 'destroy']);
        Route::delete('cart', [CartController::class, 'clear']);
        Route::post('cart/coupon', [CouponController::class, 'apply']);
        Route::delete('cart/coupon', [CouponController::class, 'remove']);

        // Wishlist
        Route::get('wishlist', [WishlistController::class, 'index']);
        Route::post('wishlist', [WishlistController::class, 'store']);
        Route::delete('wishlist/{productId}', [WishlistController::class, 'destroy']);

        // Checkout & Orders
        Route::post('checkout', [CheckoutController::class, 'process']);
        Route::get('orders', [OrderController::class, 'index']);
        Route::get('orders/{order}', [OrderController::class, 'show']);
        Route::post('orders/{order}/cancel', [OrderController::class, 'cancel']);

        // Reviews
        Route::post('products/{product}/reviews', [ReviewController::class, 'store']);
    });

    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::post('auth/login', [AdminAuthController::class, 'login']);

        Route::middleware('auth:admin-sanctum')->group(function () {
            Route::post('auth/logout', [AdminAuthController::class, 'logout']);
            Route::get('auth/me', [AdminAuthController::class, 'me']);

            // Dashboard
            Route::get('dashboard/stats', [DashboardController::class, 'stats']);
            Route::get('dashboard/revenue-chart', [DashboardController::class, 'revenueChart']);
            Route::get('dashboard/recent-orders', [DashboardController::class, 'recentOrders']);

            // Products
            Route::apiResource('products', AdminProductController::class);
            Route::patch('products/{product}/status', [AdminProductController::class, 'updateStatus']);

            // Categories
            Route::apiResource('categories', AdminCategoryController::class);

            // Brands
            Route::apiResource('brands', BrandController::class);

            // Orders
            Route::get('orders', [AdminOrderController::class, 'index']);
            Route::get('orders/{order}', [AdminOrderController::class, 'show']);
            Route::patch('orders/{order}/status', [AdminOrderController::class, 'updateStatus']);

            // Customers
            Route::get('customers', [CustomerController::class, 'index']);
            Route::get('customers/{user}', [CustomerController::class, 'show']);
            Route::patch('customers/{user}/status', [CustomerController::class, 'updateStatus']);

            // Coupons
            Route::apiResource('coupons', AdminCouponController::class);
            Route::patch('coupons/{coupon}/status', [AdminCouponController::class, 'updateStatus']);

            // Banners
            Route::apiResource('banners', AdminBannerController::class);

            // Reviews
            Route::get('reviews', [AdminReviewController::class, 'index']);
            Route::patch('reviews/{review}/approve', [AdminReviewController::class, 'approve']);
            Route::patch('reviews/{review}/reject', [AdminReviewController::class, 'reject']);

            // Shipping
            Route::apiResource('shipping/zones', ShippingController::class);

            // Inventory
            Route::get('inventory/low-stock', [InventoryController::class, 'lowStock']);
            Route::patch('inventory/{product}/restock', [InventoryController::class, 'restock']);

            // Settings
            Route::get('settings', [SettingController::class, 'index']);
            Route::put('settings', [SettingController::class, 'update']);
        });
    });
});
