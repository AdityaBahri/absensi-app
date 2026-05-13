import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { 
    User, Mail, Lock, Shield, Trash2, CheckCircle2, 
    Eye, EyeOff, GraduationCap, CalendarRange, AlertTriangle
} from 'lucide-react';
import { useRef, useState } from 'react';

// ── Info Section ────────────────────────────────────────
function ProfileInfoSection({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name ?? '',
        email: user.email ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <Card className="border-slate-100 shadow-sm">
            <CardHeader className="border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-base">Informasi Profil</CardTitle>
                        <CardDescription>Perbarui nama dan alamat email akun Anda.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={submit} className="space-y-5">
                    {/* Avatar Preview */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl flex-shrink-0">
                            {user.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">{user.name}</p>
                            <p className="text-sm text-slate-500">{user.role === 'admin' ? 'Administrator' : 'Karyawan Magang'}</p>
                            {user.instansi && (
                                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                    <GraduationCap className="w-3 h-3" /> {user.instansi}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                autoComplete="name"
                                className="h-11 rounded-xl"
                                required
                            />
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Alamat Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                autoComplete="username"
                                className="h-11 rounded-xl"
                                required
                            />
                            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                        </div>
                    </div>

                    {/* Read-only fields */}
                    {(user.instansi || user.tanggal_mulai) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {user.instansi && (
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1.5 text-slate-500">
                                        <GraduationCap className="w-3.5 h-3.5" /> Instansi
                                    </Label>
                                    <Input value={user.instansi} readOnly className="h-11 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed" />
                                </div>
                            )}
                            {user.tanggal_mulai && (
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1.5 text-slate-500">
                                        <CalendarRange className="w-3.5 h-3.5" /> Periode Magang
                                    </Label>
                                    <Input
                                        value={`${new Date(user.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} – ${user.tanggal_berhenti ? new Date(user.tanggal_berhenti).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '...'}`}
                                        readOnly
                                        className="h-11 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
                            Email belum terverifikasi.{' '}
                            <Link href={route('verification.send')} method="post" as="button" className="underline font-medium hover:text-amber-900">
                                Kirim ulang email verifikasi.
                            </Link>
                        </div>
                    )}

                    <div className="flex items-center gap-4 pt-2">
                        <Button type="submit" className="rounded-xl px-6" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                        {recentlySuccessful && (
                            <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                                <CheckCircle2 className="w-4 h-4" /> Tersimpan!
                            </span>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

// ── Password Section ─────────────────────────────────────
function PasswordSection() {
    const passwordRef = useRef();
    const currentPasswordRef = useRef();
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.password) { reset('password', 'password_confirmation'); passwordRef.current?.focus(); }
                if (errs.current_password) { reset('current_password'); currentPasswordRef.current?.focus(); }
            },
        });
    };

    const ToggleEye = ({ show, onToggle }) => (
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
    );

    return (
        <Card className="border-slate-100 shadow-sm">
            <CardHeader className="border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-blue-100 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <CardTitle className="text-base">Ubah Password</CardTitle>
                        <CardDescription>Pastikan gunakan password yang kuat dan sulit ditebak.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={submit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="current_password">Password Saat Ini</Label>
                        <div className="relative">
                            <Input
                                id="current_password"
                                ref={currentPasswordRef}
                                type={showCurrent ? 'text' : 'password'}
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                                autoComplete="current-password"
                                className="h-11 rounded-xl pr-10"
                            />
                            <ToggleEye show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} />
                        </div>
                        {errors.current_password && <p className="text-xs text-red-500">{errors.current_password}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password Baru</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    ref={passwordRef}
                                    type={showNew ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete="new-password"
                                    className="h-11 rounded-xl pr-10"
                                />
                                <ToggleEye show={showNew} onToggle={() => setShowNew(!showNew)} />
                            </div>
                            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    type={showConfirm ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    autoComplete="new-password"
                                    className="h-11 rounded-xl pr-10"
                                />
                                <ToggleEye show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
                            </div>
                            {errors.password_confirmation && <p className="text-xs text-red-500">{errors.password_confirmation}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                        <Button type="submit" className="rounded-xl px-6" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Perbarui Password'}
                        </Button>
                        {recentlySuccessful && (
                            <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                                <CheckCircle2 className="w-4 h-4" /> Password diperbarui!
                            </span>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

// ── Delete Account Section ────────────────────────────────
function DeleteAccountSection() {
    const [confirming, setConfirming] = useState(false);
    const { data, setData, delete: destroy, processing, errors, reset } = useForm({ password: '' });

    const submit = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => setConfirming(false),
            onError: () => {},
            onFinish: () => reset(),
        });
    };

    return (
        <Card className="border-red-100 shadow-sm">
            <CardHeader className="border-b border-red-100">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-red-100 flex items-center justify-center">
                        <Trash2 className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                        <CardTitle className="text-base text-red-700">Hapus Akun</CardTitle>
                        <CardDescription>Hapus akun secara permanen. Tindakan ini tidak bisa dibatalkan.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {!confirming ? (
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p>Setelah akun dihapus, semua data dan catatan absensi Anda akan ikut terhapus secara permanen.</p>
                        </div>
                        <Button variant="destructive" className="rounded-xl" onClick={() => setConfirming(true)}>
                            Hapus Akun Saya
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={submit} className="space-y-5">
                        <Alert className="bg-red-50 border-red-200">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <AlertDescription className="text-red-700">
                                Konfirmasi bahwa Anda benar-benar ingin menghapus akun ini dengan memasukkan password Anda.
                            </AlertDescription>
                        </Alert>
                        <div className="space-y-2">
                            <Label htmlFor="delete_password">Password</Label>
                            <Input
                                id="delete_password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Masukkan password Anda"
                                className="h-11 rounded-xl max-w-xs"
                            />
                            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                        </div>
                        <div className="flex gap-3">
                            <Button variant="destructive" type="submit" className="rounded-xl" disabled={processing}>
                                {processing ? 'Menghapus...' : 'Ya, Hapus Akun'}
                            </Button>
                            <Button variant="outline" type="button" className="rounded-xl" onClick={() => { setConfirming(false); reset(); }}>
                                Batal
                            </Button>
                        </div>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}

// ── Main Page ─────────────────────────────────────────────
export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Profil Saya</h2>}
        >
            <Head title="Profil Saya" />
            <div className="py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <ProfileInfoSection mustVerifyEmail={mustVerifyEmail} status={status} />
                    <PasswordSection />
                    <DeleteAccountSection />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
