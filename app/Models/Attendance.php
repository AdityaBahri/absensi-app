<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'user_id',
        'attendance_type',
        'attendance_date',
        'checkin_time',
        'ip_address',
        'network_validation',
        'status',
    ];

    protected $casts = [
        'attendance_date' => 'date',
        'checkin_time' => 'datetime',
        'network_validation' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
