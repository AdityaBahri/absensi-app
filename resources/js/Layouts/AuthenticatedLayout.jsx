import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { 
    LayoutDashboard, 
    CalendarCheck, 
    History, 
    FileText,
    Users,
    Activity,
    Download,
    Menu,
    X,
    LogOut,
    User
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const adminNavigation = [
        { name: 'Dashboard Admin', href: route('admin.dashboard'), icon: LayoutDashboard, current: route().current('admin.dashboard') },
        { name: 'Manajemen User', href: route('admin.users'), icon: Users, current: route().current('admin.users') },
        { name: 'Monitoring Absensi', href: route('admin.attendance'), icon: Activity, current: route().current('admin.attendance') },
        { name: 'Export Laporan', href: route('admin.export'), icon: Download, current: route().current('admin.export') },
    ];

    const userNavigation = [
        { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard, current: route().current('dashboard') },
        { name: 'Absensi', href: route('attendance'), icon: CalendarCheck, current: route().current('attendance') },
        { name: 'Riwayat Absensi', href: route('attendance.history'), icon: History, current: route().current('attendance.history') },
        { name: 'Izin & Sakit', href: route('permissions'), icon: FileText, current: route().current('permissions') },
    ];

    const navigation = user.role === 'admin' ? adminNavigation : userNavigation;

    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex lg:w-72 lg:flex-col ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
                    <Link href="/" className="flex items-center gap-2">
                        <ApplicationLogo className="block h-8 w-auto fill-primary text-primary" />
                        <span className="text-xl font-bold tracking-tight text-slate-900">Komi<span className="text-primary">nfo</span></span>
                    </Link>
                    <button 
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-slate-500 hover:text-slate-700"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4">
                    <nav className="flex-1 space-y-1 px-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                                    item.current
                                        ? 'bg-primary/10 text-primary shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                                        item.current ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'
                                    }`}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                
                {/* User Profile in Sidebar Bottom */}
                <div className="border-t border-slate-100 p-4 space-y-1">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shadow-sm flex-shrink-0">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col text-left min-w-0">
                            <span className="text-sm font-semibold text-slate-900 truncate">{user.name}</span>
                            <span className="text-xs text-slate-500">{user.role === 'admin' ? 'Administrator' : 'Karyawan'}</span>
                        </div>
                    </div>
                    <Link
                        href={route('profile.edit')}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                        <User className="h-4 w-4 text-slate-400" />
                        Profil Saya
                    </Link>
                    <button
                        onClick={() => router.post(route('logout'))}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top header for mobile */}
                <div className="lg:hidden flex h-16 flex-shrink-0 items-center border-b border-slate-200 bg-white px-4 shadow-sm">
                    <button
                        type="button"
                        className="text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <div className="ml-4 text-lg font-semibold text-slate-900 truncate">
                        Dashboard
                    </div>
                </div>

                {/* Main section */}
                <main className="flex-1 overflow-y-auto focus:outline-none">
                    {/* Desktop header */}
                    {header && (
                        <header className="hidden lg:block bg-white border-b border-slate-200">
                            <div className="px-8 py-5">
                                {header}
                            </div>
                        </header>
                    )}
                    
                    {/* Mobile header rendering if needed inside content area, but we have a fixed mobile header above */}
                    <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4">
                        {header}
                    </div>
                    
                    <div className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
