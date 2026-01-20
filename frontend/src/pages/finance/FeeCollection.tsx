import React, { useState, useEffect } from 'react';
import {
    Search,
    DollarSign,
    CreditCard,
    Calendar,
    User,
    CheckCircle,
    Clock,
    Printer,
    FileText,
    AlertCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import api from '../../services/api';

const FeeCollection: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [feeStatus, setFeeStatus] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Payment Form
    const [paymentMode, setPaymentMode] = useState('cash');
    const [refNo, setRefNo] = useState('');
    const [remarks, setRemarks] = useState('');
    const [payingItems, setPayingItems] = useState<any>({}); // structureId -> {amount, waiver}

    const handleSearch = async () => {
        if (!searchQuery) return;
        setLoading(true);
        try {
            const res = await api.get('academic/students', { params: { search: searchQuery } });
            setStudents(res.data.data);
            setSelectedStudent(null);
        } catch (err) {
            console.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const fetchFeeStatus = async (studentId: string) => {
        setLoading(true);
        try {
            const res = await api.get('finance/student-status', {
                params: { studentId, academicYearId: '00000000-0000-0000-0000-000000000000' }
            });
            setFeeStatus(res.data.data);
            // Default paying items to full balance
            const initial: any = {};
            res.data.data.forEach((item: any) => {
                if (parseFloat(item.balance_amount) > 0) {
                    initial[item.structure_id] = { amount: item.balance_amount, waiver: 0 };
                }
            });
            setPayingItems(initial);
        } catch (err) {
            console.error('Failed to fetch fee status');
        } finally {
            setLoading(false);
        }
    };

    const handleCollect = async () => {
        const collections = Object.entries(payingItems)
            .filter(([_, data]: [string, any]) => parseFloat(data.amount) > 0)
            .map(([id, data]: [string, any]) => ({
                classFeeStructureId: id,
                amountPaid: parseFloat(data.amount),
                waiverAmount: parseFloat(data.waiver || 0)
            }));

        if (collections.length === 0) {
            alert('Please enter amount to pay');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('finance/collect', {
                studentId: selectedStudent.id,
                paymentMode,
                referenceNumber: refNo,
                remarks,
                collections
            });
            alert('Fees collected successfully');
            fetchFeeStatus(selectedStudent.id);
            setPayingItems({});
            setRefNo('');
            setRemarks('');
        } catch (err) {
            alert('Payment failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center text-gray-900">
                <div>
                    <h1 className="text-2xl font-bold">Fee Collection</h1>
                    <p className="text-gray-500">Search student and process fee payments.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="card p-6 bg-white shadow-sm border-none text-gray-900">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                className="input-field pl-10 py-3"
                                placeholder="Name, Roll or Code..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <button onClick={handleSearch} className="btn-primary w-full py-3 mb-6">Search Student</button>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                            {students.map(s => (
                                <div
                                    key={s.id}
                                    onClick={() => { setSelectedStudent(s); fetchFeeStatus(s.id); }}
                                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedStudent?.id === s.id ? 'border-primary-500 bg-primary-50' : 'border-gray-50 bg-gray-50 hover:border-primary-200'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold mr-3">
                                            {s.first_name[0]}{s.last_name[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{s.first_name} {s.last_name}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{s.admission_number || 'STU-001'} • CLASS {s.class_name}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    {selectedStudent ? (
                        <div className="space-y-6 text-gray-900">
                            {/* Summary Card */}
                            <div className="card bg-primary-600 text-white p-8 overflow-hidden relative shadow-2xl shadow-primary-200">
                                <DollarSign className="absolute -right-8 -top-8 text-white/10" size={200} />
                                <div className="relative z-10 flex justify-between items-center bg-white/5 backdrop-blur-sm p-6 mb-8 border border-white/10 rounded-2xl">
                                    <div className="flex items-center">
                                        <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center mr-4">
                                            <User size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">{selectedStudent.first_name} {selectedStudent.last_name}</h2>
                                            <p className="text-white/60 text-sm">{selectedStudent.class_name} - Section {selectedStudent.section_name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white/60 text-[10px] font-bold uppercase tracking-widest pl-1">Total Outstanding</div>
                                        <div className="text-3xl font-black">₹{feeStatus.reduce((acc, curr) => acc + parseFloat(curr.balance_amount), 0).toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="relative z-10 grid grid-cols-3 gap-6">
                                    <div className="bg-white/10 border border-white/5 p-4 rounded-3xl">
                                        <div className="text-white/60 text-[10px] font-bold uppercase mb-1">Total Fees</div>
                                        <div className="text-lg font-bold">₹{feeStatus.reduce((acc, curr) => acc + parseFloat(curr.total_amount), 0).toLocaleString()}</div>
                                    </div>
                                    <div className="bg-green-500/30 border border-green-400/20 p-4 rounded-3xl">
                                        <div className="text-white/60 text-[10px] font-bold uppercase mb-1">Paid Amount</div>
                                        <div className="text-lg font-bold">₹{feeStatus.reduce((acc, curr) => acc + parseFloat(curr.paid_amount), 0).toLocaleString()}</div>
                                    </div>
                                    <div className="bg-orange-500/30 border border-orange-400/20 p-4 rounded-3xl">
                                        <div className="text-white/60 text-[10px] font-bold uppercase mb-1">Total Waivers</div>
                                        <div className="text-lg font-bold">₹{feeStatus.reduce((acc, curr) => acc + parseFloat(curr.waiver_amount), 0).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Fee Items Table */}
                            <div className="card bg-white shadow-sm border-none overflow-hidden">
                                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="font-bold">Fee Breakdown</h3>
                                    <span className="text-xs font-medium text-gray-400 italic">Academic Year 2026-27</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left bg-white">
                                        <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                            <tr>
                                                <th className="px-6 py-4">Fee Head</th>
                                                <th className="px-6 py-4">Due Date</th>
                                                <th className="px-6 py-4">Balance</th>
                                                <th className="px-6 py-4">Amount to Pay</th>
                                                <th className="px-6 py-4">Waiver</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {feeStatus.map((item) => (
                                                <tr key={item.structure_id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-bold text-gray-800">{item.fee_name}</div>
                                                        <div className="text-[10px] text-gray-400 font-medium">Total: ₹{item.total_amount}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-bold text-gray-500">
                                                        {item.due_date ? new Date(item.due_date).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-sm font-black ${parseFloat(item.balance_amount) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                            ₹{parseFloat(item.balance_amount).toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="number"
                                                            className="w-24 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-primary-500 transition-all"
                                                            value={payingItems[item.structure_id]?.amount || 0}
                                                            onChange={(e) => {
                                                                const val = parseFloat(e.target.value) || 0;
                                                                setPayingItems({
                                                                    ...payingItems,
                                                                    [item.structure_id]: { ...payingItems[item.structure_id], amount: val }
                                                                });
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="number"
                                                            className="w-20 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-red-500 transition-all text-red-500"
                                                            value={payingItems[item.structure_id]?.waiver || 0}
                                                            onChange={(e) => {
                                                                const val = parseFloat(e.target.value) || 0;
                                                                setPayingItems({
                                                                    ...payingItems,
                                                                    [item.structure_id]: { ...payingItems[item.structure_id], waiver: val }
                                                                });
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Payment Section */}
                            <div className="card p-8 bg-gray-900 text-white border-none shadow-2xl">
                                <h3 className="text-lg font-bold mb-6 flex items-center">
                                    <CreditCard size={20} className="mr-2 text-primary-400" /> Payment Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Payment Mode</label>
                                            <div className="flex gap-2">
                                                {['cash', 'cheque', 'online', 'bank_transfer'].map(mode => (
                                                    <button
                                                        key={mode}
                                                        onClick={() => setPaymentMode(mode)}
                                                        className={`flex-1 py-3 text-[10px] font-bold uppercase rounded-2xl border-2 transition-all ${paymentMode === mode ? 'border-primary-500 bg-primary-500/10 text-primary-400 shadow-lg shadow-primary-500/20' : 'border-white/5 bg-white/5 text-gray-500 hover:border-white/10'
                                                            }`}
                                                    >
                                                        {mode.replace('_', ' ')}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Reference / Cheque No</label>
                                            <input
                                                type="text"
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-primary-500"
                                                value={refNo}
                                                onChange={(e) => setRefNo(e.target.value)}
                                                placeholder="Optional..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4 flex flex-col justify-between">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Remarks</label>
                                            <textarea
                                                className="w-full h-[110px] bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-primary-500"
                                                value={remarks}
                                                onChange={(e) => setRemarks(e.target.value)}
                                                placeholder="Additional info..."
                                            ></textarea>
                                        </div>
                                        <button
                                            onClick={handleCollect}
                                            disabled={submitting}
                                            className="btn-primary w-full py-5 text-lg shadow-2xl shadow-primary-500/30 flex items-center justify-center font-black uppercase tracking-tighter"
                                        >
                                            {submitting ? <Clock size={20} className="animate-spin mr-3" /> : <CheckCircle size={20} className="mr-3" />}
                                            Process Payment (₹{(Object.values(payingItems) as any[]).reduce((acc: any, curr: any) => acc + (parseFloat(curr.amount) || 0), 0).toLocaleString()})
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-20 card bg-white text-gray-900 shadow-sm border-none">
                            <div className="h-24 w-24 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mb-6">
                                <Search size={48} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">Search for a student</h3>
                            <p className="text-gray-400 mt-2 max-w-xs font-medium">Please enter a student name or admission number in the search box to view their fee history and process payments.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeeCollection;
