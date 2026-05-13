<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $fillable = [
        'user_id',
        'permission_type',
        'permission_date',
        'description',
        'attachment',
        'status',
    ];

    protected $casts = [
        'permission_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
