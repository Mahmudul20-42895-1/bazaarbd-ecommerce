<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class OrderStatusHistory extends Model {
    public $timestamps = false;
    protected $fillable = ['order_id','status','comment','changed_by_type','changed_by_id'];
    protected $casts = ['created_at' => 'datetime'];
    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
}
