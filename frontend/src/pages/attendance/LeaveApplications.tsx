import React, { useState, useEffect } from 'react';
import {
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    User,
    Search,
    Check,
    X,
    Plus
} from 'lucide-react';
import api from '../../services/api';

const LeaveApplications: React.FC = () => {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [remarks, setRemarks] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchPendingLeaves();
    }, []);

    const fetchPendingLeaves = async () => {
        try {
            setLoading(true);
            const res = await api.get('/attendance/students/leaves/pending');
            setApplications(res.data.data);
        } catch (err) {
            console.error('Failed to fetch pending leaves');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        setProcessing(true);
        try {
            await api.put(`/attendance/students/leaves/${id}/approve`, { status, remarks });
            setApplications(prev => prev.filter(app => app.id !== id));
            setSelectedApp(null);
            setRemarks('');
            alert(`Leave ${status} successfully`);
        } catch (err) {
            alert('Failed to process leave application');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center text-gray-900">
                <div>
                    <h1 className="text-2xl font-bold">Leave Applications</h1>
                    <p className="text-gray-500">Manage and approve student leave requests.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="card text-gray-900 bg-white">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-bold">Pending Applications ({applications.length})</h2>
                        </div>
                        <div className="divide-y divide-gray-50 overflow-y-auto max-h-[600px]">
                            {loading ? (
                                <div className="p-12 text-center text-gray-500">Loading...</div>
                            ) : applications.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">
                                    <FileText size={48} className="mx-auto mb-4 text-gray-200" />
                                    No pending leave applications.
                                </div>
                            ) : applications.map(app => (
                                <div
                                    key={app.id}
                                    onClick={() => setSelectedApp(app)}
                                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedApp?.id === app.id ? 'bg-primary-50/50 border-l-4 border-primary-500' : ''}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mr-3">
                                                {app.first_name[0]}{app.last_name[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{app.first_name} {app.last_name}</div>
                                                <div className="text-xs text-gray-500">{app.class_name} - {app.section_name}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-primary-600">{app.total_days} Days</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{app.leave_type}</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center text-xs text-gray-500">
                                        <Calendar size={14} className="mr-1 text-gray-400" />
                                        {new Date(app.from_date).toLocaleDateString()} to {new Date(app.to_date).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    {selectedApp ? (
                        <div className="card text-gray-900 bg-white sticky top-6">
                            <div className="p-4 border-b border-gray-100">
                                <h2 className="font-bold">Application Details</h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Reason for Leave</span>
                                        <p className="mt-1 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                                            "{selectedApp.reason || 'No reason provided'}"
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Applied Date</span>
                                            <div className="text-sm font-semibold">{new Date(selectedApp.applied_date).toLocaleDateString()}</div>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Leave Period</span>
                                            <div className="text-sm font-semibold text-primary-600">{selectedApp.total_days} Day(s)</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-gray-50">
                                    <label className="text-sm font-bold text-gray-700">Approval Remarks</label>
                                    <textarea
                                        className="input-field min-h-[100px]"
                                        placeholder="Add remarks for approval/rejection..."
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleAction(selectedApp.id, 'rejected')}
                                        disabled={processing}
                                        className="btn-danger flex items-center justify-center py-3"
                                    >
                                        <X size={18} className="mr-2" /> Reject
                                    </button>
                                    <button
                                        onClick={() => handleAction(selectedApp.id, 'approved')}
                                        disabled={processing}
                                        className="btn-success flex items-center justify-center py-3"
                                    >
                                        <Check size={18} className="mr-2" /> Approve
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card p-12 text-center text-gray-400 bg-white border-dashed border-2">
                            Select an application to view details and take action.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaveApplications;
