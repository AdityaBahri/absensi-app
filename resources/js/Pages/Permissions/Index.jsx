import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { 
    FileText, CheckCircle2, Clock, ChevronLeft, ChevronRight,
    SendHorizontal, AlertCircle, Ban
} from 'lucide-react';

const statusClass = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    approved: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-slate-100 text-slate-500 border-slate-200',
};

const typeClass = {
    izin: 'bg-blue-100 text-blue-700 border-blue-200',
    sakit: 'bg-red-100 text-red-700 border-red-200',
};

export default function Permissions({ permissions, todayPermission, todayAttendance }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'izin',
        description: '',
    });

    const isAlreadyRecorded = !!todayAttendance || !!todayPermission;

    const submit = (e) => {
        e.preventDefault();
        post(route('permission.store'), {
            preserveScroll: true,
            onSuccess: () => reset('description'),
        });
    };

    const formatDate = (d) => d
        ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : '-';

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Izin &amp; Sakit</h2>}
        >
            <Head title="Izin & Sakit" />
            <div className="py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-5 gap-6">

                        {/* Form */}
                        <div className="md:col-span-2 space-y-4">
                            <Card className="border-slate-100 shadow-sm">
                                <CardHeader className="border-b border-slate-100">
                                    <CardTitle className="text-base">Form Pengajuan</CardTitle>
                                    <CardDescription>Ajukan izin atau sakit untuk hari ini.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {isAlreadyRecorded ? (
                                        <div className="space-y-3 text-center py-4">
                                            <div className="h-14 w-14 rounded-full mx-auto flex items-center justify-center bg-slate-100">
                                                <Ban className="h-7 w-7 text-slate-400" />
                                            </div>
                                            <p className="font-semibold text-slate-700">Pengajuan Ditutup</p>
                                            <p className="text-xs text-slate-500">
                                                {todayAttendance
                                                    ? 'Anda sudah tercatat hadir hari ini.'
                                                    : 'Anda sudah mengajukan izin/sakit hari ini.'}
                                            </p>
                                        </div>
                                    ) : (
                                        <form onSubmit={submit} className="space-y-5">
                                            {/* Type selector */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700">Jenis Pengajuan</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['izin', 'sakit'].map((t) => (
                                                        <label
                                                            key={t}
                                                            className={`cursor-pointer border rounded-xl py-3 flex items-center justify-center text-sm font-medium transition-all capitalize ${
                                                                data.type === t
                                                                    ? t === 'izin'
                                                                        ? 'border-blue-400 bg-blue-50 text-blue-700'
                                                                        : 'border-red-400 bg-red-50 text-red-700'
                                                                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                                                            }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="type"
                                                                value={t}
                                                                className="sr-only"
                                                                checked={data.type === t}
                                                                onChange={() => setData('type', t)}
                                                            />
                                                            {t === 'izin' ? '📋 Izin' : '🤒 Sakit'}
                                                        </label>
                                                    ))}
                                                </div>
                                                {errors.type && <p className="text-xs text-red-500">{errors.type}</p>}
                                            </div>

                                            {/* Description */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700">Keterangan / Alasan</label>
                                                <textarea
                                                    rows={4}
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    placeholder="Tuliskan alasan Anda di sini..."
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                                                    required
                                                />
                                                {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                                            </div>

                                            {errors.permission && (
                                                <Alert className="bg-red-50 border-red-200 py-2">
                                                    <AlertDescription className="text-red-700 text-xs">{errors.permission}</AlertDescription>
                                                </Alert>
                                            )}

                                            <Button
                                                type="submit"
                                                className="w-full h-11 rounded-xl gap-2"
                                                disabled={processing}
                                            >
                                                <SendHorizontal className="w-4 h-4" />
                                                {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Today status info */}
                            {todayPermission && (
                                <Card className="border-amber-100 bg-amber-50/50 shadow-none">
                                    <CardContent className="pt-4 pb-4 flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-amber-700">
                                            <p className="font-semibold">Pengajuan Hari Ini</p>
                                            <p className="capitalize">{todayPermission.permission_type} — {todayPermission.status}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* History */}
                        <div className="md:col-span-3">
                            <Card className="border-slate-100 shadow-sm">
                                <CardHeader className="border-b border-slate-100">
                                    <CardTitle className="text-base">Riwayat Pengajuan</CardTitle>
                                    <CardDescription>Semua pengajuan izin dan sakit Anda.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {permissions?.data?.length > 0 ? (
                                        <>
                                            <div className="divide-y divide-slate-50">
                                                {permissions.data.map((perm) => (
                                                    <div key={perm.id} className="px-5 py-4 hover:bg-slate-50/50 transition-colors">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${perm.permission_type === 'sakit' ? 'bg-red-100' : 'bg-blue-100'}`}>
                                                                    <FileText className={`w-4 h-4 ${perm.permission_type === 'sakit' ? 'text-red-500' : 'text-blue-500'}`} />
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Badge className={`${typeClass[perm.permission_type] ?? ''} shadow-none text-xs capitalize`}>
                                                                            {perm.permission_type}
                                                                        </Badge>
                                                                        <span className="text-xs text-slate-400">{formatDate(perm.permission_date)}</span>
                                                                    </div>
                                                                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{perm.description}</p>
                                                                </div>
                                                            </div>
                                                            <Badge className={`${statusClass[perm.status] ?? ''} shadow-none text-xs capitalize flex-shrink-0`}>
                                                                {perm.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Pagination */}
                                            {permissions.last_page > 1 && (
                                                <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
                                                    <span className="text-sm text-slate-500">
                                                        Halaman {permissions.current_page} dari {permissions.last_page}
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="outline" className="rounded-xl"
                                                            disabled={!permissions.prev_page_url}
                                                            onClick={() => router.get(permissions.prev_page_url)}>
                                                            <ChevronLeft className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="rounded-xl"
                                                            disabled={!permissions.next_page_url}
                                                            onClick={() => router.get(permissions.next_page_url)}>
                                                            <ChevronRight className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="py-16 text-center text-slate-500 flex flex-col items-center">
                                            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                                <FileText className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <p className="font-medium text-slate-700">Belum ada riwayat pengajuan.</p>
                                        </div>
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
