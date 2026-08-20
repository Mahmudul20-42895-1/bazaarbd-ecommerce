<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class ShippingZone extends Model {
    protected $fillable = ['name','name_bn','divisions','is_active'];
    protected function casts(): array { return ['divisions'=>'array','is_active'=>'boolean']; }
    public function shippingMethods(): HasMany { return $this->hasMany(ShippingMethod::class,'zone_id'); }
    public function scopeActive($q) { return $q->where('is_active',true); }
}
