import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Plus,
    CheckCircle2,
    Archive,
    Search,
    AlertTriangle,
    Clock
} from 'lucide-react';
import api from '../../services/api';

const AcademicSessions: React.FC = () => {
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        isCurrent: false
    });

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await api.get('settings/sessions');
            setSessions(res.data.data);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('settings/sessions', formData);
            setIsCreateModalOpen(false);
            fetchSessions();
        } catch (error) {
            console.error('Error creating session:', error);
        }
    };

    const handleSetCurrent = async (id: string) => {
        if (!confirm('Are you sure you want to change the current active academic session? All system dates will reflect this session.')) return;
        try {
            await api.patch(`settings/sessions/${id}/set-current`);
            fetchSessions();
        } catch (error) {
            console.error('Error updating current session:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Academic Sessions</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage school years and active sessions</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    New Session
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-3 text-center py-12 text-gray-400">Loading sessions...</div>
                ) : sessions.length > 0 ? (
                    sessions.map(session => (
                        <div key={session.id} className={`card p-6 border-2 transition-all ${session.is_current ? 'border-primary-500 bg-primary-50/30' : 'border-transparent hover:border-gray-200'
                            }`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-2xl bg-white shadow-sm text-primary-600">
                                    <Calendar size={20} />
                                </div>
                                {session.is_current ? (
                                    <span className="px-3 py-1 bg-primary-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg shadow-primary-200">Active Session</span>
                                ) : (
                                    <button
                                        onClick={() => handleSetCurrent(session.id)}
                                        className="text-[10px] font-bold text-gray-400 hover:text-primary-600 uppercase tracking-widest flex items-center gap-1 transition-colors"
                                    >
                                        <CheckCircle2 size={12} /> Mark as Active
                                    </button>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{session.name}</h3>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock size={14} className="text-gray-300" />
                                    <span>Starts: {new Date(session.start_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock size={14} className="text-gray-300" />
                                    <span>Ends: {new Date(session.end_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Session ID: {session.id.substring(0, 8)}</span>
                                <button className="text-gray-400 hover:text-red-600 transition-colors"><Archive size={16} /></button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 card p-20 flex flex-col items-center text-center">
                        <Calendar size={64} className="text-gray-100 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900">No Sessions Found</h3>
                        <p className="text-gray-500 text-sm mt-1">Initialize your first academic year to get started.</p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="mt-6 btn-primary"
                        >
                            Register First Session
                        </button>
                    </div>
                )}
            </div>

            {/* Create Session Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between font-bold text-gray-900">
                            <h3>Create New Academic Session</h3>
                            <button onClick={() => setIsCreateModalOpen(false)}>×</button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Session Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. 2024-25"
                                    className="input-field"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="input-field"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">End Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="input-field"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl">
                                <input
                                    type="checkbox"
                                    id="isCurrent"
                                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    checked={formData.isCurrent}
                                    onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                                />
                                <label htmlFor="isCurrent" className="text-sm font-medium text-gray-700">Set as current active session</label>
                            </div>
                            <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex gap-3 text-amber-800 text-xs">
                                <AlertTriangle size={18} className="shrink-0" />
                                <p>Changing current session will affect attendance records and fee calculations system-wide.</p>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Create Session</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AcademicSessions;
