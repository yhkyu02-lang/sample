<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:50'],
            'email' => ['required', 'email', Rule::unique('companies')->ignore($this->route('company'))],
            'postcode' => ['required', 'regex:/^\d{7}$/'],
            'prefecture_id' => ['required', 'exists:prefectures,id'],
            'city' => ['required', 'string', 'max:255'],
            'local' => ['required', 'string', 'max:255'],
            'street_address' => ['nullable', 'string', 'max:255'],
            'business_hour' => ['nullable', 'string', 'max:255'],
            'regular_holiday' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'regex:/^\d+$/'],
            'fax' => ['nullable', 'string', 'max:50'],
            'url' => ['nullable', 'string', 'max:255'],
            'license_number' => ['nullable', 'string', 'max:50'],
            'image' => ['nullable', 'image'],
        ];
    }
}
