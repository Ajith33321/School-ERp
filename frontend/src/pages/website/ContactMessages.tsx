import React from 'react';
import { Mail, Inbox, Send, Archive, Trash2 } from 'lucide-react';

const ContactMessages: React.FC = () => {
    const messages = [
        { id: 1, from: 'John Doe', email: 'john@example.com', subject: 'Admission Inquiry', date: '2024-01-20', status: 'unread' },
        { id: 2, from: 'Jane Smith', email: 'jane@example.com', subject: 'Fee Payment Issue', date: '2024-01-19', status: 'read' },
        { id: 3, from: 'Bob Johnson', email: 'bob@example.com', subject: 'Transport Query', date: '2024-01-18', status: 'replied' },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Contact Messages</h1>
                <p className="text-slate-500 font-medium mt-1">Manage inquiries from website contact form</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    {[
                        { icon: Inbox, label: 'Inbox', count: 12 },
                        { icon: Send, label: 'Sent', count: 45 },
                        { icon: Archive, label: 'Archived', count: 89 },
                        { icon: Trash2, label: 'Trash', count: 3 },
                    ].map((item, idx) => (
                        <button key={idx} className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-all text-left">
                            <div className="flex items-center gap-3">
                                <item.icon size={20} className="text-slate-600" />
                                <span className="font-bold text-slate-900">{item.label}</span>
                            </div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs font-black">{item.count}</span>
                        </button>
                    ))}
                </div>

                {/* Messages List */}
                <div className="lg:col-span-3 card-modern">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Messages</h3>
                    <div className="space-y-2">
                        {messages.map((msg) => (
                            <div key={msg.id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all cursor-pointer">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h4 className="font-black text-slate-900">{msg.from}</h4>
                                        <p className="text-sm text-slate-500">{msg.email}</p>
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium">{msg.date}</span>
                                </div>
                                <p className="font-bold text-slate-700">{msg.subject}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactMessages;
