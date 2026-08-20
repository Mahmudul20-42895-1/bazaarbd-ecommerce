<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class ProductImage extends Model {
    protected $fillable = ['product_id','image_path','alt_text','sort_order','is_primary'];
    protected function casts(): array { return ['is_primary' => 'boolean']; }
    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function getImageUrlAttribute(): string {
        return str_starts_with($this->image_path,'http') ? $this->image_path : asset('storage/'.$this->image_path);
    }
}
