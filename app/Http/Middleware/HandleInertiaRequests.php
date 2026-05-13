<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $ipAddress = $request->ip();
        $isOfficeNetwork = false;
        
        if (class_exists(\App\Models\OfficeNetwork::class)) {
            $isOfficeNetwork = \App\Models\OfficeNetwork::where('ip_address', $ipAddress)
                                ->where('is_active', true)
                                ->exists();
        }

        // Bypass for local development
        if ($ipAddress === '127.0.0.1' || $ipAddress === '::1') {
            $isOfficeNetwork = true;
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'is_office_network' => $isOfficeNetwork,
            'client_ip' => $request->ip(),
        ];
    }
}
