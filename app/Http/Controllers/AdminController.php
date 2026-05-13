<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        $today = now()->toDateString();
        
        $totalUsers = User::where('role', 'user')->count();
        $todayAttendances = Attendance::whereDate('attendance_date', $today)->with('user')->get();
        $todayPermissions = Permission::whereDate('permission_date', $today)->with('user')->get();
        
        $recentAttendances = Attendance::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'totalUsers' => $totalUsers,
            'todayAttendances' => $todayAttendances,
            'todayPermissions' => $todayPermissions,
            'recentAttendances' => $recentAttendances,
        ]);
    }

    public function users()
    {
        $users = User::where('role', 'user')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    public function resetDevice(Request $request, $id)
    {
        $user = User::where('role', 'user')->findOrFail($id);
        $user->device_id = null;
        $user->save();

        return redirect()->back()->with('success', 'Perangkat untuk ' . $user->name . ' berhasil direset.');
    }

    public function attendance(Request $request)
    {
        $query = Attendance::with('user')->orderBy('attendance_date', 'desc');

        if ($request->filled('date')) {
            $query->whereDate('attendance_date', $request->date);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $attendances = $query->paginate(15)->withQueryString();
        $permissions = Permission::with('user')
            ->orderBy('permission_date', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Attendance', [
            'attendances' => $attendances,
            'permissions' => $permissions,
            'filters' => $request->only(['date', 'search']),
        ]);
    }

    public function export(Request $request)
    {
        return Inertia::render('Admin/Export');
    }
}
