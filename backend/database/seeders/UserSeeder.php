<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder {
    public function run(): void {
        for($i=1; $i<=3; $i++) {
            User::create([
                'name' => "Customer $i",
                'email' => "customer$i@test.com",
                'password' => Hash::make('Password@123'),
                'phone' => "0170000000$i",
            ]);
        }
    }
}
