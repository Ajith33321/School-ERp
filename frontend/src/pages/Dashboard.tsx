import React from 'react';
import {
    Users,
    GraduationCap,
    Bus,
    Library,
    AlertCircle,
    TrendingUp
} from 'lucide-react';
import { cn } from '../utils/cn';

const Dashboard: React.FC = () => {
    const stats = [
        { label: 'Total Students', value: '1,284', icon: GraduationCap, color: 'blue', trend: '+12.5%', iconColor: 'text-blue-500', bgGradient: 'from-blue-500/10 to-transparent' },
        { label: 'Active Teachers', value: '86', icon: Users, color: 'emerald', trend: '+2.4%', iconColor: 'text-emerald-500', bgGradient: 'from-emerald-500/10 to-transparent' },
        { label: 'Library Books', value: '15,400', icon: Library, color: 'purple', trend: '+5.1%', iconColor: 'text-purple-500', bgGradient: 'from-purple-500/10 to-transparent' },
        { label: 'Active Routes', value: '24', icon: Bus, color: 'orange', trend: 'STABLE', iconColor: 'text-orange-500', bgGradient: 'from-orange-500/10 to-transparent' },
    ];

    const recentActivity = [
        { title: 'New Student Admission', time: '2 hours ago', user: 'Admin', type: 'admission' },
        { title: 'Fee Collection - Grade 4', time: '4 hours ago', user: 'Accountant', type: 'finance' },
        { title: 'Attendance Marked', time: '5 hours ago', user: 'Teacher Smith', type: 'attendance' },
        { title: 'Library Inventory Update', time: '1 day ago', user: 'Librarian', type: 'library' },
    ];

    return (
        <div className="space-y-10 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 font-medium mt-1">Welcome back! Here's a quick look at your school performance.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm active:scale-95">
                        Download Report
                    </button>
                    <button className="btn-3d btn-3d-primary">
                        <Users size={20} />
                        Add Student
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="card-modern group">
                        <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br ${stat.bgGradient} rounded-full blur-3xl opacity-50`}></div>

                        <div className="relative z-10">
                            <div className={cn(
                                "h-16 w-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl transform transition-transform duration-500 group-hover:rotate-[15deg] group-hover:scale-110",
                                "bg-white border-2 border-slate-50 animate-float"
                            )}>
                                <stat.icon size={32} className={stat.iconColor} />
                            </div>

                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <div className="flex items-end justify-between">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h2>
                                <div className={cn(
                                    "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter shadow-sm",
                                    stat.trend.includes('+') ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                                )}>
                                    {stat.trend.includes('+') && <TrendingUp size={12} />}
                                    {stat.trend}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 card-modern !p-0 overflow-hidden group">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white relative z-10">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 leading-none">Revenue vs Analytics</h3>
                            <p className="text-xs text-slate-500 mt-2 font-medium">Monthly performance comparison</p>
                        </div>
                        <div className="flex gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                            <button className="px-4 py-1.5 bg-white shadow-sm border border-slate-200 rounded-lg text-xs font-black text-blue-600">Weekly</button>
                            <button className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600">Monthly</button>
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="h-[320px] bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 group-hover:border-blue-200 transition-colors">
                            <TrendingUp size={48} className="mb-4 text-slate-300 transform transition-transform duration-1000 group-hover:scale-125" />
                            <span className="font-bold text-sm">Interactive Analytics Chart Ready</span>
                            <span className="text-[10px] uppercase font-black tracking-widest mt-2 opacity-50">Visualizing 1.2M Data Points</span>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card-modern !p-0 group">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-xl font-black text-slate-900">Activity Pulse</h3>
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                    </div>
                    <div className="p-8 space-y-8">
                        {recentActivity.map((activity, idx) => (
                            <div key={idx} className="flex gap-5 relative group/item hover:translate-x-1 transition-transform">
                                <div className="relative z-10">
                                    <div className="h-12 w-12 rounded-[18px] bg-white border-2 border-slate-50 shadow-sm flex items-center justify-center text-blue-500 group-hover/item:shadow-md transition-shadow">
                                        <AlertCircle size={22} className="group-hover/item:scale-110 transition-transform" />
                                    </div>
                                    {idx !== recentActivity.length - 1 && (
                                        <div className="absolute top-14 left-1/2 -ml-px h-10 w-0.5 bg-gradient-to-b from-slate-100 to-transparent"></div>
                                    )}
                                </div>
                                <div className="pt-1">
                                    <p className="text-sm font-black text-slate-900 tracking-tight">{activity.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest opacity-80">{activity.user}</span>
                                        <span className="text-[10px] text-slate-300 font-bold">•</span>
                                        <span className="text-[10px] text-slate-400 font-medium">{activity.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-4 text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-2 border-dashed border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all mt-4">
                            View Historical Pulse
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
