import React, { useState } from 'react';
import { UserPlus, Upload, FileText, CheckCircle } from 'lucide-react';

const OnlineAdmissionPortal: React.FC = () => {
    const [step, setStep] = useState(1);

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Online Admission Portal</h1>
                <p className="text-slate-500 font-medium mt-1">Public admission application form</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4">
                {[
                    { num: 1, label: 'Basic Info' },
                    { num: 2, label: 'Documents' },
                    { num: 3, label: 'Payment' },
                    { num: 4, label: 'Confirmation' },
                ].map((s) => (
                    <div key={s.num} className="flex items-center gap-4">
                        <div className={`flex items-center gap-3 ${step >= s.num ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black ${step >= s.num ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                {step > s.num ? <CheckCircle size={24} /> : s.num}
                            </div>
                            <span className="font-bold text-slate-900">{s.label}</span>
                        </div>
                        {s.num < 4 && <div className="w-12 h-1 bg-slate-200"></div>}
                    </div>
                ))}
            </div>

            {/* Form Content */}
            <div className="card-modern max-w-4xl mx-auto">
                <h3 className="text-2xl font-black text-slate-900 mb-6">Student Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Student Name *</label>
                        <input type="text" className="input-modern w-full" placeholder="Enter full name" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Date of Birth *</label>
                        <input type="date" className="input-modern w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Class Applying For *</label>
                        <select className="input-modern w-full">
                            <option>Select class...</option>
                            <option>Class 1</option>
                            <option>Class 2</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Parent Mobile *</label>
                        <input type="tel" className="input-modern w-full" placeholder="+91 XXXXX XXXXX" />
                    </div>
                </div>

                <div className="flex gap-4 mt-8">
                    <button className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200">
                        Previous
                    </button>
                    <button className="flex-1 btn-3d btn-3d-primary">
                        Next Step
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnlineAdmissionPortal;
