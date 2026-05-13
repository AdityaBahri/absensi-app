import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Clock, CalendarDays, TrendingUp, ChevronLeft, ChevronRight, Wifi, WifiOff } from 'lucide-react';
import { useState } from 'react';

export default function History({ attendances, totalHadir, thisMonthHadir, filters }) {
    const [month, setMonth] = useState(filters?.month ?? '');

    const handleFilter = () => {
        router.get(route('attendance.history'), { month }, { preserveState: true, replace: true });
    };

    const handleClear = () => {
        setMonth('');
        router.get(route('attendance.history'), {}, { preserveState: false });
    };

    const formatDate = (d) => d
        ? new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        : '-';

    const formatTime = (d) => d
        ? new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        : '-';

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Riwayat Absensi</h2>}
        >
            <Head title="Riwayat Absensi" />
            <div className="py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="border-slate-100 shadow-sm">
                            <CardContent className="pt-5 pb-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-800">{totalHadir}</div>
                                    <div className="text-xs text-slate-500">Total Hadir Keseluruhan</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-100 shadow-sm">
                            <CardContent className="pt-5 pb-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center">
                                    <CalendarDays className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-800">{thisMonthHadir}</div>
                                    <div className="text-xs text-slate-500">Hadir Bulan Ini</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filter */}
                    <Card className="border-slate-100 shadow-sm">
                        <CardContent className="pt-5 pb-5">
                            <div className="flex flex-wrap gap-3 items-end">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-600">Filter Bulan</label>
                                    <input
                                        type="month"
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                        className="h-10 px-4 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                    />
                                </div>
                                <Button onClick={handleFilter} className="h-10 rounded-xl px-5">
                                    Terapkan
                                </Button>
                                {month && (
                                    <Button onClick={handleClear} variant="outline" className="h-10 rounded-xl px-5">
                                        Reset
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Table */}
                    <Card className="border-slate-100 shadow-sm">
                        <CardHeader>
                            <CardTitle>Rekap Kehadiran</CardTitle>
                            <CardDescription>
                                Menampilkan {attendances?.total ?? 0} catatan absensi.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {attendances?.data?.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-slate-600 uppercase bg-slate-50 border-t border-b border-slate-100">
                                                <tr>
                                                    <th className="px-6 py-4 font-semibold">Tanggal</th>
                                                    <th className="px-6 py-4 font-semibold">Jam Masuk</th>
                                                    <th className="px-6 py-4 font-semibold">Jaringan</th>
                                                    <th className="px-6 py-4 font-semibold">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {attendances.data.map((att) => (
                                                    <tr key={att.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                                                                    <CalendarDays className="h-4 w-4 text-primary" />
                                                                </div>
                                                                <span className="font-medium text-slate-800">{formatDate(att.attendance_date)}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                                {formatTime(att.checkin_time)}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {att.network_validation ? (
                                                                <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium">
                                                                    <Wifi className="w-3.5 h-3.5" /> Jaringan Kantor
                                                                </span>
                                                            ) : (
                                                                <span className="flex items-center gap-1.5 text-red-500 text-xs font-medium">
                                                                    <WifiOff className="w-3.5 h-3.5" /> Luar Kantor
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <Badge className="bg-green-100 text-green-700 border-green-200 shadow-none">Hadir</Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {attendances.last_page > 1 && (
                                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                                            <span className="text-sm text-slate-500">
                                                Halaman {attendances.current_page} dari {attendances.last_page}
                                            </span>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="rounded-xl"
                                                    disabled={!attendances.prev_page_url}
                                                    onClick={() => router.get(attendances.prev_page_url)}>
                                                    <ChevronLeft className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="outline" className="rounded-xl"
                                                    disabled={!attendances.next_page_url}
                                                    onClick={() => router.get(attendances.next_page_url)}>
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="py-16 text-center text-slate-500 flex flex-col items-center">
                                    <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                        <Clock className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="font-medium text-slate-700">
                                        {month ? 'Tidak ada data untuk bulan ini.' : 'Belum ada riwayat kehadiran.'}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
