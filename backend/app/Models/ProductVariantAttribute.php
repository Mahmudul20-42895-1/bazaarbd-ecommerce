<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class ProductVariantAttribute extends Model {
    protected $fillable = ['variant_id','attribute_id','value','value_bn','color_code'];
    public function variant(): BelongsTo { return $this->belongsTo(ProductVariant::class,'variant_id'); }
    public function attribute(): BelongsTo { return $this->belongsTo(ProductAttribute::class,'attribute_id'); }
}
