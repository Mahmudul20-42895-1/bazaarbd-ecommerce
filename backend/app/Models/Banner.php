<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Banner extends Model {
    protected $fillable = ['title','title_bn','subtitle','image','link','button_text','position','is_active','sort_order','starts_at','expires_at'];
    protected function casts(): array { return ['is_active'=>'boolean','starts_at'=>'datetime','expires_at'=>'datetime']; }
    public function scopeActive($q) { return $q->where('is_active',true)->where(fn($q2)=>$q2->whereNull('starts_at')->orWhere('starts_at','<=',now()))->where(fn($q2)=>$q2->whereNull('expires_at')->orWhere('expires_at','>=',now())); }
    public function scopePosition($q, string $position) { return $q->where('position',$position); }
    public function getImageUrlAttribute(): string { return str_starts_with($this->image,'http') ? $this->image : asset('storage/'.$this->image); }
}
