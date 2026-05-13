import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Download, FileSpreadsheet, FileText, Info, CalendarRange } from 'lucide-react';
import { useState } from 'react';

export default function Export() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [exportType, setExportType] = useState('all');

    const buildExportUrl = (format) => {
        const params = new URLSearchParams();
        if (startDate) params.set('start_date', startDate);
        if (endDate) params.set('end_date', endDate);
        params.set('type', exportType);
        params.set('format', format);
        return `/admin/export/download?${params.toString()}`;
    };

    const isValid = startDate && endDate;

    const formatPreview = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '...';

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Export Laporan</h2>}
        >
            <Head title="Export Laporan" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Main Card */}
                    <Card className="border-slate-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileSpreadsheet className="w-5 h-5 text-primary" />
                                Unduh Data Absensi
                            </CardTitle>
                            <CardDescription>
                                Pilih rentang tanggal dan jenis data untuk diunduh sebagai laporan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Date Range */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Tanggal Mulai</Label>
                                    <input
                                        id="start_date"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_date">Tanggal Selesai</Label>
                                    <input
                                        id="end_date"
                                        type="date"
                                        value={endDate}
                                        min={startDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>

                            {/* Type Selector */}
                            <div className="space-y-2">
                                <Label>Jenis Data</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: 'all', label: 'Semua Data' },
                                        { value: 'attendance', label: 'Kehadiran' },
                                        { value: 'permission', label: 'Izin / Sakit' },
                                    ].map((opt) => (
                                        <label
                                            key={opt.value}
                                            className={`cursor-pointer border rounded-xl p-3.5 flex items-center justify-center text-sm font-medium transition-all text-center ${
                                                exportType === opt.value
                                                    ? 'border-primary bg-primary/5 text-primary shadow-sm'
                                                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="export_type"
                                                value={opt.value}
                                                className="sr-only"
                                                checked={exportType === opt.value}
                                                onChange={() => setExportType(opt.value)}
                                            />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Preview */}
                            {isValid && (
                                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-slate-600">
                                    <CalendarRange className="w-4 h-4 text-primary flex-shrink-0" />
                                    <span>
                                        Akan mengekspor data <strong>{exportType === 'all' ? 'semua' : exportType}</strong> dari{' '}
                                        <strong>{formatPreview(startDate)}</strong> hingga{' '}
                                        <strong>{formatPreview(endDate)}</strong>
                                    </span>
                                </div>
                            )}

                            {/* Export Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <a
                                    href={isValid ? buildExportUrl('xlsx') : undefined}
                                    className={!isValid ? 'pointer-events-none' : ''}
                                >
                                    <Button
                                        className="w-full h-12 rounded-xl flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-100"
                                        disabled={!isValid}
                                    >
                                        <FileSpreadsheet className="w-4 h-4" />
                                        Export Excel (.xlsx)
                                    </Button>
                                </a>
                                <a
                                    href={isValid ? buildExportUrl('csv') : undefined}
                                    className={!isValid ? 'pointer-events-none' : ''}
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 rounded-xl flex items-center gap-2"
                                        disabled={!isValid}
                                    >
                                        <FileText className="w-4 h-4" />
                                        Export CSV (.csv)
                                    </Button>
                                </a>
                            </div>

                            {!isValid && (
                                <p className="text-xs text-slate-400 text-center">
                                    Pilih tanggal mulai dan selesai untuk mengaktifkan tombol unduh.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <Card className="border-blue-100 bg-blue-50/40 shadow-none">
                        <CardContent className="pt-4 pb-4 flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-blue-700 space-y-1">
                                <p><strong>Format Excel:</strong> Direkomendasikan untuk laporan resmi dan analisis data dengan tampilan yang lebih rapi.</p>
                                <p><strong>Format CSV:</strong> Cocok untuk keperluan integrasi dengan sistem lain atau analisis dengan Python/R.</p>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
