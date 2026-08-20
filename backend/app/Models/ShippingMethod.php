<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class ShippingMethod extends Model {
    protected $fillable = ['zone_id','name','name_bn','description','price','min_days','max_days','is_active'];
    protected function casts(): array { return ['price'=>'decimal:2','is_active'=>'boolean']; }
    public function zone(): BelongsTo { return $this->belongsTo(ShippingZone::class,'zone_id'); }
    public function scopeActive($q) { return $q->where('is_active',true); }
}
