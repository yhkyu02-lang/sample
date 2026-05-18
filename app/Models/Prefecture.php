<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prefecture extends Model
{
    public $timestamps = false;

    protected $fillable = ['name', 'display_name', 'area_id'];

    public function companies()
    {
        return $this->hasMany(Company::class);
    }

    public function area()
    {
        return $this->belongsTo(Area::class);
    }
}
