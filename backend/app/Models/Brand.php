<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Brand extends Model {
    use HasFactory, SoftDeletes;
    protected $fillable = ['name','slug','description','logo','website_url','is_active','sort_order'];
    protected function casts(): array { return ['is_active' => 'boolean']; }
    public function products(): HasMany { return $this->hasMany(Product::class); }
    public function scopeActive($q) { return $q->where('is_active', true); }
    public function getLogoUrlAttribute(): ?string {
        if (!$this->logo) return null;
        return str_starts_with($this->logo, 'http') ? $this->logo : asset('storage/' . $this->logo);
    }
}
