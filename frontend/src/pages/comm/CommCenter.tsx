import React, { useState, useEffect } from 'react';
import {
    Send,
    MessageSquare,
    Mail,
    Users,
    History,
    FileText,
    Plus,
    CheckCircle2,
    Clock
} from 'lucide-react';
import api from '../../services/api';

const CommCenter: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'broadcast' | 'templates' | 'logs'>('broadcast');
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [broadcastData, setBroadcastData] = useState({
        recipientType: 'all_students',
        channel: 'email',
        subject: '',
        content: '',
        recipients: []
    });

    useEffect(() => {
        if (activeTab === 'logs') fetchLogs();
    }, [activeTab]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await api.get('comm/logs');
            setLogs(res.data.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('comm/broadcast', broadcastData);
            alert('Broadcast queued successfully!');
            setBroadcastData({
                recipientType: 'all_students',
                channel: 'email',
                subject: '',
                content: '',
                recipients: []
            });
        } catch (error) {
            console.error('Error sending broadcast:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Communication Center</h1>
                    <p className="text-gray-500 text-sm mt-1">Send bulk announcements via Email & SMS</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('broadcast')}
                    className={`pb-4 px-2 text-sm font-bold transition-all ${activeTab === 'broadcast' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Send size={16} /> New Broadcast
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('templates')}
                    className={`pb-4 px-2 text-sm font-bold transition-all ${activeTab === 'templates' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <FileText size={16} /> Templates
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('logs')}
                    className={`pb-4 px-2 text-sm font-bold transition-all ${activeTab === 'logs' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <History size={16} /> Message Logs
                    </div>
                </button>
            </div>

            {activeTab === 'broadcast' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 card p-8">
                        <form onSubmit={handleSend} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Recipient Group</label>
                                    <select
                                        className="input-field"
                                        value={broadcastData.recipientType}
                                        onChange={(e) => setBroadcastData({ ...broadcastData, recipientType: e.target.value })}
                                    >
                                        <option value="all_students">All Students</option>
                                        <option value="all_parents">All Parents</option>
                                        <option value="all_staff">All Staff</option>
                                        <option value="class_wise">Specific Class</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Channel</label>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setBroadcastData({ ...broadcastData, channel: 'email' })}
                                            className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${broadcastData.channel === 'email' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Mail size={18} /> Email
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setBroadcastData({ ...broadcastData, channel: 'sms' })}
                                            className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${broadcastData.channel === 'sms' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <MessageSquare size={18} /> SMS
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {broadcastData.channel === 'email' && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter email subject..."
                                        className="input-field"
                                        value={broadcastData.subject}
                                        onChange={(e) => setBroadcastData({ ...broadcastData, subject: e.target.value })}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Message Content</label>
                                <textarea
                                    rows={8}
                                    required
                                    placeholder="Type your message here..."
                                    className="input-field resize-none p-4"
                                    value={broadcastData.content}
                                    onChange={(e) => setBroadcastData({ ...broadcastData, content: e.target.value })}
                                ></textarea>
                                <p className="text-[10px] text-gray-400 mt-2 italic">
                                    You can use placeholders like {"student_name"}, {"admission_no"} in your message.
                                </p>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <button type="submit" className="btn-primary flex items-center gap-2 px-8 py-3">
                                    <Send size={18} /> Send Broadcast
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-6">
                        <div className="card p-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-xl shadow-primary-200">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Users size={20} className="text-primary-100" /> Targeted Audience
                            </h3>
                            <div className="space-y-4">
                                <div className="bg-white/10 rounded-lg p-3">
                                    <div className="text-[10px] uppercase font-bold text-primary-200 tracking-wider mb-1">Total Recipients</div>
                                    <div className="text-2xl font-bold">1,240</div>
                                </div>
                                <div className="text-xs text-primary-100 leading-relaxed italic border-l-2 border-primary-400 pl-3">
                                    Messages will be sent to primary email addresses and mobile numbers registered in the student profile.
                                </div>
                            </div>
                        </div>

                        <div className="card p-6 border-amber-100 bg-amber-50/30">
                            <h4 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
                                <FileText size={16} /> Quick Tips
                            </h4>
                            <ul className="text-xs text-amber-700 space-y-2 list-disc pl-4">
                                <li>Email broadcasts are unlimited.</li>
                                <li>SMS delivery depends on your gateway balance.</li>
                                <li>Check message logs to track delivery status.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'logs' && (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-[10px] tracking-widest border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Channel</th>
                                    <th className="px-6 py-4">Subject / Snippet</th>
                                    <th className="px-6 py-4">Recipients</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan={5} className="p-12 text-center text-gray-400">Loading history...</td></tr>
                                ) : logs.length > 0 ? (
                                    logs.map(log => (
                                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`flex items-center gap-2 font-medium capitalize ${log.channel === 'email' ? 'text-blue-600' : 'text-green-600'}`}>
                                                    {log.channel === 'email' ? <Mail size={14} /> : <MessageSquare size={14} />}
                                                    {log.channel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900 truncate max-w-xs">{log.subject || 'N/A'}</div>
                                                <div className="text-xs text-gray-400 truncate max-w-xs">{log.content}</div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-700">{log.recipient_count} persons</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    <span className="px-2 py-1 rounded bg-green-50 text-green-700 text-[10px] font-bold flex items-center gap-1">
                                                        <CheckCircle2 size={10} /> {log.status?.toUpperCase()}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-gray-500 italic">
                                            No message history available. Start a new broadcast to see records here.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'templates' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button className="h-48 flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-primary-500 hover:text-primary-600 transition-all group">
                        <div className="p-4 rounded-full bg-gray-50 group-hover:bg-primary-50"><Plus size={32} /></div>
                        <span className="font-bold">Create New Template</span>
                    </button>
                    {/* Placeholder Templates */}
                    <div className="card p-6 border-l-4 border-l-primary-500">
                        <h4 className="font-bold text-gray-900 mb-2">Admission Confirmation</h4>
                        <p className="text-xs text-gray-500 line-clamp-3 mb-4">
                            Dear parents, We are delighted to inform you that {"{{ student_name }}"}'s admission has been confirmed...
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <span className="text-[10px] font-bold text-primary-600 uppercase">Email Template</span>
                            <button className="text-xs text-gray-400 hover:text-gray-600 font-bold underline">Edit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommCenter;
