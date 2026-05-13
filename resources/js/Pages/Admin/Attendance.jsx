import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { 
    CheckCircle2, 
    Clock,
    FileText,
    Search,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    WifiOff,
    Wifi,
    AlertCircle
} from 'lucide-react';
import { useState } from 'react';

function Tabs({ active, onChange }) {
    return (
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
            {['hadir', 'izin'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                        active === tab
                            ? 'bg-white text-primary shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    {tab === 'hadir' ? '✅ Kehadiran' : '📋 Izin / Sakit'}
                </button>
            ))}
        </div>
    );
}

export default function AttendancePage({ attendances, permissions, filters }) {
    const [activeTab, setActiveTab] = useState('hadir');
    const [search, setSearch] = useState(filters?.search ?? '');
    const [date, setDate] = useState(filters?.date ?? '');

    const handleFilter = () => {
        router.get(route('admin.attendance'), { search, date }, { preserveState: true, replace: true });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleFilter();
    };

    const handleClear = () => {
        setSearch('');
        setDate('');
        router.get(route('admin.attendance'), {}, { preserveState: false });
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : '-';
    const formatTime = (d) => d ? new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-';

    const statusBadge = (status) => {
        const map = {
            valid: 'bg-green-100 text-green-700 border-green-200',
            invalid: 'bg-red-100 text-red-700 border-red-200',
            pending: 'bg-amber-100 text-amber-700 border-amber-200',
            approved: 'bg-blue-100 text-blue-700 border-blue-200',
            rejected: 'bg-slate-100 text-slate-600 border-slate-200',
        };
        return map[status] ?? 'bg-slate-100 text-slate-600 border-slate-200';
    };

    const permissionBadge = (type) => {
        return type === 'sakit'
            ? 'bg-red-100 text-red-700 border-red-200'
            : 'bg-blue-100 text-blue-700 border-blue-200';
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Monitoring Absensi</h2>}
        >
            <Head title="Monitoring Absensi" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Tab Switcher */}
                    <Tabs active={activeTab} onChange={setActiveTab} />

                    {/* Filter Bar */}
                    <Card className="border-slate-100 shadow-sm">
                        <CardContent className="pt-5 pb-5">
                            <div className="flex flex-wrap gap-3 items-end">
                                <div className="flex-1 min-w-48 space-y-1">
                                    <label className="text-xs font-medium text-slate-600">Cari Nama</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Nama karyawan..."
                                            className="h-10 w-full pl-9 pr-4 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-600">Tanggal</label>
                                    <div className="relative">
                                        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="h-10 pl-9 pr-4 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                                <Button onClick={handleFilter} className="h-10 rounded-xl px-5">
                                    Terapkan
                                </Button>
                                {(search || date) && (
                                    <Button onClick={handleClear} variant="outline" className="h-10 rounded-xl px-5">
                                        Reset
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kehadiran Table */}
                    {activeTab === 'hadir' && (
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>Data Kehadiran</CardTitle>
                                <CardDescription>
                                    Menampilkan {attendances?.total ?? 0} catatan absensi masuk.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {attendances?.data?.length > 0 ? (
                                    <>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-xs text-slate-600 uppercase bg-slate-50 border-t border-b border-slate-100">
                                                    <tr>
                                                        <th className="px-6 py-4 font-semibold">Karyawan</th>
                                                        <th className="px-6 py-4 font-semibold">Tanggal</th>
                                                        <th className="px-6 py-4 font-semibold">Jam Masuk</th>
                                                        <th className="px-6 py-4 font-semibold">Jaringan</th>
                                                        <th className="px-6 py-4 font-semibold">IP Address</th>
                                                        <th className="px-6 py-4 font-semibold">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {attendances.data.map((att) => (
                                                        <tr key={att.id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                                                                        {att.user?.name?.charAt(0) ?? '?'}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-semibold text-slate-900">{att.user?.name ?? 'Unknown'}</div>
                                                                        <div className="text-xs text-slate-500">{att.user?.email ?? ''}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-slate-600">{formatDate(att.attendance_date)}</td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                                    {formatTime(att.checkin_time)}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {att.network_validation ? (
                                                                    <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium">
                                                                        <Wifi className="w-3.5 h-3.5" /> Kantor
                                                                    </span>
                                                                ) : (
                                                                    <span className="flex items-center gap-1.5 text-red-500 text-xs font-medium">
                                                                        <WifiOff className="w-3.5 h-3.5" /> Luar
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <code className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-600">{att.ip_address ?? '-'}</code>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <Badge className={`${statusBadge(att.status)} shadow-none capitalize`}>
                                                                    {att.status ?? 'valid'}
                                                                </Badge>
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
                                                    <Button size="sm" variant="outline" className="rounded-xl" disabled={!attendances.prev_page_url}
                                                        onClick={() => router.get(attendances.prev_page_url)}>
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="rounded-xl" disabled={!attendances.next_page_url}
                                                        onClick={() => router.get(attendances.next_page_url)}>
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="p-16 text-center text-slate-500 flex flex-col items-center">
                                        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                            <CheckCircle2 className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="font-medium text-slate-700">Tidak ada data absensi ditemukan.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Izin / Sakit Table */}
                    {activeTab === 'izin' && (
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle>Pengajuan Izin &amp; Sakit</CardTitle>
                                <CardDescription>
                                    Menampilkan {permissions?.total ?? 0} pengajuan.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {permissions?.data?.length > 0 ? (
                                    <>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-xs text-slate-600 uppercase bg-slate-50 border-t border-b border-slate-100">
                                                    <tr>
                                                        <th className="px-6 py-4 font-semibold">Karyawan</th>
                                                        <th className="px-6 py-4 font-semibold">Tanggal</th>
                                                        <th className="px-6 py-4 font-semibold">Jenis</th>
                                                        <th className="px-6 py-4 font-semibold">Keterangan</th>
                                                        <th className="px-6 py-4 font-semibold">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {permissions.data.map((perm) => (
                                                        <tr key={perm.id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                                                                        {perm.user?.name?.charAt(0) ?? '?'}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-semibold text-slate-900">{perm.user?.name ?? 'Unknown'}</div>
                                                                        <div className="text-xs text-slate-500">{perm.user?.email ?? ''}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-slate-600">{formatDate(perm.permission_date)}</td>
                                                            <td className="px-6 py-4">
                                                                <Badge className={`${permissionBadge(perm.permission_type)} shadow-none capitalize`}>
                                                                    {perm.permission_type}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-6 py-4 text-slate-600 max-w-xs">
                                                                <p className="line-clamp-2">{perm.description}</p>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <Badge className={`${statusBadge(perm.status)} shadow-none capitalize`}>
                                                                    {perm.status}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {permissions.last_page > 1 && (
                                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                                                <span className="text-sm text-slate-500">
                                                    Halaman {permissions.current_page} dari {permissions.last_page}
                                                </span>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline" className="rounded-xl" disabled={!permissions.prev_page_url}
                                                        onClick={() => router.get(permissions.prev_page_url)}>
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="rounded-xl" disabled={!permissions.next_page_url}
                                                        onClick={() => router.get(permissions.next_page_url)}>
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="p-16 text-center text-slate-500 flex flex-col items-center">
                                        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                            <FileText className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="font-medium text-slate-700">Tidak ada pengajuan izin/sakit ditemukan.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
