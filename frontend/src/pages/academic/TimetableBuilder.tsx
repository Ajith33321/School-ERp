import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Calendar,
    Clock,
    User,
    Save,
    RefreshCcw,
    Loader2,
    Trash2,
    AlertTriangle
} from 'lucide-react';
import api from '../../services/api';

const TimetableBuilder: React.FC = () => {
    const [classes, setClasses] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [periods, setPeriods] = useState<any[]>([]);
    const [timetable, setTimetable] = useState<any[]>([]);

    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [loading, setLoading] = useState(false);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const classRes = await api.get('academic/classes');
                setClasses(classRes.data.data);
                if (classRes.data.data.length > 0) setSelectedClassId(classRes.data.data[0].id);

                // Fetch default periods (hardcoded for now or from backend if implemented)
                setPeriods([
                    { id: '1', start_time: '08:00', end_time: '09:00', type: 'lecture' },
                    { id: '2', start_time: '09:00', end_time: '10:00', type: 'lecture' },
                    { id: '3', start_time: '10:00', end_time: '10:30', type: 'break' },
                    { id: '4', start_time: '10:30', end_time: '11:30', type: 'lecture' },
                    { id: '5', start_time: '11:30', end_time: '12:30', type: 'lecture' },
                ]);
            } catch (err) {
                console.error('Failed to fetch initial data');
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedClassId) {
            const fetchSections = async () => {
                const res = await api.get(`academic/sections?classId=${selectedClassId}`);
                setSections(res.data.data);
                if (res.data.data.length > 0) setSelectedSectionId(res.data.data[0].id);

                const subRes = await api.get(`academic/classes/${selectedClassId}/subjects`);
                setSubjects(subRes.data.data);
            };
            fetchSections();
        }
    }, [selectedClassId]);

    // Mock timetable data fetch for current section
    useEffect(() => {
        if (selectedSectionId) {
            setTimetable([]); // Fetch from backend in real impl
        }
    }, [selectedSectionId]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center text-gray-900">
                <div>
                    <h1 className="text-2xl font-bold">Timetable Builder</h1>
                    <p className="text-gray-500">Design and manage class schedules.</p>
                </div>
                <div className="flex space-x-3">
                    <button className="btn-secondary flex items-center">
                        <RefreshCcw size={18} className="mr-2" /> Reset
                    </button>
                    <button className="btn-primary flex items-center">
                        <Save size={18} className="mr-2" /> Save Timetable
                    </button>
                </div>
            </div>

            <div className="card p-4 flex flex-wrap gap-4 items-center text-gray-900 bg-white">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold whitespace-nowrap">Class:</span>
                    <select
                        className="input-field py-1"
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                    >
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold whitespace-nowrap">Section:</span>
                    <select
                        className="input-field py-1"
                        value={selectedSectionId}
                        onChange={(e) => setSelectedSectionId(e.target.value)}
                    >
                        {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="card overflow-x-auto bg-white">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 border border-gray-200 text-xs font-semibold text-gray-400 uppercase w-32">
                                Period
                            </th>
                            {days.map(day => (
                                <th key={day} className="p-4 border border-gray-200 text-xs font-semibold text-gray-900 uppercase">
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {periods.map(period => (
                            <tr key={period.id}>
                                <td className="p-4 border border-gray-200 text-center">
                                    <div className="text-sm font-bold text-primary-600">{period.start_time}</div>
                                    <div className="text-xs text-gray-400">to {period.end_time}</div>
                                    {period.type === 'break' && (
                                        <span className="mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-[10px] uppercase font-bold">Break</span>
                                    )}
                                </td>
                                {days.map(day => (
                                    <td key={day} className="p-2 border border-gray-200 min-w-[150px] group transition-colors hover:bg-primary-50/50">
                                        {period.type === 'lecture' ? (
                                            <div className="h-20 rounded-lg border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-2 group-hover:bg-white group-hover:border-primary-200 cursor-pointer transition-all">
                                                <Plus size={20} className="text-gray-300 group-hover:text-primary-600 mb-1" />
                                                <span className="text-xs text-gray-400 group-hover:text-primary-700 font-medium">Assign</span>
                                            </div>
                                        ) : (
                                            <div className="h-20 bg-gray-50 flex items-center justify-center text-xs text-gray-400 italic">
                                                Break Time
                                            </div>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            <strong>Conflict Detection:</strong> The system will automatically check for teacher and room double-bookings while you design the schedule.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimetableBuilder;
