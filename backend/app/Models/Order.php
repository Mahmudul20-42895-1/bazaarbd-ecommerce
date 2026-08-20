<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model {
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'order_number','user_id','guest_email','guest_phone',
        'address_id','shipping_name','shipping_phone',
        'shipping_division','shipping_district','shipping_upazila','shipping_area',
        'shipping_street','shipping_postal_code','shipping_method_id',
        'subtotal','discount_amount','shipping_charge','total_amount',
        'coupon_id','coupon_code','notes','status','payment_status','payment_method',
        'cancelled_at','cancellation_reason','delivered_at','ip_address','user_agent',
    ];
    protected function casts(): array {
        return ['subtotal'=>'decimal:2','discount_amount'=>'decimal:2','shipping_charge'=>'decimal:2','total_amount'=>'decimal:2','cancelled_at'=>'datetime','delivered_at'=>'datetime'];
    }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function address(): BelongsTo { return $this->belongsTo(Address::class); }
    public function shippingMethod(): BelongsTo { return $this->belongsTo(ShippingMethod::class); }
    public function coupon(): BelongsTo { return $this->belongsTo(Coupon::class); }
    public function items(): HasMany { return $this->hasMany(OrderItem::class); }
    public function statusHistory(): HasMany { return $this->hasMany(OrderStatusHistory::class)->orderByDesc('created_at'); }
    public function payments(): HasMany { return $this->hasMany(Payment::class); }
    public function latestPayment() { return $this->hasOne(Payment::class)->latestOfMany(); }
    public static function generateOrderNumber(): string {
        $date = now()->format('Ymd');
        $random = strtoupper(\Str::random(5));
        return "ORD-{$date}-{$random}";
    }
    public function canBeCancelled(): bool {
        return in_array($this->status, ['pending','confirmed','processing']);
    }
    public function isPaid(): bool { return $this->payment_status === 'paid'; }
    public function scopePending($q) { return $q->where('status','pending'); }
    public function scopeByUser($q, int $userId) { return $q->where('user_id',$userId); }
}
