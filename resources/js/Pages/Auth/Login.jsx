import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useEffect } from 'react';
import fpPromise from '@fingerprintjs/fingerprintjs';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        device_id: '',
    });

    useEffect(() => {
        const getDeviceId = async () => {
            const fp = await fpPromise.load();
            const result = await fp.get();
            setData('device_id', result.visitorId);
        };
        getDeviceId();
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex w-full bg-slate-50 font-sans">
            <Head title="Log in" />

            {/* Left Side - Hero / Brand */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-primary via-teal-700 to-brand-red text-primary-foreground p-12 relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Diskominfo Kota Makassar</h2>
                    <div className="inline-flex items-center rounded-full border border-primary-foreground/30 px-3 py-1 text-sm mb-12">
                        Akses Digital Diskominfo
                    </div>
                </div>

                <div className="relative z-10 max-w-lg mt-auto mb-auto">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                        Membangun Pelayanan Publik Digital yang Unggul.
                    </h1>
                    <p className="text-lg text-primary-foreground/80 mb-10">
                        Silakan masuk untuk mencatat kehadiran Anda. Sistem ini terintegrasi dengan jaringan kantor untuk memastikan validitas absensi.
                    </p>
                </div>

                {/* Decorative background circles */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-black/10 blur-3xl"></div>
            </div>

            {/* Right Side - Form */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-slate-50/50 backdrop-blur-md">
                <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Selamat Datang</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Masukkan kredensial akun Anda untuk melanjutkan
                        </p>
                    </div>

                    {status && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6 mt-8">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                className="h-12 rounded-xl"
                                placeholder="nama@makassar.go.id"
                            />
                            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                className="h-12 rounded-xl"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-brand-red hover:from-primary/90 hover:to-brand-red/90 text-white border-0" 
                            disabled={processing}
                        >
                            Masuk ke Portal Lobi
                        </Button>
                    </form>
                    
                    <div className="mt-6 text-center text-sm text-slate-500">
                        Sistem Absensi Digital © 2026 Diskominfo Makassar
                    </div>
                </div>
            </div>
        </div>
    );
}
