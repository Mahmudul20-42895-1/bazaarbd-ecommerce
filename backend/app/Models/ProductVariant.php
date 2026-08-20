<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class ProductVariant extends Model {
    protected $fillable = ['product_id','sku','price_adjustment','price_override','stock_quantity','weight','is_active','sort_order'];
    protected function casts(): array { return ['price_adjustment'=>'decimal:2','price_override'=>'decimal:2','weight'=>'decimal:2','is_active'=>'boolean']; }
    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function variantAttributes(): HasMany { return $this->hasMany(ProductVariantAttribute::class,'variant_id'); }
    public function getPrice(): string {
        if ($this->price_override) return $this->price_override;
        $base = $this->product->sale_price ?? $this->product->base_price;
        return bcadd($base, $this->price_adjustment, 2);
    }
    public function scopeActive($q) { return $q->where('is_active', true); }
}
