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

    public function downloadExport(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $type = $request->input('type', 'all');
        $format = $request->input('format', 'csv');
        
        $extension = $format === 'xlsx' ? 'csv' : 'csv'; // Force CSV to avoid corruption warnings since we generate CSV
        $filename = "export_{$type}_{$startDate}_{$endDate}.{$extension}";
        
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];
        
        $columns = ['Tanggal', 'Nama', 'Instansi', 'Tipe', 'Status/Waktu Hadir', 'Keterangan'];
        
        $callback = function() use($startDate, $endDate, $type, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            
            if ($type === 'all' || $type === 'attendance') {
                $attendances = Attendance::with('user')
                    ->whereBetween('attendance_date', [$startDate, $endDate])
                    ->orderBy('attendance_date', 'asc')
                    ->get();
                    
                foreach ($attendances as $att) {
                    fputcsv($file, [
                        $att->attendance_date,
                        $att->user ? $att->user->name : 'Unknown',
                        $att->user ? ($att->user->instansi ?? '-') : '-',
                        'Hadir',
                        $att->checkin_time ? date('H:i:s', strtotime($att->checkin_time)) : '-',
                        $att->location ?? '-'
                    ]);
                }
            }
            
            if ($type === 'all' || $type === 'permission') {
                $permissions = Permission::with('user')
                    ->whereBetween('permission_date', [$startDate, $endDate])
                    ->orderBy('permission_date', 'asc')
                    ->get();
                    
                foreach ($permissions as $perm) {
                    fputcsv($file, [
                        $perm->permission_date,
                        $perm->user ? $perm->user->name : 'Unknown',
                        $perm->user ? ($perm->user->instansi ?? '-') : '-',
                        ucfirst($perm->permission_type),
                        ucfirst($perm->status),
                        $perm->reason ?? '-'
                    ]);
                }
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }
}
