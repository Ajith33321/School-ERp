import React from 'react';
import { Globe, Edit, Eye, Settings as SettingsIcon } from 'lucide-react';

const WebsiteSetup: React.FC = () => {
    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Website Setup</h1>
                <p className="text-slate-500 font-medium mt-1">Manage your school's public website</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Home Page', icon: Globe, desc: 'Edit homepage content', color: 'blue' },
                    { title: 'About Us', icon: Edit, desc: 'School information', color: 'purple' },
                    { title: 'Admissions', icon: SettingsIcon, desc: 'Admission details', color: 'green' },
                    { title: 'Academics', icon: Edit, desc: 'Academic programs', color: 'orange' },
                    { title: 'Facilities', icon: Globe, desc: 'School facilities', color: 'pink' },
                    { title: 'Contact', icon: SettingsIcon, desc: 'Contact information', color: 'cyan' },
                ].map((page, idx) => (
                    <div key={idx} className="card-modern hover:shadow-2xl transition-all cursor-pointer">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${page.color}-500 to-${page.color}-600 flex items-center justify-center mb-4`}>
                            <page.icon className="text-white" size={28} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-2">{page.title}</h3>
                        <p className="text-slate-600 font-medium mb-4">{page.desc}</p>
                        <div className="flex gap-2">
                            <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100">
                                <Edit size={16} className="inline mr-2" />
                                Edit
                            </button>
                            <button className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl font-bold hover:bg-slate-100">
                                <Eye size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WebsiteSetup;
