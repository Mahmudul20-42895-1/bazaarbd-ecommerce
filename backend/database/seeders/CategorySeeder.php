<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder {
    public function run(): void {
        $cats = [
            'Electronics'=>'ইলেকট্রনিক্স', 'Fashion'=>'ফ্যাশন', 'Home & Kitchen'=>'বাড়ি ও রান্নাঘর', 'Sports'=>'খেলাধুলা', 'Beauty'=>'রূপচর্চা', 'Books'=>'বই', 'Food'=>'খাবার', 'Automotive'=>'অটোমোবাইল'
        ];
        foreach ($cats as $en => $bn) {
            $cat = Category::create(['name'=>$en,'name_bn'=>$bn,'slug'=>Str::slug($en),'is_active'=>true]);
            for($i=1; $i<=3; $i++) {
                Category::create(['parent_id'=>$cat->id,'name'=>"$en Sub $i",'name_bn'=>"$bn সাব $i",'slug'=>Str::slug("$en Sub $i"),'is_active'=>true]);
            }
        }
    }
}
