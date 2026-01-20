import React, { useState, useEffect } from 'react';
import { Award, Plus, Download, FileText, Search, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { cn } from '../../utils/cn';

interface CertificateType {
    id: string;
    name: string;
    prefix: string;
    is_active: boolean;
}

const CertificateGeneration: React.FC = () => {
    const [certificateTypes, setCertificateTypes] = useState<CertificateType[]>([]);
    const [selectedType, setSelectedType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Mock data - replace with API call
        setCertificateTypes([
            { id: '1', name: 'Transfer Certificate (TC)', prefix: 'TC', is_active: true },
            { id: '2', name: 'Bonafide Certificate', prefix: 'BC', is_active: true },
            { id: '3', name: 'Character Certificate', prefix: 'CC', is_active: true },
            { id: '4', name: 'Course Completion', prefix: 'CCC', is_active: true },
            { id: '5', name: 'Migration Certificate', prefix: 'MC', is_active: true },
        ]);
    }, []);

    const handleGenerateCertificate = async () => {
        setLoading(true);
        try {
            // await api.post('certificates/issue', { ... });
            alert('Certificate generated successfully!');
        } catch (error) {
            console.error('Error generating certificate:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Certificate Generation</h1>
                    <p className="text-slate-500 font-medium mt-1">Issue and manage student certificates</p>
                </div>
                <button className="btn-3d btn-3d-primary flex items-center gap-2">
                    <Plus size={20} />
                    Add Certificate Type
                </button>
            </div>

            {/* Certificate Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificateTypes.map((type) => (
                    <div key={type.id} className="card-modern group hover:shadow-2xl transition-all cursor-pointer">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                                <Award className="text-white" size={28} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-black text-slate-900 mb-1">{type.name}</h3>
                                <p className="text-sm text-slate-500 font-bold">Prefix: {type.prefix}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                            <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all">
                                Generate
                            </button>
                            <button className="flex-1 px-4 py-2 bg-slate-50 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition-all">
                                View Issued
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Certificates */}
            <div className="card-modern">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-slate-900">Recently Issued Certificates</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search certificates..."
                            className="input-modern pl-10 w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="text-left py-4 px-4 text-sm font-black text-slate-700 uppercase tracking-wider">Certificate No.</th>
                                <th className="text-left py-4 px-4 text-sm font-black text-slate-700 uppercase tracking-wider">Student Name</th>
                                <th className="text-left py-4 px-4 text-sm font-black text-slate-700 uppercase tracking-wider">Type</th>
                                <th className="text-left py-4 px-4 text-sm font-black text-slate-700 uppercase tracking-wider">Issue Date</th>
                                <th className="text-left py-4 px-4 text-sm font-black text-slate-700 uppercase tracking-wider">Status</th>
                                <th className="text-right py-4 px-4 text-sm font-black text-slate-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((item) => (
                                <tr key={item} className="border-b border-slate-50 hover:bg-slate-50 transition-all">
                                    <td className="py-4 px-4 font-bold text-slate-900">TC/2024/{item.toString().padStart(4, '0')}</td>
                                    <td className="py-4 px-4 text-slate-700 font-medium">Student Name {item}</td>
                                    <td className="py-4 px-4 text-slate-600 font-medium">Transfer Certificate</td>
                                    <td className="py-4 px-4 text-slate-600 font-medium">2024-01-{item.toString().padStart(2, '0')}</td>
                                    <td className="py-4 px-4">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black">
                                            <CheckCircle size={12} className="inline mr-1" />
                                            Issued
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all">
                                                <Download size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-all">
                                                <FileText size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Certificate Verification */}
            <div className="card-modern bg-gradient-to-br from-blue-50 to-purple-50">
                <h3 className="text-xl font-black text-slate-900 mb-4">Certificate Verification</h3>
                <p className="text-slate-600 font-medium mb-4">Verify the authenticity of issued certificates</p>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Enter certificate number..."
                        className="input-modern flex-1"
                    />
                    <button className="btn-3d btn-3d-primary px-8">
                        Verify
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CertificateGeneration;
