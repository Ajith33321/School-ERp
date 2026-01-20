import React, { useState, useEffect } from 'react';
import {
    Users,
    Calendar as CalendarIcon,
    CheckCircle2,
    XCircle,
    Clock,
    Save,
    Search,
    Filter,
    Check,
    AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const AttendanceMarking: React.FC = () => {
    const [classes, setClasses] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            const res = await api.get('/academic/classes');
            setClasses(res.data.data);
            if (res.data.data.length > 0) setSelectedClassId(res.data.data[0].id);
        };
        fetchClasses();
    }, []);

    useEffect(() => {
        if (selectedClassId) {
            const fetchSections = async () => {
                const res = await api.get(`/academic/sections?classId=${selectedClassId}`);
                setSections(res.data.data);
                if (res.data.data.length > 0) setSelectedSectionId(res.data.data[0].id);
            };
            fetchSections();
        }
    }, [selectedClassId]);

    const fetchStudents = async () => {
        if (!selectedClassId || !selectedSectionId || !attendanceDate) return;
        setLoading(true);
        try {
            const res = await api.get('/attendance/students', {
                params: { classId: selectedClassId, sectionId: selectedSectionId, date: attendanceDate }
            });
            // Map students and ensure they have a default status if none exists
            const mappedStudents = res.data.data.map((s: any) => ({
                ...s,
                status: s.current_status || 'present',
                remarks: s.current_remarks || ''
            }));
            setStudents(mappedStudents);
        } catch (err) {
            console.error('Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (studentId: string, status: string) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
    };

    const handleMarkAll = (status: string) => {
        setStudents(prev => prev.map(s => ({ ...s, status })));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const attendanceData = students.map(s => ({
                studentId: s.id,
                status: s.status,
                remarks: s.remarks
            }));
            await api.post('/attendance/students/mark', {
                classId: selectedClassId,
                sectionId: selectedSectionId,
                date: attendanceDate,
                attendanceData,
                academicYearId: '00000000-0000-0000-0000-000000000000' // Mock for now
            });
            alert('Attendance saved successfully');
        } catch (err) {
            alert('Failed to save attendance');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center text-gray-900">
                <div>
                    <h1 className="text-2xl font-bold">Student Attendance</h1>
                    <p className="text-gray-500">Mark daily attendance for students.</p>
                </div>
            </div>

            <div className="card p-4 flex flex-wrap gap-4 items-end bg-white text-gray-900">
                <div className="flex flex-col space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Attendance Date</label>
                    <input
                        type="date"
                        className="input-field py-2"
                        value={attendanceDate}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setAttendanceDate(e.target.value)}
                    />
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Class</label>
                    <select
                        className="input-field py-2"
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                    >
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Section</label>
                    <select
                        className="input-field py-2"
                        value={selectedSectionId}
                        onChange={(e) => setSelectedSectionId(e.target.value)}
                    >
                        {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <button
                    onClick={fetchStudents}
                    disabled={loading}
                    className="btn-primary"
                >
                    {loading ? 'Loading...' : 'Fetch Students'}
                </button>
            </div>

            {students.length > 0 && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <div className="flex space-x-2">
                            <button onClick={() => handleMarkAll('present')} className="px-3 py-1 text-xs font-bold bg-green-50 text-green-700 rounded-full border border-green-200 hover:bg-green-100">
                                Mark All Present
                            </button>
                            <button onClick={() => handleMarkAll('absent')} className="px-3 py-1 text-xs font-bold bg-red-50 text-red-700 rounded-full border border-red-200 hover:bg-red-100">
                                Mark All Absent
                            </button>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-primary flex items-center"
                        >
                            {saving ? <Clock size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                            Save Attendance
                        </button>
                    </div>

                    <div className="card overflow-hidden bg-white text-gray-900">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Roll No</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance Status</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-gray-400">
                                            #{student.roll_number || 'NA'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs mr-3">
                                                    {student.first_name[0]}{student.last_name[0]}
                                                </div>
                                                <div className="text-sm font-semibold">{student.first_name} {student.last_name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-1">
                                                {[
                                                    { id: 'present', label: 'P', color: 'bg-green-50 text-green-600 border-green-200', active: 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-100' },
                                                    { id: 'absent', label: 'A', color: 'bg-red-50 text-red-600 border-red-200', active: 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-100' },
                                                    { id: 'late', label: 'L', color: 'bg-orange-50 text-orange-600 border-orange-200', active: 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-100' },
                                                    { id: 'half_day', label: 'H', color: 'bg-yellow-50 text-yellow-600 border-yellow-200', active: 'bg-yellow-600 text-white border-yellow-600 shadow-lg shadow-yellow-100' }
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => handleStatusChange(student.id, opt.id)}
                                                        className={cn(
                                                            "w-8 h-8 rounded-lg border font-bold text-xs flex items-center justify-center transition-all duration-200",
                                                            student.status === opt.id ? opt.active : opt.color
                                                        )}
                                                        title={opt.id.charAt(0).toUpperCase() + opt.id.slice(1)}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                placeholder="Reason for absence..."
                                                className="text-xs bg-gray-50 border-none rounded-lg focus:ring-1 focus:ring-primary-500 w-full"
                                                value={student.remarks}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setStudents(prev => prev.map(s => s.id === student.id ? { ...s, remarks: val } : s));
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!loading && students.length === 0 && selectedSectionId && (
                <div className="card p-12 flex flex-col items-center justify-center text-center bg-white">
                    <Users size={48} className="text-gray-200 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">No Students Found</h3>
                    <p className="text-gray-500 max-w-xs">There are no students enrolled in this section yet. Please enroll students before marking attendance.</p>
                </div>
            )}
        </div>
    );
};

export default AttendanceMarking;
