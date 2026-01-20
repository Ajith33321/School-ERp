import React from 'react';
import { Calendar, Plus } from 'lucide-react';

const AcademicYears: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center text-gray-900">
                <div>
                    <h1 className="text-2xl font-bold">Academic Years</h1>
                    <p className="text-gray-500">Manage academic sessions and terms.</p>
                </div>
                <button className="btn-primary flex items-center">
                    <Plus size={18} className="mr-2" /> Add Academic Year
                </button>
            </div>

            <div className="card p-8 text-center">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Calendar size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No Academic Years Yet</h3>
                <p className="text-gray-500 mt-2 mb-6 max-w-sm mx-auto">
                    Start by defining your first academic year (e.g., 2023-2024) and setting its start/end dates.
                </p>
                <button className="btn-primary">Set Up First Academic Year</button>
            </div>
        </div>
    );
};

export default AcademicYears;
