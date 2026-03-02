<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(10),
            'price' => $this->faker->randomFloat(2, 1000, 10000000),
            'stock' => $this->faker->numberBetween(0, 1000),
        ];
    }

    /**
     * Indicate that the product is out of stock.
     */
    public function outOfStock(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'stock' => 0,
            ];
        });
    }

    /**
     * Indicate that the product is low on stock.
     */
    public function lowStock(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'stock' => $this->faker->numberBetween(1, 10),
            ];
        });
    }

    /**
     * Indicate that the product is expensive.
     */
    public function expensive(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'price' => $this->faker->randomFloat(2, 1000000, 10000000),
            ];
        });
    }
}
