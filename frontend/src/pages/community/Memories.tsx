import React from 'react';
import { Camera, Heart, BookOpen, Upload } from 'lucide-react';

const Memories: React.FC = () => {
    const years = [
        { year: '2023-24', students: 234, events: 45, photos: 567 },
        { year: '2022-23', students: 221, events: 42, photos: 489 },
        { year: '2021-22', students: 198, events: 38, photos: 412 },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Memories & Yearbook</h1>
                    <p className="text-slate-500 font-medium mt-1">Create and manage school yearbooks</p>
                </div>
                <button className="btn-3d btn-3d-primary flex items-center gap-2">
                    <Upload size={20} />
                    Create Yearbook
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {years.map((year, idx) => (
                    <div key={idx} className="card-modern hover:shadow-2xl transition-all">
                        <div className="aspect-[3/4] bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4">
                            <div className="text-center">
                                <BookOpen size={64} className="mx-auto text-purple-400 mb-4" />
                                <h3 className="text-3xl font-black text-slate-900">{year.year}</h3>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600 font-medium">Students</span>
                                <span className="font-black text-slate-900">{year.students}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600 font-medium">Events</span>
                                <span className="font-black text-slate-900">{year.events}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600 font-medium">Photos</span>
                                <span className="font-black text-slate-900">{year.photos}</span>
                            </div>
                        </div>
                        <button className="mt-4 w-full btn-3d btn-3d-primary">
                            View Yearbook
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Memories;
