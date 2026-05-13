import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { 
    CalendarCheck, CheckCircle2, MapPin, MapPinOff, 
    Clock, Info, FileText, ShieldCheck
} from 'lucide-react';
import { useEffect, useState } from 'react';

function LiveClock() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return (
        <div className="text-center space-y-1">
            <div className="text-6xl font-extrabold text-slate-800 font-mono tracking-tight">
                {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-sm text-slate-500">
                {time.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
        </div>
    );
}

export default function Index({ todayAttendance, isValidNetwork }) {
    const { is_office_network, client_ip, flash, errors } = usePage().props;
    const networkValid = isValidNetwork ?? is_office_network;
    const { post, processing } = useForm();

    const handleCheckIn = (e) => {
        e.preventDefault();
        post(route('attendance.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Absensi Kehadiran</h2>}
        >
            <Head title="Absensi Kehadiran" />
            <div className="py-10">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Network Status Banner */}
                    <div className={`rounded-2xl p-4 flex items-center gap-3 ${networkValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        {networkValid ? (
                            <>
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <ShieldCheck className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-green-800 text-sm">Jaringan Kantor Terdeteksi</p>
                                    <p className="text-xs text-green-600">Anda terhubung dari jaringan resmi kantor. Absensi dapat dilakukan.</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                    <MapPinOff className="h-5 w-5 text-red-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-red-700 text-sm">Di Luar Jaringan Kantor</p>
                                    <p className="text-xs text-red-500">Absensi hanya dapat dilakukan dari jaringan resmi kantor.</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Alerts */}
                    {flash?.success && (
                        <Alert className="bg-green-50 border-green-200">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">{flash.success}</AlertDescription>
                        </Alert>
                    )}
                    {errors?.attendance && (
                        <Alert className="bg-red-50 border-red-200">
                            <AlertDescription className="text-red-700">{errors.attendance}</AlertDescription>
                        </Alert>
                    )}

                    {/* Main Card */}
                    <Card className="border-slate-100 shadow-md">
                        <CardHeader className="border-b border-slate-100 pb-5 text-center">
                            <CardTitle>Catat Kehadiran Hari Ini</CardTitle>
                            <CardDescription>Sistem mencatat waktu dan lokasi jaringan Anda secara otomatis.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center py-12 space-y-8">
                            <LiveClock />

                            {todayAttendance ? (
                                <div className="text-center space-y-3 w-full">
                                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-xl text-slate-800">Sudah Absen Hari Ini!</p>
                                        <p className="text-slate-500 mt-1">
                                            Tercatat masuk pukul{' '}
                                            <span className="font-semibold text-slate-700">
                                                {new Date(todayAttendance.checkin_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </p>
                                    </div>
                                    <Badge className="bg-green-100 text-green-700 border-green-200 shadow-none px-4 py-1.5 text-sm">
                                        Status: Hadir
                                    </Badge>
                                </div>
                            ) : (
                                <div className="w-full space-y-3">
                                    <form onSubmit={handleCheckIn}>
                                        <Button
                                            size="lg"
                                            className="w-full h-14 rounded-xl text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] gap-2"
                                            disabled={!networkValid || processing}
                                        >
                                            <CalendarCheck className="w-5 h-5" />
                                            {processing ? 'Memproses...' : 'Absen Hadir Sekarang'}
                                        </Button>
                                    </form>
                                    {!networkValid && (
                                        <>
                                            <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
                                                <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                                Tombol dinonaktifkan karena Anda berada di luar jaringan kantor.
                                            </div>
                                            <Link href={route('permissions')}>
                                                <Button variant="outline" className="w-full h-12 rounded-xl gap-2">
                                                    <FileText className="w-4 h-4" />
                                                    Ajukan Izin / Sakit
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="border-t border-slate-100 py-3 text-xs text-slate-400 justify-between">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                Status Jaringan: {networkValid ? <span className="text-green-600 font-medium">Valid</span> : <span className="text-red-500 font-medium">Tidak Valid</span>}
                            </div>
                            <code className="bg-slate-100 px-2 py-0.5 rounded">{client_ip}</code>
                        </CardFooter>
                    </Card>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
