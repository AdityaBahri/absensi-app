<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class SingleDeviceSession
{
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() && Auth::user()->role === 'user') {
            $user = Auth::user();
            $deviceId = $request->cookie('device_id');

            if (!$user->device_id) {
                // First time login on any device
                $newDeviceId = $deviceId ?: (string) Str::uuid();
                $user->device_id = $newDeviceId;
                $user->save();
                Cookie::queue('device_id', $newDeviceId, 60 * 24 * 365 * 5); // 5 years
            } else {
                // Check if current device matches
                if ($user->device_id !== $deviceId) {
                    Auth::logout();
                    return redirect()->route('login')->withErrors([
                        'email' => 'Akun ini telah terdaftar pada perangkat lain. Silakan hubungi Admin untuk reset perangkat.',
                    ]);
                }
            }
        }

        return $next($request);
    }
}
