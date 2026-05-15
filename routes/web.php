<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\AttendanceController::class, 'index'])->name('dashboard');
    
    // User PRD Routes
    Route::get('/attendance', [\App\Http\Controllers\AttendanceController::class, 'attendance'])->name('attendance');
    Route::get('/attendance/history', [\App\Http\Controllers\AttendanceController::class, 'history'])->name('attendance.history');
    Route::get('/permissions', [\App\Http\Controllers\AttendanceController::class, 'permissionsPage'])->name('permissions');
    
    Route::post('/attendance', [\App\Http\Controllers\AttendanceController::class, 'store'])->name('attendance.store');
    Route::post('/permission', [\App\Http\Controllers\AttendanceController::class, 'storePermission'])->name('permission.store');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/users', [\App\Http\Controllers\AdminController::class, 'users'])->name('users');
    Route::post('/users/{id}/reset-device', [\App\Http\Controllers\AdminController::class, 'resetDevice'])->name('users.reset-device');
    Route::get('/attendance', [\App\Http\Controllers\AdminController::class, 'attendance'])->name('attendance');
    Route::get('/export', [\App\Http\Controllers\AdminController::class, 'export'])->name('export');
    Route::get('/export/download', [\App\Http\Controllers\AdminController::class, 'downloadExport'])->name('export.download');
});

require __DIR__.'/auth.php';
