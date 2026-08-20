<?php

namespace App\Http\Controllers\Api\V1\Cart;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function apply(Request $request)
    {
        $request->validate([
            'code' => 'required|string'
        ]);

        $user = $request->user();
        
        $coupon = Coupon::where('code', strtoupper($request->code))
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('valid_until')
                      ->orWhere('valid_until', '>=', now());
            })
            ->first();

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired coupon code.'
            ], 400);
        }

        if ($coupon->usage_limit && $coupon->used_count >= $coupon->usage_limit) {
            return response()->json([
                'success' => false,
                'message' => 'Coupon usage limit has been reached.'
            ], 400);
        }

        $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        
        $cart->update(['coupon_id' => $coupon->id]);

        return response()->json([
            'success' => true,
            'message' => 'Coupon applied successfully',
            'data' => $coupon
        ]);
    }

    public function remove(Request $request)
    {
        $user = $request->user();
        $cart = Cart::where('user_id', $user->id)->first();
        
        if ($cart) {
            $cart->update(['coupon_id' => null]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Coupon removed successfully'
        ]);
    }
}
