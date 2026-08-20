<?php

namespace App\Http\Controllers\Api\V1\Cart;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        
        $cart = Cart::with(['items.product.images', 'coupon'])
            ->firstOrCreate(['user_id' => $user->id]);

        $subtotal = $cart->items->sum(function($item) {
            return $item->quantity * $item->product->price;
        });

        $discount = 0;
        if ($cart->coupon) {
            if ($cart->coupon->type === 'fixed') {
                $discount = $cart->coupon->value;
            } elseif ($cart->coupon->type === 'percentage') {
                $discount = ($subtotal * $cart->coupon->value) / 100;
            }
        }

        $total = max(0, $subtotal - $discount);

        return response()->json([
            'success' => true,
            'message' => 'Cart retrieved successfully',
            'data' => [
                'cart' => $cart,
                'summary' => [
                    'subtotal' => $subtotal,
                    'discount' => $discount,
                    'total' => $total
                ]
            ]
        ]);
    }

    public function clear(Request $request)
    {
        $user = $request->user();
        $cart = Cart::where('user_id', $user->id)->first();
        
        if ($cart) {
            $cart->items()->delete();
            $cart->update(['coupon_id' => null]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared successfully'
        ]);
    }
}
