import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { 
    Info, MapPin, MapPinOff, Clock, CheckCircle2, 
    CalendarCheck, CalendarX, FileText, ArrowRight,
    TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';

function LiveClock() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return (
        <div className="text-center">
            <div className="text-5xl font-extrabold text-slate-800 font-mono tracking-tight">
                {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-sm text-slate-500 mt-1">
                {time.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
        </div>
    );
}

export default function Dashboard({ todayAttendance, history, recentPermissions, isValidNetwork, stats }) {
    const { auth, is_office_network, client_ip, flash, errors } = usePage().props;
    const networkValid = isValidNetwork ?? is_office_network;
    const { post, processing } = useForm();

    const handleCheckIn = (e) => {
        e.preventDefault();
        post(route('attendance.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-primary to-teal-600 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="relative z-10">
                            <p className="text-primary-foreground/70 text-sm font-medium uppercase tracking-widest mb-1">Selamat Datang 👋</p>
                            <h3 className="text-2xl font-bold">{auth.user.name}</h3>
                            <p className="text-primary-foreground/80 text-sm mt-0.5">{auth.user.instansi || 'Magang Diskominfo Makassar'}</p>
                        </div>
                        <div className="relative z-10 flex-shrink-0">
                            {networkValid ? (
                                <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 border py-2 px-4 text-sm gap-2">
                                    <MapPin className="w-4 h-4" /> Jaringan Kantor
                                </Badge>
                            ) : (
                                <Badge className="bg-red-400/40 hover:bg-red-400/50 text-white border-red-300/30 border py-2 px-4 text-sm gap-2">
                                    <MapPinOff className="w-4 h-4" /> Di Luar Kantor
                                </Badge>
                            )}
                        </div>
                        <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
                        <div className="absolute left-1/3 bottom-0 w-40 h-40 bg-black/10 rounded-full blur-2xl pointer-events-none" />
                    </div>

                    {/* Alerts */}
                    {flash?.success && (
                        <Alert className="bg-green-50 border-green-200 text-green-800">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription>{flash.success}</AlertDescription>
                        </Alert>
                    )}
                    {errors?.attendance && (
                        <Alert className="bg-red-50 border-red-200 text-red-800">
                            <AlertDescription>{errors.attendance}</AlertDescription>
                        </Alert>
                    )}

                    {/* Monthly Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="border-slate-100 shadow-sm text-center">
                            <CardContent className="pt-5 pb-5">
                                <div className="text-3xl font-bold text-primary mb-1">{stats?.hadir ?? 0}</div>
                                <div className="text-xs text-slate-500">Hadir Bulan Ini</div>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-100 shadow-sm text-center">
                            <CardContent className="pt-5 pb-5">
                                <div className="text-3xl font-bold text-blue-500 mb-1">{stats?.izin ?? 0}</div>
                                <div className="text-xs text-slate-500">Izin Bulan Ini</div>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-100 shadow-sm text-center">
                            <CardContent className="pt-5 pb-5">
                                <div className="text-3xl font-bold text-red-500 mb-1">{stats?.sakit ?? 0}</div>
                                <div className="text-xs text-slate-500">Sakit Bulan Ini</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Grid */}
                    <div className="grid md:grid-cols-5 gap-6">
                        {/* Check-in Card */}
                        <Card className="md:col-span-2 border-slate-100 shadow-sm flex flex-col">
                            <CardHeader className="border-b border-slate-100 pb-4">
                                <CardTitle className="text-base">Catat Kehadiran</CardTitle>
                                <CardDescription>Absensi masuk untuk hari ini</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col items-center justify-center py-10 space-y-6">
                                <LiveClock />

                                {todayAttendance ? (
                                    <div className="text-center space-y-2">
                                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                                        </div>
                                        <p className="font-semibold text-slate-800">Sudah Absen Hari Ini!</p>
                                        <p className="text-sm text-slate-500">
                                            Pukul {new Date(todayAttendance.checkin_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="w-full space-y-3">
                                        <form onSubmit={handleCheckIn}>
                                            <Button
                                                size="lg"
                                                className="w-full h-13 rounded-xl text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]"
                                                disabled={!networkValid || processing}
                                            >
                                                <CalendarCheck className="w-5 h-5 mr-2" />
                                                Absen Hadir Sekarang
                                            </Button>
                                        </form>
                                        {!networkValid && (
                                            <div className="space-y-2">
                                                <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl">
                                                    <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                                    Anda berada di luar jaringan kantor. Tombol dinonaktifkan.
                                                </div>
                                                <Link href={route('permissions')}>
                                                    <Button variant="outline" className="w-full rounded-xl">
                                                        <FileText className="w-4 h-4 mr-2" /> Ajukan Izin / Sakit
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="border-t border-slate-100 py-3 justify-between text-xs text-slate-400">
                                <span>IP Anda</span>
                                <code className="bg-slate-100 px-2 py-0.5 rounded">{client_ip}</code>
                            </CardFooter>
                        </Card>

                        {/* Recent Activity */}
                        <div className="md:col-span-3 space-y-6">
                            {/* Recent Attendance */}
                            <Card className="border-slate-100 shadow-sm">
                                <CardHeader className="border-b border-slate-100 pb-4 flex flex-row justify-between items-center">
                                    <div>
                                        <CardTitle className="text-base">Kehadiran Terakhir</CardTitle>
                                        <CardDescription>5 catatan terbaru</CardDescription>
                                    </div>
                                    <Link href={route('attendance.history')} className="text-xs text-primary hover:underline flex items-center gap-1">
                                        Lihat Semua <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {history?.length > 0 ? (
                                        <div className="divide-y divide-slate-50">
                                            {history.map((rec) => (
                                                <div key={rec.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <Clock className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-800">
                                                                {new Date(rec.attendance_date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                            </p>
                                                            <p className="text-xs text-slate-400">
                                                                {new Date(rec.checkin_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge className="bg-green-100 text-green-700 border-green-200 shadow-none text-xs">Hadir</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-10 text-center text-slate-400 text-sm">Belum ada catatan kehadiran.</div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Recent Permissions */}
                            <Card className="border-slate-100 shadow-sm">
                                <CardHeader className="border-b border-slate-100 pb-4 flex flex-row justify-between items-center">
                                    <div>
                                        <CardTitle className="text-base">Izin / Sakit Terakhir</CardTitle>
                                        <CardDescription>5 pengajuan terbaru</CardDescription>
                                    </div>
                                    <Link href={route('permissions')} className="text-xs text-primary hover:underline flex items-center gap-1">
                                        Lihat Semua <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {recentPermissions?.length > 0 ? (
                                        <div className="divide-y divide-slate-50">
                                            {recentPermissions.map((perm) => (
                                                <div key={perm.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${perm.permission_type === 'sakit' ? 'bg-red-100' : 'bg-blue-100'}`}>
                                                            <FileText className={`w-4 h-4 ${perm.permission_type === 'sakit' ? 'text-red-500' : 'text-blue-500'}`} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-800 capitalize">{perm.permission_type}</p>
                                                            <p className="text-xs text-slate-400">
                                                                {new Date(perm.permission_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge className={`shadow-none text-xs capitalize ${perm.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' : perm.status === 'rejected' ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                                                        {perm.status}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-10 text-center text-slate-400 text-sm">Belum ada pengajuan izin/sakit.</div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
