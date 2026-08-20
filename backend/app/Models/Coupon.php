<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
class Coupon extends Model {
    use SoftDeletes;
    protected $fillable = ['code','name','description','type','value','min_order_amount','max_discount_amount','usage_limit','usage_count','per_user_limit','is_active','starts_at','expires_at'];
    protected function casts(): array {
        return ['value'=>'decimal:2','min_order_amount'=>'decimal:2','max_discount_amount'=>'decimal:2','is_active'=>'boolean','starts_at'=>'datetime','expires_at'=>'datetime'];
    }
    public function usages(): HasMany { return $this->hasMany(CouponUsage::class); }
    public function isValid(): bool {
        if (!$this->is_active) return false;
        if ($this->starts_at && $this->starts_at->isFuture()) return false;
        if ($this->expires_at && $this->expires_at->isPast()) return false;
        if ($this->usage_limit && $this->usage_count >= $this->usage_limit) return false;
        return true;
    }
    public function isValidForUser(int $userId): bool {
        if (!$this->isValid()) return false;
        $userUsage = $this->usages()->where('user_id',$userId)->count();
        return $userUsage < $this->per_user_limit;
    }
    public function calculateDiscount(float $subtotal): float {
        if ($this->type === 'percentage') {
            $discount = $subtotal * ($this->value / 100);
            if ($this->max_discount_amount) $discount = min($discount, $this->max_discount_amount);
            return $discount;
        }
        return min($this->value, $subtotal);
    }
}
