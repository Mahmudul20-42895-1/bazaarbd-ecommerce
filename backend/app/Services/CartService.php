<?php
namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ShippingMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class CartService
{
    public function getOrCreateCart(Request $request): Cart
    {
        if (Auth::check()) {
            $cart = Cart::firstOrCreate(['user_id' => Auth::id()], ['session_id' => null]);
            // Merge guest cart if session exists
            $sessionId = $request->cookie('cart_session');
            if ($sessionId) {
                $this->mergeGuestCart($sessionId, Auth::id());
            }
            return $cart->fresh(['items.product','items.variant','coupon']);
        }

        $sessionId = $request->cookie('cart_session') ?? (string) Str::uuid();
        $cart = Cart::firstOrCreate(['session_id' => $sessionId, 'user_id' => null]);
        return $cart;
    }

    public function addItem(Cart $cart, int $productId, ?int $variantId, int $quantity): CartItem
    {
        $product = Product::findOrFail($productId);
        $unitPrice = $product->sale_price ?? $product->base_price;

        if ($variantId) {
            $variant = ProductVariant::findOrFail($variantId);
            $unitPrice = $variant->getPrice();
        }

        $existingItem = $cart->items()
            ->where('product_id', $productId)
            ->where('variant_id', $variantId)
            ->first();

        if ($existingItem) {
            $existingItem->increment('quantity', $quantity);
            return $existingItem->fresh();
        }

        return $cart->items()->create([
            'product_id' => $productId,
            'variant_id' => $variantId,
            'quantity'   => $quantity,
            'unit_price' => $unitPrice,
        ]);
    }

    public function updateItem(CartItem $item, int $quantity): CartItem
    {
        $item->update(['quantity' => $quantity]);
        return $item->fresh();
    }

    public function removeItem(CartItem $item): void
    {
        $item->delete();
    }

    public function applyCoupon(Cart $cart, string $code, int $userId): array
    {
        $coupon = Coupon::where('code', strtoupper($code))->first();

        if (!$coupon) {
            return ['success' => false, 'message' => 'Invalid coupon code.'];
        }

        if (!$coupon->isValid()) {
            return ['success' => false, 'message' => 'This coupon is expired or inactive.'];
        }

        if (!$coupon->isValidForUser($userId)) {
            return ['success' => false, 'message' => 'You have already used this coupon.'];
        }

        $subtotal = $cart->subtotal;
        if ($coupon->min_order_amount && $subtotal < $coupon->min_order_amount) {
            return ['success' => false, 'message' => "Minimum order amount is ৳{$coupon->min_order_amount}."];
        }

        $cart->update(['coupon_id' => $coupon->id]);
        $discount = $coupon->calculateDiscount($subtotal);

        return ['success' => true, 'discount' => $discount, 'coupon' => $coupon];
    }

    public function removeCoupon(Cart $cart): void
    {
        $cart->update(['coupon_id' => null]);
    }

    public function calculateTotals(Cart $cart, ?int $shippingMethodId = null): array
    {
        $cart->load(['items.product', 'coupon']);
        $subtotal = (float) $cart->subtotal;
        $discount = 0;

        if ($cart->coupon) {
            $discount = (float) $cart->coupon->calculateDiscount($subtotal);
        }

        $shipping = 0;
        if ($shippingMethodId) {
            $method = ShippingMethod::find($shippingMethodId);
            $shipping = $method ? (float) $method->price : 0;
        }

        $total = max(0, $subtotal - $discount + $shipping);

        return [
            'subtotal' => $subtotal,
            'discount' => $discount,
            'shipping' => $shipping,
            'total'    => $total,
        ];
    }

    public function mergeGuestCart(string $sessionId, int $userId): void
    {
        $guestCart = Cart::where('session_id', $sessionId)->where('user_id', null)->first();
        if (!$guestCart) return;

        $userCart = Cart::firstOrCreate(['user_id' => $userId]);

        foreach ($guestCart->items as $guestItem) {
            $existing = $userCart->items()
                ->where('product_id', $guestItem->product_id)
                ->where('variant_id', $guestItem->variant_id)
                ->first();

            if ($existing) {
                $existing->increment('quantity', $guestItem->quantity);
            } else {
                $userCart->items()->create($guestItem->only(['product_id','variant_id','quantity','unit_price']));
            }
        }

        $guestCart->items()->delete();
        $guestCart->delete();
    }

    public function validateStock(Cart $cart): array
    {
        $errors = [];
        foreach ($cart->items as $item) {
            $product = $item->product;
            if (!$product || !$product->is_active) {
                $errors[] = "{$item->product_name} is no longer available.";
                continue;
            }

            $stock = $item->variant
                ? $item->variant->stock_quantity
                : $product->stock_quantity;

            if ($product->manage_stock && $stock < $item->quantity) {
                $errors[] = "Only {$stock} units of {$product->name} available.";
            }
        }

        return ['valid' => empty($errors), 'errors' => $errors];
    }
}
