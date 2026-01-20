import React, { useState, useEffect } from 'react';
import {
    FileText,
    Plus,
    Calendar,
    CheckCircle,
    Clock,
    ChevronRight,
    ArrowRight,
    Printer,
    X,
    PlusCircle,
    TrendingUp,
    CreditCard
} from 'lucide-react';
import api from '../../services/api';

const PayrollBatches: React.FC = () => {
    const [batches, setBatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Generation Form
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        setLoading(true);
        try {
            const res = await api.get('payroll/batches');
            setBatches(res.data.data);
        } catch (err) {
            console.error('Failed to fetch batches');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        setSubmitting(true);
        try {
            await api.post('payroll/batches', { month, year });
            setShowModal(false);
            fetchBatches();
            alert('Payroll generated for ' + month + '/' + year);
        } catch (err) {
            alert('Generation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const getMonthName = (m: number) => {
        return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2000, m - 1));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center text-gray-900">
                <div>
                    <h1 className="text-2xl font-bold">Monthly Payroll</h1>
                    <p className="text-gray-500">Manage and process monthly staff salary disbursements.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center shadow-lg shadow-primary-200"
                >
                    <PlusCircle size={20} className="mr-2" /> Generate Payroll
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-900">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-gray-500 font-bold">Loading batches...</div>
                ) : batches.length === 0 ? (
                    <div className="col-span-full card p-20 flex flex-col items-center justify-center text-center bg-white shadow-sm border-none">
                        <CreditCard className="text-gray-100 mb-6" size={80} />
                        <h3 className="text-2xl font-black">No Payroll History</h3>
                        <p className="text-gray-400 max-w-xs mt-2 font-medium">Generate your first payroll batch for the current month.</p>
                    </div>
                ) : batches.map(batch => (
                    <div key={batch.id} className="card bg-white p-6 hover:shadow-xl hover:shadow-primary-50 transition-all border-none flex flex-col justify-between group">
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                                    <Calendar size={24} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${batch.status === 'processed' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                    {batch.status}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-xl font-black group-hover:text-primary-600 transition-colors uppercase tracking-tight">
                                    {getMonthName(batch.period_month)} {batch.period_year}
                                </h3>
                                <p className="text-xs text-gray-400 font-bold italic mt-1">Ref: #{batch.id.substring(0, 8).toUpperCase()}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                                <div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Net</div>
                                    <div className="text-sm font-black text-primary-600">₹{parseFloat(batch.total_net || 0).toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Deductions</div>
                                    <div className="text-sm font-black text-red-500">₹{parseFloat(batch.total_deductions || 0).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-2 mt-6">
                            <button className="flex-1 py-3 text-xs font-bold bg-gray-50 text-gray-600 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-all flex items-center justify-center">
                                View Details <ArrowRight size={14} className="ml-1" />
                            </button>
                            <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 hover:text-primary-600 transition-all">
                                <Printer size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Generate Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity">
                    <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
                        <div className="p-6 bg-primary-600 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold">Generate Payroll</h3>
                            <button onClick={() => setShowModal(false)}><X size={24} /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Month</label>
                                    <select
                                        className="input-field py-3 text-gray-800"
                                        value={month}
                                        onChange={(e) => setMonth(parseInt(e.target.value))}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                                            <option key={m} value={m}>{getMonthName(m)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Year</label>
                                    <select
                                        className="input-field py-3 text-gray-800"
                                        value={year}
                                        onChange={(e) => setYear(parseInt(e.target.value))}
                                    >
                                        {[2025, 2026, 2027].map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <p className="text-xs text-center text-gray-400 italic font-medium px-4">
                                This will generate drafted payslips for all active staff based on their current salary structures.
                            </p>
                            <button
                                onClick={handleGenerate}
                                disabled={submitting}
                                className="btn-primary w-full py-4 text-lg shadow-xl shadow-primary-200 flex items-center justify-center"
                            >
                                {submitting ? <Clock size={20} className="animate-spin mr-2" /> : <TrendingUp size={20} className="mr-2" />}
                                Start Generation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayrollBatches;
