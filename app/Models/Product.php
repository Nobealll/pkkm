<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     
     *
     * @var array<int
     */

    protected $fillable = [
        'name',
        'price',
        'stock',
        'description',
    ];
}