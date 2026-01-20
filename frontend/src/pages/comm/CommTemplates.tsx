import React, { useState } from 'react';
import {
    Plus,
    Search,
    MessageSquare,
    Mail,
    Smartphone,
    MoreVertical,
    CheckCircle2,
    Copy,
    Edit3
} from 'lucide-react';

const CommTemplates: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const templates = [
        {
            id: 1,
            name: 'Admission Welcome',
            type: 'Email',
            category: 'Admission',
            lastUsed: '2026-01-15',
            status: 'Active'
        },
        {
            id: 2,
            name: 'Fee Due Reminder',
            type: 'SMS',
            category: 'Finance',
            lastUsed: '2026-01-18',
            status: 'Active'
        },
        {
            id: 3,
            name: 'Holiday Announcement',
            type: 'Broadcast',
            category: 'General',
            lastUsed: '2026-01-01',
            status: 'Draft'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Communication Templates</h1>
                    <p className="text-gray-500 mt-1">Manage reusable message templates for notifications.</p>
                </div>
                <button className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-primary-200">
                    <Plus size={18} />
                    <span>Create Template</span>
                </button>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((tpl) => (
                    <div key={tpl.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${tpl.type === 'Email' ? 'bg-blue-50 text-blue-600' :
                                    tpl.type === 'SMS' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'
                                }`}>
                                {tpl.type === 'Email' ? <Mail size={24} /> :
                                    tpl.type === 'SMS' ? <Smartphone size={24} /> : <MessageSquare size={24} />}
                            </div>
                            <button className="p-1 hover:bg-gray-100 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        <div className="space-y-1 mb-4">
                            <h3 className="text-lg font-bold text-gray-900">{tpl.name}</h3>
                            <p className="text-gray-500 text-sm">{tpl.category} • {tpl.type}</p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${tpl.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                                }`}>
                                {tpl.status}
                            </span>
                            <div className="flex space-x-2">
                                <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                    <Copy size={16} />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                    <Edit3 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommTemplates;
