<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255|min:3',
            'description' => 'nullable|string|max:1000',
            'price' => 'sometimes|required|numeric|min:0|max:999999999.99',
            'stock' => 'sometimes|required|integer|min:0|max:999999',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'nama produk',
            'description' => 'deskripsi',
            'price' => 'harga',
            'stock' => 'stok',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => ':attribute wajib diisi',
            'name.min' => ':attribute minimal :min karakter',
            'name.max' => ':attribute maksimal :max karakter',
            'description.max' => ':attribute maksimal :max karakter',
            'price.required' => ':attribute wajib diisi',
            'price.numeric' => ':attribute harus berupa angka',
            'price.min' => ':attribute minimal :min',
            'price.max' => ':attribute maksimal :max',
            'stock.required' => ':attribute wajib diisi',
            'stock.integer' => ':attribute harus berupa bilangan bulat',
            'stock.min' => ':attribute minimal :min',
            'stock.max' => ':attribute maksimal :max',
        ];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422)
        );
    }
}
