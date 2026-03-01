<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name'        => 'Laptop ASUS Vivobook 15',
                'description' => 'Laptop ringan untuk kebutuhan sehari-hari dan kuliah',
                'price'       => 7500000,
                'stock'       => 12,
            ],
            [
                'name'        => 'Mechanical Keyboard Rexus',
                'description' => 'Keyboard gaming dengan switch blue, backlight RGB',
                'price'       => 450000,
                'stock'       => 30,
            ],
            [
                'name'        => 'Mouse Logitech M185',
                'description' => 'Mouse wireless compact, baterai tahan lama',
                'price'       => 150000,
                'stock'       => 50,
            ],
            [
                'name'        => 'Monitor LG 24 inch FHD',
                'description' => 'Panel IPS, refresh rate 75Hz, cocok untuk WFH',
                'price'       => 2100000,
                'stock'       => 8,
            ],
            [
                'name'        => 'SSD Samsung 500GB',
                'description' => 'SSD SATA 2.5 inch, read speed hingga 560 MB/s',
                'price'       => 650000,
                'stock'       => 25,
            ],
            [
                'name'        => 'RAM Corsair 8GB DDR4',
                'description' => 'DDR4 3200MHz, kompatibel dengan berbagai motherboard',
                'price'       => 320000,
                'stock'       => 40,
            ],
            [
                'name'        => 'Headset HyperX Cloud',
                'description' => 'Headset gaming dengan mikrofon noise cancelling',
                'price'       => 850000,
                'stock'       => 3,  // stok menipis
            ],
            [
                'name'        => 'Webcam Logitech C270',
                'description' => 'Webcam HD 720p, plug and play, cocok untuk meeting',
                'price'       => 375000,
                'stock'       => 2,  // stok menipis
            ],
            [
                'name'        => 'USB Hub 7 Port',
                'description' => 'USB 3.0 hub dengan port charging tambahan',
                'price'       => 120000,
                'stock'       => 60,
            ],
            [
                'name'        => 'Mousepad XL Gaming',
                'description' => 'Mousepad besar 80x30cm, permukaan halus anti-slip',
                'price'       => 85000,
                'stock'       => 5,  // tepat di batas menipis
            ],
        ];

        DB::table('products')->insert($products);
    }
}
