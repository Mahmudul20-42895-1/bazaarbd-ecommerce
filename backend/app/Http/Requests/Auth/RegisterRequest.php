<?php
namespace App\Http\Requests\Auth;
use Illuminate\Foundation\Http\FormRequest;
class RegisterRequest extends FormRequest {
    public function authorize(): bool { return true; }
    public function rules(): array {
        return [
            'name'     => 'required|string|min:2|max:100',
            'email'    => 'required|email|unique:users,email',
            'phone'    => ['nullable','string','regex:/^01[3-9]\d{8}$/','unique:users,phone'],
            'password' => 'required|string|min:8|confirmed',
        ];
    }
    public function messages(): array {
        return ['phone.regex' => 'Phone must be a valid Bangladesh mobile number (e.g. 01XXXXXXXXX).'];
    }
}
