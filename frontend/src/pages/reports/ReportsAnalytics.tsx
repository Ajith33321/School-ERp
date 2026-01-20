import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Filter, Calendar } from 'lucide-react';
import { cn } from '../../utils/cn';

const ReportsAnalytics: React.FC = () => {
    const [selectedReport, setSelectedReport] = useState('overview');
    const [dateRange, setDateRange] = useState('this-month');

    const reportTypes = [
        { id: 'overview', name: 'Overview Dashboard', icon: BarChart3, color: 'blue' },
        { id: 'academic', name: 'Academic Performance', icon: TrendingUp, color: 'purple' },
        { id: 'financial', name: 'Financial Reports', icon: BarChart3, color: 'green' },
        { id: 'attendance', name: 'Attendance Reports', icon: Calendar, color: 'orange' },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Reports & Analytics</h1>
                    <p className="text-slate-500 font-medium mt-1">Comprehensive insights and data analysis</p>
                </div>
                <button className="btn-3d btn-3d-primary flex items-center gap-2">
                    <Download size={20} />
                    Export Report
                </button>
            </div>

            {/* Report Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {reportTypes.map((report) => (
                    <button
                        key={report.id}
                        onClick={() => setSelectedReport(report.id)}
                        className={cn(
                            "card-modern text-left transition-all",
                            selectedReport === report.id && "ring-2 ring-blue-500"
                        )}
                    >
                        <report.icon size={32} className={`text-${report.color}-500 mb-3`} />
                        <h3 className="font-black text-slate-900">{report.name}</h3>
                    </button>
                ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Students', value: '1,284', change: '+12.5%', positive: true },
                    { label: 'Revenue', value: '₹12.5L', change: '+8.2%', positive: true },
                    { label: 'Attendance', value: '94.2%', change: '+2.1%', positive: true },
                    { label: 'Pending Fees', value: '₹2.3L', change: '-5.4%', positive: false },
                ].map((stat, idx) => (
                    <div key={idx} className="card-modern">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{stat.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 mb-2">{stat.value}</h3>
                        <span className={cn(
                            "text-sm font-bold",
                            stat.positive ? "text-green-600" : "text-red-600"
                        )}>
                            {stat.change}
                        </span>
                    </div>
                ))}
            </div>

            {/* Chart Placeholder */}
            <div className="card-modern">
                <h3 className="text-xl font-black text-slate-900 mb-6">Performance Trends</h3>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                        <BarChart3 size={64} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500 font-medium">Interactive charts will be displayed here</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsAnalytics;
