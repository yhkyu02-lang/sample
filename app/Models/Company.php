<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'name',
        'email',
        'prefecture_id',
        'phone',
        'postcode',
        'city',
        'local',
        'street_address',
        'business_hour',
        'regular_holiday',
        'image',
        'fax',
        'url',
        'license_number',
    ];

    public function prefecture()
    {
        return $this->belongsTo(Prefecture::class);
    }
}
