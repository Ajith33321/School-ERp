import React, { useState } from 'react';
import { Monitor, Plus, Play, Clock, Users } from 'lucide-react';
import { cn } from '../../utils/cn';

const OnlineExamination: React.FC = () => {
    const [activeTab, setActiveTab] = useState('upcoming');

    const exams = [
        { id: 1, title: 'Mathematics Mid-Term', class: 'Class 10', duration: '90 min', students: 45, date: '2024-01-25', status: 'upcoming' },
        { id: 2, title: 'Science Quiz', class: 'Class 9', duration: '30 min', students: 38, date: '2024-01-24', status: 'live' },
        { id: 3, title: 'English Grammar Test', class: 'Class 8', duration: '60 min', students: 42, date: '2024-01-20', status: 'completed' },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Online Examination</h1>
                    <p className="text-slate-500 font-medium mt-1">Create and manage online exams & quizzes</p>
                </div>
                <button className="btn-3d btn-3d-primary flex items-center gap-2">
                    <Plus size={20} />
                    Create Exam
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-slate-100 p-2 rounded-2xl w-fit">
                {['upcoming', 'live', 'completed'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "px-6 py-3 rounded-xl font-bold capitalize transition-all",
                            activeTab === tab ? "bg-white text-blue-600 shadow-lg" : "text-slate-600"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Exams List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.filter(e => e.status === activeTab).map((exam) => (
                    <div key={exam.id} className="card-modern">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                <Monitor className="text-white" size={28} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-black text-slate-900 mb-1">{exam.title}</h3>
                                <p className="text-sm text-slate-500 font-bold">{exam.class}</p>
                            </div>
                        </div>
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock size={16} className="text-slate-400" />
                                <span className="text-slate-600 font-medium">{exam.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Users size={16} className="text-slate-400" />
                                <span className="text-slate-600 font-medium">{exam.students} Students</span>
                            </div>
                        </div>
                        <button className="w-full btn-3d btn-3d-primary flex items-center justify-center gap-2">
                            <Play size={16} />
                            {exam.status === 'live' ? 'Monitor' : exam.status === 'completed' ? 'View Results' : 'Start Exam'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OnlineExamination;
