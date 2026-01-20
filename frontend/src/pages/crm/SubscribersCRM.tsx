import React, { useState } from 'react';
import { UserPlus, Phone, Mail, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '../../utils/cn';

const SubscribersCRM: React.FC = () => {
    const [activeTab, setActiveTab] = useState('new');

    const leads = [
        { id: 1, name: 'Parent Name 1', phone: '+91 98765 43210', email: 'parent1@email.com', status: 'new', source: 'Website', date: '2024-01-20' },
        { id: 2, name: 'Parent Name 2', phone: '+91 98765 43211', email: 'parent2@email.com', status: 'contacted', source: 'Referral', date: '2024-01-19' },
        { id: 3, name: 'Parent Name 3', phone: '+91 98765 43212', email: 'parent3@email.com', status: 'visit', source: 'Walk-in', date: '2024-01-18' },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Subscribers & CRM</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage admission inquiries and leads</p>
                </div>
                <button className="btn-3d btn-3d-primary flex items-center gap-2">
                    <UserPlus size={20} />
                    Add Lead
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Leads', value: '234', color: 'blue' },
                    { label: 'New', value: '45', color: 'green' },
                    { label: 'Contacted', value: '89', color: 'yellow' },
                    { label: 'Converted', value: '67', color: 'purple' },
                ].map((stat, idx) => (
                    <div key={idx} className="card-modern">
                        <p className="text-sm font-bold text-slate-500 uppercase mb-2">{stat.label}</p>
                        <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Leads Table */}
            <div className="card-modern">
                <h3 className="text-xl font-black text-slate-900 mb-6">Recent Inquiries</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="text-left py-4 px-4 text-sm font-black text-slate-700 uppercase">Name</th>
                                <th className="text-left py-4 px-4 text-sm font-black text-slate-700 uppercase">Contact</th>
                                <th className="text-left py-4 px-4 text-sm font-black text-slate-700 uppercase">Source</th>
                                <th className="text-left py-4 px-4 text-sm font-black text-slate-700 uppercase">Status</th>
                                <th className="text-right py-4 px-4 text-sm font-black text-slate-700 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead) => (
                                <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50">
                                    <td className="py-4 px-4 font-bold text-slate-900">{lead.name}</td>
                                    <td className="py-4 px-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone size={14} className="text-slate-400" />
                                                <span className="text-slate-600">{lead.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail size={14} className="text-slate-400" />
                                                <span className="text-slate-600">{lead.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-slate-600 font-medium">{lead.source}</td>
                                    <td className="py-4 px-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-black capitalize">
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100">
                                            Follow Up
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubscribersCRM;
