import React, { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    Calendar,
    BookOpen,
    User,
    MoreVertical,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';

const Homework: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const homeworks = [
        {
            id: 1,
            title: 'Algebraic Expressions Practice',
            class: 'Grade 8-A',
            subject: 'Mathematics',
            assignedBy: 'Dr. Sarah Wilson',
            assignedDate: '2026-01-18',
            dueDate: '2026-01-20',
            status: 'Active',
            submissions: '24/30'
        },
        {
            id: 2,
            title: 'The Industrial Revolution Essay',
            class: 'Grade 10-C',
            subject: 'History',
            assignedBy: 'Mr. James Miller',
            assignedDate: '2026-01-17',
            dueDate: '2026-01-21',
            status: 'Active',
            submissions: '15/35'
        },
        {
            id: 3,
            title: 'Photosynthesis Lab Report',
            class: 'Grade 9-B',
            subject: 'Biology',
            assignedBy: 'Ms. Emily Chen',
            assignedDate: '2026-01-15',
            dueDate: '2026-01-17',
            status: 'Closed',
            submissions: '28/28'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Homework Management</h1>
                    <p className="text-gray-500 mt-1">Assign, track, and review student homework.</p>
                </div>
                <button className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-primary-200">
                    <Plus size={18} />
                    <span>Create Assignment</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Assigned</p>
                        <h3 className="text-xl font-bold text-gray-900">128</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Completed</p>
                        <h3 className="text-xl font-bold text-gray-900">92</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Pending Review</p>
                        <h3 className="text-xl font-bold text-gray-900">36</h3>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search assignments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600">
                        <Calendar size={18} />
                        <span>Date Range</span>
                    </button>
                </div>
            </div>

            {/* Homework Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {homeworks.map((hw) => (
                    <div key={hw.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                        <div className="p-5 border-b border-gray-50">
                            <div className="flex justify-between items-start mb-3">
                                <span className={hw.status === 'Active' ? 'px-2 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-lg uppercase' : 'px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg uppercase'}>
                                    {hw.status}
                                </span>
                                <button className="p-1 hover:bg-gray-100 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                            <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight mb-2">
                                {hw.title}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium">{hw.class}</span>
                                <span>•</span>
                                <span className="font-medium text-primary-600">{hw.subject}</span>
                            </div>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center text-gray-500">
                                    <User size={14} className="mr-2" />
                                    <span>{hw.assignedBy}</span>
                                </div>
                                <div className="text-gray-900 font-semibold">{hw.submissions}</div>
                            </div>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-primary-600 h-full transition-all duration-1000"
                                    style={{ width: `${(parseInt(hw.submissions.split('/')[0]) / parseInt(hw.submissions.split('/')[1])) * 100}%` }}
                                ></div>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-4">
                                <div className="flex items-center text-xs text-gray-500">
                                    <Clock size={12} className="mr-1" />
                                    <span>Due: {hw.dueDate}</span>
                                </div>
                                <button className="text-sm font-bold text-primary-600 hover:text-primary-700">View Details</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Homework;
