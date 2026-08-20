<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class ProductAttribute extends Model {
    protected $fillable = ['name','name_bn','type'];
    public function variantAttributes(): HasMany { return $this->hasMany(ProductVariantAttribute::class,'attribute_id'); }
}
