import React, { useState, useEffect } from 'react';
import {
    Wallet,
    Plus,
    Layers,
    Settings,
    Trash2,
    Edit,
    X,
    TrendingUp,
    TrendingDown,
    User,
    Search,
    CheckCircle,
    PlusCircle
} from 'lucide-react';
import api from '../../services/api';

const SalarySetup: React.FC = () => {
    const [components, setComponents] = useState<any[]>([]);
    const [staffList, setStaffList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCompModal, setShowCompModal] = useState(false);

    // New Component Form
    const [compForm, setCompForm] = useState({ name: '', type: 'earning', isFixed: true });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [compRes, staffRes] = await Promise.all([
                api.get('payroll/components'),
                api.get('user/list', { params: { roles: ['teacher', 'staff'] } })
            ]);
            setComponents(compRes.data.data);
            setStaffList(staffRes.data.data);
        } catch (err) {
            console.error('Failed to fetch payroll data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateComp = async () => {
        try {
            await api.post('payroll/components', compForm);
            setShowCompModal(false);
            setCompForm({ name: '', type: 'earning', isFixed: true });
            fetchData();
        } catch (err) {
            alert('Failed to create component');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center text-gray-900">
                <div>
                    <h1 className="text-2xl font-bold">Payroll Configuration</h1>
                    <p className="text-gray-500">Manage salary components and staff salary structures.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Salary Components */}
                <div className="card bg-white text-gray-900 border-none shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center">
                            <Layers size={20} className="mr-2 text-primary-600" />
                            <h2 className="font-bold">Salary Components</h2>
                        </div>
                        <button onClick={() => setShowCompModal(true)} className="p-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 transition-colors">
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Earnings</label>
                            {components.filter(c => c.type === 'earning').map(c => (
                                <div key={c.id} className="p-4 bg-green-50/50 rounded-2xl flex items-center justify-between border border-green-100 group">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mr-3">
                                            <TrendingUp size={16} />
                                        </div>
                                        <div className="text-sm font-bold">{c.name}</div>
                                    </div>
                                    <button className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Deductions</label>
                            {components.filter(c => c.type === 'deduction').map(c => (
                                <div key={c.id} className="p-4 bg-red-50/50 rounded-2xl flex items-center justify-between border border-red-100 group">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mr-3">
                                            <TrendingDown size={16} />
                                        </div>
                                        <div className="text-sm font-bold">{c.name}</div>
                                    </div>
                                    <button className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Staff List */}
                <div className="card bg-white text-gray-900 border-none shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center">
                            <User size={20} className="mr-2 text-primary-600" />
                            <h2 className="font-bold">Staff Salary Mapping</h2>
                        </div>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="text" className="input-field pl-10 py-2.5 text-xs" placeholder="Filter staff..." />
                        </div>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                            {staffList.map(s => (
                                <div key={s.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary-200 transition-all group flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-xl bg-gray-200 text-gray-500 flex items-center justify-center font-bold mr-3 overflow-hidden">
                                            {s.first_name[0]}{s.last_name[0]}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold">{s.first_name} {s.last_name}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{s.role_name} • {s.staff_code || 'EMP-001'}</div>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 bg-white text-xs font-bold text-primary-600 rounded-xl border border-primary-100 opacity-0 group-hover:opacity-100 transition-all shadow-sm">Setup Salary</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showCompModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 bg-primary-600 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold">New Salary Component</h3>
                            <button onClick={() => setShowCompModal(false)}><X size={24} /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Component Name</label>
                                    <input value={compForm.name} onChange={(e) => setCompForm({ ...compForm, name: e.target.value })} type="text" className="input-field py-3 text-gray-900" placeholder="e.g. Basic Salary" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Type</label>
                                        <select value={compForm.type} onChange={(e) => setCompForm({ ...compForm, type: e.target.value })} className="input-field py-3 text-gray-900">
                                            <option value="earning">Earning</option>
                                            <option value="deduction">Deduction</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Fixed Amount?</label>
                                        <div className="flex p-1 bg-gray-100 rounded-xl">
                                            <button onClick={() => setCompForm({ ...compForm, isFixed: true })} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${compForm.isFixed ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-400'}`}>Yes</button>
                                            <button onClick={() => setCompForm({ ...compForm, isFixed: false })} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!compForm.isFixed ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-400'}`}>No</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleCreateComp} className="btn-primary w-full py-4 text-lg shadow-xl shadow-primary-100">Create Component</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalarySetup;
