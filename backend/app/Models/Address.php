<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
class Address extends Model {
    use SoftDeletes;
    protected $fillable = ['user_id','label','full_name','phone','division','district','upazila','area','street_address','postal_code','is_default'];
    protected function casts(): array { return ['is_default' => 'boolean']; }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function scopeDefault($q) { return $q->where('is_default', true); }
    public function getFullAddressAttribute(): string {
        return collect([$this->street_address,$this->area,$this->upazila,$this->district,$this->division])->filter()->implode(', ');
    }
}
