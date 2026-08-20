<?php
namespace App\Http\Requests\Checkout;
use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest {
    public function authorize(): bool { return true; }
    public function rules(): array {
        return [
            'shipping_name' => 'required|string',
            'shipping_phone' => 'required|string|regex:/^01[3-9]\d{8}$/',
            'shipping_division' => 'required|in:Dhaka,Chittagong,Sylhet,Rajshahi,Khulna,Barishal,Mymensingh,Rangpur',
            'shipping_district' => 'required|string',
            'shipping_upazila' => 'required|string',
            'shipping_area' => 'nullable|string',
            'shipping_street' => 'required|string',
            'shipping_postal_code' => 'nullable|digits:4',
            'shipping_method_id' => 'required|exists:shipping_methods,id',
            'coupon_code' => 'nullable|string',
            'notes' => 'nullable|string',
            'address_id' => 'nullable|exists:addresses,id',
        ];
    }
}
