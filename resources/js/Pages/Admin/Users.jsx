import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { 
    Users, 
    Smartphone, 
    SmartphoneNfc, 
    CheckCircle2, 
    RotateCcw,
    GraduationCap,
    CalendarRange,
    Shield
} from 'lucide-react';
import { useState } from 'react';

function ResetDeviceButton({ userId, userName }) {
    const { post, processing } = useForm();

    const handleReset = () => {
        if (confirm(`Reset perangkat untuk ${userName}? Akun akan bisa login dari perangkat mana saja sampai login berikutnya.`)) {
            post(route('admin.users.reset-device', userId));
        }
    };

    return (
        <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            disabled={processing}
            className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 transition-all"
        >
            <RotateCcw className={`w-3 h-3 mr-1.5 ${processing ? 'animate-spin' : ''}`} />
            Reset Device
        </Button>
    );
}

export default function UsersPage({ users }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState('');

    const filtered = users?.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.instansi || '').toLowerCase().includes(search.toLowerCase())
    ) ?? [];

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Manajemen User</h2>}
        >
            <Head title="Manajemen User" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Flash Success */}
                    {flash?.success && (
                        <Alert className="bg-green-50 border-green-200 text-green-800">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription>{flash.success}</AlertDescription>
                        </Alert>
                    )}

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-slate-100 shadow-sm">
                            <CardContent className="pt-6 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-800">{users?.length ?? 0}</div>
                                    <div className="text-xs text-slate-500">Total Karyawan</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-100 shadow-sm">
                            <CardContent className="pt-6 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center">
                                    <SmartphoneNfc className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-800">{users?.filter(u => u.device_id).length ?? 0}</div>
                                    <div className="text-xs text-slate-500">Device Terdaftar</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-100 shadow-sm">
                            <CardContent className="pt-6 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                                    <Smartphone className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-800">{users?.filter(u => !u.device_id).length ?? 0}</div>
                                    <div className="text-xs text-slate-500">Belum Terdaftar</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* User Table */}
                    <Card className="border-slate-100 shadow-sm">
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Daftar Karyawan Magang</CardTitle>
                                <CardDescription>Kelola akses dan perangkat setiap karyawan.</CardDescription>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari nama, email, instansi..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full sm:w-72 h-10 pl-4 pr-4 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {filtered.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-600 uppercase bg-slate-50 border-t border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold">Karyawan</th>
                                                <th className="px-6 py-4 font-semibold">Instansi</th>
                                                <th className="px-6 py-4 font-semibold">Periode Magang</th>
                                                <th className="px-6 py-4 font-semibold">Status Device</th>
                                                <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {filtered.map((user) => (
                                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-slate-900">{user.name}</div>
                                                                <div className="text-xs text-slate-500">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1.5 text-slate-600">
                                                            <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                                                            <span>{user.instansi || '-'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {user.tanggal_mulai ? (
                                                            <div className="flex items-center gap-1.5 text-slate-600">
                                                                <CalendarRange className="w-3.5 h-3.5 text-slate-400" />
                                                                <span className="text-xs">
                                                                    {formatDate(user.tanggal_mulai)} – {formatDate(user.tanggal_berhenti)}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400 text-xs">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {user.device_id ? (
                                                            <Badge className="bg-green-100 text-green-700 border-green-200 shadow-none hover:bg-green-100 gap-1.5">
                                                                <SmartphoneNfc className="w-3 h-3" />
                                                                Terikat
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-slate-100 text-slate-500 border-slate-200 shadow-none hover:bg-slate-100 gap-1.5">
                                                                <Smartphone className="w-3 h-3" />
                                                                Belum Terdaftar
                                                            </Badge>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <ResetDeviceButton userId={user.id} userName={user.name} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-16 text-center text-slate-500 flex flex-col items-center">
                                    <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                        <Users className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="font-medium text-slate-700">
                                        {search ? 'Tidak ada karyawan yang sesuai pencarian.' : 'Belum ada karyawan terdaftar.'}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <Card className="border-amber-100 bg-amber-50/50 shadow-none">
                        <CardContent className="pt-5 pb-5 flex items-start gap-3">
                            <Shield className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-amber-700">
                                <span className="font-semibold">Tentang Reset Device:</span> Jika karyawan berganti perangkat dan tidak bisa login, Admin dapat menekan tombol <strong>"Reset Device"</strong> agar perangkat lama dilepaskan. Karyawan tersebut kemudian bisa login kembali dan perangkat barunya akan otomatis terdaftar.
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
