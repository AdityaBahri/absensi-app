<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\OfficeNetwork;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    private function checkNetwork(): bool
    {
        $ip = request()->ip();
        if ($ip === '127.0.0.1' || $ip === '::1') return true;
        return OfficeNetwork::where('ip_address', $ip)->where('is_active', true)->exists();
    }

    public function index()
    {
        $user = Auth::user();

        $todayAttendance = Attendance::where('user_id', $user->id)
            ->whereDate('attendance_date', now()->toDateString())
            ->first();

        $history = Attendance::where('user_id', $user->id)
            ->orderBy('attendance_date', 'desc')
            ->limit(5)
            ->get();

        $recentPermissions = Permission::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $monthlyHadir = Attendance::where('user_id', $user->id)
            ->whereYear('attendance_date', now()->year)
            ->whereMonth('attendance_date', now()->month)
            ->count();
        $monthlyIzin = Permission::where('user_id', $user->id)
            ->whereYear('permission_date', now()->year)
            ->whereMonth('permission_date', now()->month)
            ->where('permission_type', 'izin')
            ->count();
        $monthlySakit = Permission::where('user_id', $user->id)
            ->whereYear('permission_date', now()->year)
            ->whereMonth('permission_date', now()->month)
            ->where('permission_type', 'sakit')
            ->count();

        return Inertia::render('Dashboard', [
            'todayAttendance' => $todayAttendance,
            'history' => $history,
            'recentPermissions' => $recentPermissions,
            'isValidNetwork' => $this->checkNetwork(),
            'stats' => [
                'hadir' => $monthlyHadir,
                'izin' => $monthlyIzin,
                'sakit' => $monthlySakit,
            ],
        ]);
    }

    public function attendance()
    {
        $user = Auth::user();
        $todayAttendance = Attendance::where('user_id', $user->id)
            ->whereDate('attendance_date', now()->toDateString())
            ->first();

        return Inertia::render('Attendance/Index', [
            'todayAttendance' => $todayAttendance,
            'isValidNetwork' => $this->checkNetwork(),
        ]);
    }

    public function history(Request $request)
    {
        $user = Auth::user();
        $query = Attendance::where('user_id', $user->id)->orderBy('attendance_date', 'desc');

        if ($request->filled('month')) {
            [$year, $month] = explode('-', $request->month);
            $query->whereYear('attendance_date', $year)->whereMonth('attendance_date', $month);
        }

        $attendances = $query->paginate(15)->withQueryString();
        $totalHadir = Attendance::where('user_id', $user->id)->count();
        $thisMonthHadir = Attendance::where('user_id', $user->id)
            ->whereYear('attendance_date', now()->year)
            ->whereMonth('attendance_date', now()->month)
            ->count();

        return Inertia::render('Attendance/History', [
            'attendances' => $attendances,
            'totalHadir' => $totalHadir,
            'thisMonthHadir' => $thisMonthHadir,
            'filters' => $request->only(['month']),
        ]);
    }

    public function permissionsPage(Request $request)
    {
        $user = Auth::user();
        $todayPermission = Permission::where('user_id', $user->id)
            ->whereDate('permission_date', now()->toDateString())
            ->first();
        $todayAttendance = Attendance::where('user_id', $user->id)
            ->whereDate('attendance_date', now()->toDateString())
            ->first();
        $permissions = Permission::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Permissions/Index', [
            'permissions' => $permissions,
            'todayPermission' => $todayPermission,
            'todayAttendance' => $todayAttendance,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $isValidNetwork = $this->checkNetwork();

        if (!$isValidNetwork) {
            return back()->withErrors(['attendance' => 'Anda berada di luar jaringan kantor.']);
        }

        $alreadyCheckedIn = Attendance::where('user_id', $user->id)
            ->whereDate('attendance_date', now()->toDateString())
            ->exists();

        if ($alreadyCheckedIn) {
            return back()->withErrors(['attendance' => 'Anda sudah melakukan absensi hari ini.']);
        }

        Attendance::create([
            'user_id' => $user->id,
            'attendance_type' => 'hadir',
            'attendance_date' => now()->toDateString(),
            'checkin_time' => now(),
            'ip_address' => $request->ip(),
            'network_validation' => true,
            'status' => 'valid',
        ]);

        return redirect()->back()->with('success', 'Berhasil melakukan absensi hadir.');
    }

    public function storePermission(Request $request)
    {
        $request->validate([
            'type' => 'required|in:izin,sakit',
            'description' => 'required|string|max:500',
        ]);

        $user = Auth::user();

        $alreadyExists = Attendance::where('user_id', $user->id)
                ->whereDate('attendance_date', now()->toDateString())
                ->exists()
            || Permission::where('user_id', $user->id)
                ->whereDate('permission_date', now()->toDateString())
                ->exists();

        if ($alreadyExists) {
            return back()->withErrors(['permission' => 'Anda sudah tercatat hadir atau izin hari ini.']);
        }

        Permission::create([
            'user_id' => $user->id,
            'permission_type' => $request->type,
            'permission_date' => now()->toDateString(),
            'description' => $request->description,
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Berhasil mengajukan ' . $request->type . '.');
    }
}
