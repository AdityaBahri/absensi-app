import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Users, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';

export default function Dashboard({ totalUsers, todayAttendances, todayPermissions, recentAttendances }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Dashboard Admin</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="shadow-sm border-slate-100">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Total Karyawan</CardTitle>
                                <Users className="h-4 w-4 text-slate-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-800">{totalUsers}</div>
                                <p className="text-xs text-slate-500 mt-1">Terdaftar di sistem</p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-slate-100">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Hadir Hari Ini</CardTitle>
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-800">{todayAttendances.length}</div>
                                <p className="text-xs text-slate-500 mt-1">Orang tercatat absen masuk</p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-slate-100">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Izin / Sakit</CardTitle>
                                <FileText className="h-4 w-4 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-800">{todayPermissions.length}</div>
                                <p className="text-xs text-slate-500 mt-1">Pengajuan hari ini</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Attendances */}
                    <Card className="shadow-sm border-slate-100">
                        <CardHeader>
                            <CardTitle>Absensi Terbaru</CardTitle>
                            <CardDescription>10 orang terakhir yang melakukan absensi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentAttendances && recentAttendances.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-slate-500">
                                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 rounded-t-lg">
                                            <tr>
                                                <th className="px-6 py-3 rounded-tl-lg">Nama</th>
                                                <th className="px-6 py-3">Waktu Masuk</th>
                                                <th className="px-6 py-3">Status Jaringan</th>
                                                <th className="px-6 py-3 rounded-tr-lg">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentAttendances.map((att) => (
                                                <tr key={att.id} className="bg-white border-b border-slate-50 hover:bg-slate-50/50">
                                                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                            {att.user?.name?.charAt(0) || '?'}
                                                        </div>
                                                        {att.user?.name || 'Unknown User'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {new Date(att.checkin_time).toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {att.network_validation ? (
                                                            <span className="text-green-600 flex items-center gap-1 text-xs font-medium">
                                                                <CheckCircle2 className="w-3 h-3" /> Valid
                                                            </span>
                                                        ) : (
                                                            <span className="text-red-600 flex items-center gap-1 text-xs font-medium">
                                                                Luar Kantor
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 shadow-none">
                                                            {att.attendance_type}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                                    <Clock className="w-8 h-8 text-slate-300 mb-3" />
                                    <p>Belum ada data absensi terbaru.</p>
                                </div>
                            )}
                            
                            <div className="mt-6 text-center">
                                <Link href={route('admin.attendance')} className="text-primary hover:underline text-sm font-medium">
                                    Lihat Semua Data Absensi →
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
