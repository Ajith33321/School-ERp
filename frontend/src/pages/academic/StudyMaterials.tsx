import React, { useState } from 'react';
import { BookMarked, Upload, Download, FolderOpen, FileText, Video, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

const StudyMaterials: React.FC = () => {
    const [activeTab, setActiveTab] = useState('all');

    const materials = [
        { id: 1, title: 'Mathematics Chapter 5', type: 'pdf', class: 'Class 10', subject: 'Mathematics', size: '2.4 MB', downloads: 45 },
        { id: 2, title: 'Science Lab Video', type: 'video', class: 'Class 9', subject: 'Science', size: '15.2 MB', downloads: 32 },
        { id: 3, title: 'English Grammar Notes', type: 'pdf', class: 'Class 8', subject: 'English', size: '1.8 MB', downloads: 67 },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Study Materials</h1>
                    <p className="text-slate-500 font-medium mt-1">Digital learning resources for students</p>
                </div>
                <button className="btn-3d btn-3d-primary flex items-center gap-2">
                    <Upload size={20} />
                    Upload Material
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 bg-slate-100 p-2 rounded-2xl w-fit">
                {['all', 'pdf', 'video', 'image'].map((tab) => (
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

            {/* Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((material) => (
                    <div key={material.id} className="card-modern group">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                {material.type === 'pdf' ? <FileText className="text-white" size={24} /> : <Video className="text-white" size={24} />}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-black text-slate-900 mb-1">{material.title}</h3>
                                <p className="text-xs text-slate-500 font-bold">{material.class} • {material.subject}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 font-medium">{material.size}</span>
                            <span className="text-blue-600 font-bold">{material.downloads} downloads</span>
                        </div>
                        <button className="mt-4 w-full btn-3d btn-3d-primary flex items-center justify-center gap-2">
                            <Download size={16} />
                            Download
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudyMaterials;
