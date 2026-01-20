import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Plus,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    User,
    CalendarDays
} from 'lucide-react';
import api from '../../services/api';

const LeaveManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'my_leaves' | 'approvals'>('my_leaves');
    const [leaves, setLeaves] = useState<any[]>([]);
    const [approvals, setApprovals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        leaveTypeId: '',
        startDate: '',
        endDate: '',
        totalDays: 1,
        reason: ''
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'my_leaves') {
                const res = await api.get('staff/leaves');
                setLeaves(res.data.data);
            } else {
                const res = await api.get('staff/leaves?status=pending');
                setApprovals(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching leave data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('staff/leaves/apply', formData);
            setIsApplyModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error applying for leave:', error);
        }
    };

    const handleReview = async (applicationId: string, status: 'approved' | 'rejected') => {
        try {
            await api.patch(`staff/leaves/${applicationId}/review`, { status });
            fetchData();
        } catch (error) {
            console.error('Error reviewing leave:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Track attendance and manage time-off requests</p>
                </div>
                <button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    Apply for Leave
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card p-4 border-l-4 border-l-primary-500">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Casual Leaves</div>
                    <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-gray-900">8 / 12</span>
                        <span className="text-xs text-gray-400 italic mb-1">Available</span>
                    </div>
                </div>
                <div className="card p-4 border-l-4 border-l-amber-500">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Sick Leaves</div>
                    <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-gray-900">4 / 10</span>
                        <span className="text-xs text-gray-400 italic mb-1">Available</span>
                    </div>
                </div>
                <div className="card p-4 border-l-4 border-l-red-500">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Approvals</div>
                    <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-gray-900">2</span>
                        <Clock size={16} className="text-red-300 mb-1" />
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('my_leaves')}
                    className={`pb-4 px-2 text-sm font-bold transition-all ${activeTab === 'my_leaves' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    My Applications
                </button>
                <button
                    onClick={() => setActiveTab('approvals')}
                    className={`pb-4 px-2 text-sm font-bold transition-all ${activeTab === 'approvals' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    Review Requests
                </button>
            </div>

            {/* Content Area */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-[10px] tracking-widest">
                            <tr>
                                <th className="px-6 py-4">{activeTab === 'approvals' ? 'Staff Member' : 'Leave Type'}</th>
                                <th className="px-6 py-4">Dates</th>
                                <th className="px-6 py-4 text-center">Duration</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-12 text-center text-gray-400">Fetching leave records...</td></tr>
                            ) : (activeTab === 'my_leaves' ? leaves : approvals).length > 0 ? (
                                (activeTab === 'my_leaves' ? leaves : approvals).map(leave => (
                                    <tr key={leave.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            {activeTab === 'approvals' ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400"><User size={16} /></div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{leave.staff_name}</div>
                                                        <div className="text-[10px] text-gray-400 uppercase">{leave.leave_type_name}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="font-bold text-gray-900">{leave.leave_type_name}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays size={14} className="text-gray-300" />
                                                <span>{new Date(leave.start_date).toLocaleDateString()}</span>
                                                <span className="text-gray-300">→</span>
                                                <span>{new Date(leave.end_date).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-gray-700">{leave.total_days} Days</td>
                                        <td className="px-6 py-4 italic text-gray-400 max-w-xs truncate">{leave.reason}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${leave.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                leave.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {activeTab === 'approvals' ? (
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleReview(leave.id, 'approved')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"><CheckCircle2 size={16} /></button>
                                                    <button onClick={() => handleReview(leave.id, 'rejected')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"><XCircle size={16} /></button>
                                                </div>
                                            ) : (
                                                <button disabled className="text-xs text-gray-300 font-bold underline cursor-not-allowed">Edit</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-gray-400 italic font-medium">
                                        No leave requests found in this category.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Apply Leave Modal */}
            {isApplyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Request Time Off</h3>
                            <button onClick={() => setIsApplyModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
                        </div>
                        <form onSubmit={handleApply} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Leave Type *</label>
                                <select
                                    required
                                    className="input-field"
                                    value={formData.leaveTypeId}
                                    onChange={(e) => setFormData({ ...formData, leaveTypeId: e.target.value })}
                                >
                                    <option value="">Select Category</option>
                                    <option value="casual">Casual Leave</option>
                                    <option value="sick">Sick Leave</option>
                                    <option value="medical">Medical Leave</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Start Date *</label>
                                    <input
                                        type="date"
                                        required
                                        className="input-field"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">End Date *</label>
                                    <input
                                        type="date"
                                        required
                                        className="input-field"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Reason</label>
                                <textarea
                                    rows={3}
                                    className="input-field"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex gap-3 text-amber-800 text-xs leading-relaxed">
                                <AlertCircle size={18} className="shrink-0" />
                                <p>Approval depends on your department head's review. Quota will be deducted only after final approval.</p>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsApplyModalOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Submit Application</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveManagement;
