<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\ShippingZone;

class ShippingZoneSeeder extends Seeder {
    public function run(): void {
        $divisions = ['Dhaka','Chittagong','Sylhet','Rajshahi','Khulna','Barishal','Mymensingh','Rangpur'];
        foreach ($divisions as $div) {
            $zone = ShippingZone::create(['name'=>"$div Zone",'name_bn'=>"$div জোন",'divisions'=>[$div],'is_active'=>true]);
            $zone->shippingMethods()->createMany([
                ['name'=>'Standard Delivery','name_bn'=>'সাধারণ ডেলিভারি','price'=>80,'min_days'=>3,'max_days'=>5,'is_active'=>true],
                ['name'=>'Express Delivery','name_bn'=>'জরুরী ডেলিভারি','price'=>150,'min_days'=>1,'max_days'=>2,'is_active'=>true],
            ]);
        }
    }
}
