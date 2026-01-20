import React from 'react';
import { Smartphone, Bell, Lock, Palette } from 'lucide-react';

const AppSettings: React.FC = () => {
    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">App Settings</h1>
                <p className="text-slate-500 font-medium mt-1">Configure mobile app preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { title: 'Push Notifications', desc: 'Configure notification settings', icon: Bell, color: 'blue' },
                    { title: 'Security', desc: 'App security & privacy', icon: Lock, color: 'red' },
                    { title: 'Appearance', desc: 'Theme and display options', icon: Palette, color: 'purple' },
                    { title: 'App Version', desc: 'Update and version info', icon: Smartphone, color: 'green' },
                ].map((setting, idx) => (
                    <div key={idx} className="card-modern hover:shadow-2xl transition-all cursor-pointer">
                        <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${setting.color}-500 to-${setting.color}-600 flex items-center justify-center`}>
                                <setting.icon className="text-white" size={28} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-black text-slate-900 mb-1">{setting.title}</h3>
                                <p className="text-slate-600 font-medium">{setting.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card-modern">
                <h3 className="text-xl font-black text-slate-900 mb-6">App Information</h3>
                <div className="space-y-4">
                    {[
                        { label: 'App Version', value: '2.1.0' },
                        { label: 'Build Number', value: '245' },
                        { label: 'Last Updated', value: '2024-01-15' },
                        { label: 'Platform', value: 'iOS & Android' },
                    ].map((info, idx) => (
                        <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                            <span className="font-bold text-slate-700">{info.label}</span>
                            <span className="text-slate-900 font-black">{info.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AppSettings;
