<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Payment extends Model {
    protected $fillable = ['order_id','transaction_id','gateway','gateway_transaction_id','method','amount','currency','status','refunded_amount','paid_at','failed_at','gateway_response'];
    protected function casts(): array { return ['amount'=>'decimal:2','refunded_amount'=>'decimal:2','paid_at'=>'datetime','failed_at'=>'datetime','gateway_response'=>'array']; }
    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
    public function transactions(): HasMany { return $this->hasMany(PaymentTransaction::class); }
    public function isPaid(): bool { return $this->status === 'paid'; }
}
