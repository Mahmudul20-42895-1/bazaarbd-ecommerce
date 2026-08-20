<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Coupon;

class CouponSeeder extends Seeder {
    public function run(): void {
        Coupon::create(['code'=>'WELCOME10','name'=>'Welcome 10% Off','type'=>'percentage','value'=>10,'max_discount_amount'=>200,'is_active'=>true]);
        Coupon::create(['code'=>'FLAT100','name'=>'Flat 100 Off','type'=>'fixed','value'=>100,'min_order_amount'=>500,'is_active'=>true]);
        Coupon::create(['code'=>'NEWUSER','name'=>'New User 15%','type'=>'percentage','value'=>15,'per_user_limit'=>1,'is_active'=>true]);
    }
}
