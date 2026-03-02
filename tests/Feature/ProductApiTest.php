<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test get all products
     */
    public function test_can_get_all_products(): void
    {
        Product::factory()->count(3)->create();

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => ['id', 'name', 'description', 'price', 'stock']
                ],
                'total'
            ])
            ->assertJson(['success' => true]);
    }

    /**
     * Test create product with valid data
     */
    public function test_can_create_product_with_valid_data(): void
    {
        $productData = [
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 100000,
            'stock' => 50
        ];

        $response = $this->postJson('/api/products', $productData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['id', 'name', 'description', 'price', 'stock']
            ])
            ->assertJson([
                'success' => true,
                'data' => $productData
            ]);

        $this->assertDatabaseHas('products', $productData);
    }

    /**
     * Test create product with invalid data
     */
    public function test_cannot_create_product_with_invalid_data(): void
    {
        $response = $this->postJson('/api/products', [
            'name' => 'AB', // too short (min 3)
            'price' => -100, // negative price
            'stock' => 'invalid' // not integer
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'success',
                'message',
                'errors'
            ])
            ->assertJson(['success' => false]);
    }

    /**
     * Test get single product
     */
    public function test_can_get_single_product(): void
    {
        $product = Product::factory()->create();

        $response = $this->getJson("/api/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $product->id,
                    'name' => $product->name,
                ]
            ]);
    }

    /**
     * Test get non-existent product
     */
    public function test_returns_404_for_non_existent_product(): void
    {
        $response = $this->getJson('/api/products/999999');

        $response->assertStatus(404)
            ->assertJson(['success' => false]);
    }

    /**
     * Test update product
     */
    public function test_can_update_product(): void
    {
        $product = Product::factory()->create();
        
        $updateData = [
            'name' => 'Updated Product',
            'price' => 200000
        ];

        $response = $this->putJson("/api/products/{$product->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => $updateData
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Updated Product',
            'price' => 200000
        ]);
    }

    /**
     * Test delete product
     */
    public function test_can_delete_product(): void
    {
        $product = Product::factory()->create();

        $response = $this->deleteJson("/api/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('products', [
            'id' => $product->id
        ]);
    }

    /**
     * Test validation error messages are in Indonesian
     */
    public function test_validation_messages_are_in_indonesian(): void
    {
        $response = $this->postJson('/api/products', [
            'name' => '',
            'price' => '',
            'stock' => ''
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('errors.name.0', 'nama produk wajib diisi')
            ->assertJsonPath('errors.price.0', 'harga wajib diisi')
            ->assertJsonPath('errors.stock.0', 'stok wajib diisi');
    }
}
