<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
class Setting extends Model {
    protected $fillable = ['key','value','type','group','label'];
    public static function get(string $key, mixed $default = null): mixed {
        return Cache::rememberForever("setting_{$key}", function() use ($key, $default) {
            $setting = static::where('key',$key)->first();
            if (!$setting) return $default;
            return match($setting->type) {
                'boolean' => (bool) $setting->value,
                'integer' => (int) $setting->value,
                'json'    => json_decode($setting->value, true),
                default   => $setting->value,
            };
        });
    }
    public static function set(string $key, mixed $value): void {
        $val = is_array($value) ? json_encode($value) : (string) $value;
        static::updateOrCreate(['key'=>$key], ['value'=>$val]);
        Cache::forget("setting_{$key}");
    }
}
