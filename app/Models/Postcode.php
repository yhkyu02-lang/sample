<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Postcode extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'public_body_code',
        'old_postcode',
        'postcode',
        'prefecture_kana',
        'city_kana',
        'local_kana',
        'prefecture',
        'city',
        'local',
    ];
}
