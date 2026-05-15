<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        User::factory()->create([
            'name' => 'Admin Diskominfo',
            'email' => 'admin@makassar.go.id',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Standard User
        User::factory()->create([
            'name' => 'Kezia Tappi',
            'email' => 'kezia@magang.go.id',
            'password' => bcrypt('password'),
            'role' => 'user',
            'instansi' => 'Universitas Hasanuddin',
            'tanggal_mulai' => now(),
            'tanggal_berhenti' => now()->addMonths(3),
        ]);

        // Dummy Office Network
        \App\Models\OfficeNetwork::create([
            'name' => 'Localhost Network (Test)',
            'ip_address' => '127.0.0.1',
            'description' => 'For local testing',
        ]);
        
        \App\Models\OfficeNetwork::create([
            'name' => 'Localhost IPv6 (Test)',
            'ip_address' => '::1',
            'description' => 'For local testing IPv6',
        ]);
    }
}
