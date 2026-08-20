<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'name_bn', 'slug', 'description', 'description_bn',
        'short_description', 'sku', 'category_id', 'brand_id',
        'base_price', 'sale_price', 'cost_price',
        'stock_quantity', 'low_stock_threshold', 'manage_stock',
        'weight', 'dimensions', 'is_active', 'is_featured', 'is_new_arrival',
        'status', 'seo_title', 'seo_description', 'seo_keywords', 'meta_image',
        'sort_order', 'total_sales', 'view_count', 'average_rating', 'review_count',
    ];

    protected function casts(): array
    {
        return [
            'base_price'    => 'decimal:2',
            'sale_price'    => 'decimal:2',
            'cost_price'    => 'decimal:2',
            'average_rating'=> 'decimal:2',
            'weight'        => 'decimal:2',
            'dimensions'    => 'array',
            'is_active'     => 'boolean',
            'is_featured'   => 'boolean',
            'is_new_arrival'=> 'boolean',
            'manage_stock'  => 'boolean',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function primaryImage(): HasMany
    {
        return $this->hasMany(ProductImage::class)->where('is_primary', true)->limit(1);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class)->orderBy('sort_order');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'product_tag');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function approvedReviews(): HasMany
    {
        return $this->hasMany(Review::class)->where('is_approved', true);
    }

    // ─── Scopes ───────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->where('status', 'published');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeNewArrivals($query)
    {
        return $query->where('is_new_arrival', true);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }

    public function scopeLowStock($query)
    {
        return $query->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
            ->where('stock_quantity', '>', 0);
    }

    public function scopeOutOfStock($query)
    {
        return $query->where('stock_quantity', 0);
    }

    public function scopeSearch($query, string $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('name', 'LIKE', "%{$term}%")
              ->orWhere('name_bn', 'LIKE', "%{$term}%")
              ->orWhere('sku', 'LIKE', "%{$term}%")
              ->orWhere('description', 'LIKE', "%{$term}%");
        });
    }

    // ─── Accessors ───────────────────────────────────────────────

    public function getCurrentPriceAttribute(): string
    {
        return $this->sale_price ?? $this->base_price;
    }

    public function getIsOnSaleAttribute(): bool
    {
        return $this->sale_price !== null && $this->sale_price < $this->base_price;
    }

    public function getDiscountPercentageAttribute(): int
    {
        if (!$this->is_on_sale) return 0;
        return (int) round((($this->base_price - $this->sale_price) / $this->base_price) * 100);
    }

    public function getIsInStockAttribute(): bool
    {
        return !$this->manage_stock || $this->stock_quantity > 0;
    }

    public function getIsLowStockAttribute(): bool
    {
        return $this->manage_stock
            && $this->stock_quantity > 0
            && $this->stock_quantity <= $this->low_stock_threshold;
    }

    // ─── Stock Management ─────────────────────────────────────────

    public function decrementStock(int $quantity, ?int $variantId = null): void
    {
        if ($variantId) {
            ProductVariant::where('id', $variantId)
                ->lockForUpdate()
                ->decrement('stock_quantity', $quantity);
        }
        if ($this->manage_stock) {
            $this->lockForUpdate()->decrement('stock_quantity', $quantity);
            $this->increment('total_sales', $quantity);
        }
    }

    public function incrementStock(int $quantity, ?int $variantId = null): void
    {
        if ($variantId) {
            ProductVariant::where('id', $variantId)->increment('stock_quantity', $quantity);
        }
        if ($this->manage_stock) {
            $this->increment('stock_quantity', $quantity);
        }
    }

    public function updateRating(): void
    {
        $stats = $this->approvedReviews()
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as count')
            ->first();
        $this->update([
            'average_rating' => round($stats->avg_rating ?? 0, 2),
            'review_count'   => $stats->count ?? 0,
        ]);
    }
}
