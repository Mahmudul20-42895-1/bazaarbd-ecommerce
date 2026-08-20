<?php
namespace App\Services;
use App\Models\Coupon;
use App\Models\CouponUsage;
use Illuminate\Support\Facades\DB;

class CouponService {
    public function validate(string $code, float $orderAmount, int $userId): Coupon {
        $coupon = Coupon::where('code', strtoupper($code))->first();
        if (!$coupon) throw new \Exception('Invalid coupon code.');
        if (!$coupon->isValid()) throw new \Exception('Coupon is expired or inactive.');
        if (!$coupon->isValidForUser($userId)) throw new \Exception('You have already used this coupon.');
        if ($coupon->min_order_amount && $orderAmount < $coupon->min_order_amount) {
            throw new \Exception("Minimum order amount is ৳{$coupon->min_order_amount}.");
        }
        return $coupon;
    }
    public function calculate(Coupon $coupon, float $subtotal): float {
        return $coupon->calculateDiscount($subtotal);
    }
    public function markUsed(Coupon $coupon, int $userId, int $orderId, float $discount): void {
        DB::transaction(function() use ($coupon, $userId, $orderId, $discount) {
            CouponUsage::create(['coupon_id'=>$coupon->id,'user_id'=>$userId,'order_id'=>$orderId,'discount_amount'=>$discount,'used_at'=>now()]);
            $coupon->increment('usage_count');
        });
    }
}
