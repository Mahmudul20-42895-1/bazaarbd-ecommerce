<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class AuditLog extends Model {
    public $timestamps = false;
    protected $fillable = ['admin_id','action','model_type','model_id','old_values','new_values','ip_address','user_agent'];
    protected function casts(): array { return ['old_values'=>'array','new_values'=>'array','created_at'=>'datetime']; }
    public function admin(): BelongsTo { return $this->belongsTo(Admin::class); }
    public static function record(string $action, ?int $adminId, ?string $modelType=null, ?int $modelId=null, ?array $oldValues=null, ?array $newValues=null): void {
        static::create(['admin_id'=>$adminId,'action'=>$action,'model_type'=>$modelType,'model_id'=>$modelId,'old_values'=>$oldValues,'new_values'=>$newValues,'ip_address'=>request()->ip(),'user_agent'=>request()->userAgent()]);
    }
}
