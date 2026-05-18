<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    public $timestamps = false;

    protected $fillable = ['name', 'display_name'];

    public function prefectures()
    {
        return $this->hasMany(Prefecture::class);
    }
}
