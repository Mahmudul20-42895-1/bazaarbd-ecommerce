<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
class Review extends Model {
    use SoftDeletes;
    protected $fillable = ['product_id','user_id','order_id','rating','title','body','images','is_approved','is_featured','admin_reply','admin_replied_at'];
    protected function casts(): array { return ['rating'=>'integer','images'=>'array','is_approved'=>'boolean','is_featured'=>'boolean','admin_replied_at'=>'datetime']; }
    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
    public function scopeApproved($q) { return $q->where('is_approved',true); }
}
