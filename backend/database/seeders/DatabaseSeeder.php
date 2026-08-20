<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {
    public function run(): void {
        $this->call([
            AdminSeeder::class,
            CategorySeeder::class,
            ShippingZoneSeeder::class,
            CouponSeeder::class,
            SettingSeeder::class,
            UserSeeder::class,
        ]);
    }
}
