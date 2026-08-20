<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder {
    public function run(): void {
        Setting::set('site_name', 'Bangladesh Shop');
        Setting::set('site_tagline', 'Your favorite store');
        Setting::set('contact_email', 'contact@bangladeshshop.com');
        Setting::set('contact_phone', '01712345678');
        Setting::set('currency', 'BDT');
        Setting::set('currency_symbol', '৳');
    }
}
