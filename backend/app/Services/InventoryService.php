<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    public function validateAndLockStock(Cart $cart): void
    {
        foreach ($cart->items as $item) {
            if ($item->variant_id) {
                $variant = ProductVariant::lockForUpdate()->find($item->variant_id);
                if (!$variant || $variant->stock_quantity < $item->quantity) {
                    throw new \Exception("Insufficient stock for variant {$item->variant_id}");
                }
            } else {
                $product = Product::lockForUpdate()->find($item->product_id);
                if (!$product || $product->stock_quantity < $item->quantity) {
                    throw new \Exception("Insufficient stock for product {$product->name}");
                }
            }
        }
    }

    public function decrementStock(int $productId, ?int $variantId, int $quantity): void
    {
        if ($variantId) {
            ProductVariant::where('id', $variantId)->decrement('stock_quantity', $quantity);
        } else {
            Product::where('id', $productId)->decrement('stock_quantity', $quantity);
        }
    }

    public function releaseStock(Order $order): void
    {
        foreach ($order->items as $item) {
            if ($item->variant_id) {
                ProductVariant::where('id', $item->variant_id)->increment('stock_quantity', $item->quantity);
            } else {
                Product::where('id', $item->product_id)->increment('stock_quantity', $item->quantity);
            }
        }
    }
}
