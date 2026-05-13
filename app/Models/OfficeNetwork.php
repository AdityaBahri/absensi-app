<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OfficeNetwork extends Model
{
    protected $fillable = [
        'name',
        'ip_address',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
