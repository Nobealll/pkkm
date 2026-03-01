<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
     Product::create([
            'name' => 'Beras',
            'price' => 15000, 
            'description' => 'Raskin'
        ]);
    }
}
