import React, { useState, useEffect } from 'react';
import {
    ClipboardList,
    Save,
    Search,
    User,
    CheckCircle,
    Clock,
    AlertCircle,
    ArrowLeft
} from 'lucide-react';
import { cn } from '../../utils/cn';
import api from '../../services/api';

const MarkEntry: React.FC = () => {
    const [exams, setExams] = useState<any[]>([]);
    const [schedules, setSchedules] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [selectedExamId, setSelectedExamId] = useState('');
    const [selectedScheduleId, setSelectedScheduleId] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [scheduleInfo, setScheduleInfo] = useState<any>(null);

    useEffect(() => {
        const fetchExams = async () => {
            const res = await api.get('/exams', { params: { academicYearId: '00000000-0000-0000-0000-000000000000' } });
            setExams(res.data.data);
        };
        fetchExams();
    }, []);

    useEffect(() => {
        if (selectedExamId) {
            const fetchSchedules = async () => {
                const res = await api.get('/exams/schedules', { params: { examId: selectedExamId } });
                setSchedules(res.data.data);
            };
            fetchSchedules();
        }
    }, [selectedExamId]);

    const fetchMarksData = async () => {
        if (!selectedScheduleId) return;
        setLoading(true);
        try {
            const res = await api.get(`/exams/schedules/${selectedScheduleId}/marks`);
            setScheduleInfo(res.data.data.schedule);
            setStudents(res.data.data.students.map((s: any) => ({
                ...s,
                marks_obtained: s.marks_obtained || 0,
                is_absent: s.is_absent || false,
                remarks: s.remarks || ''
            })));
        } catch (err) {
            console.error('Failed to fetch marks data');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkChange = (studentId: string, value: string) => {
        const marks = parseFloat(value);
        if (isNaN(marks) && value !== '') return;
        if (marks > (scheduleInfo?.max_marks || 100)) return;

        setStudents(prev => prev.map(s => s.student_id === studentId ? { ...s, marks_obtained: value } : s));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const marksData = students.map(s => ({
                studentId: s.student_id,
                marksObtained: s.marks_obtained,
                isAbsent: s.is_absent,
                remarks: s.remarks
            }));
            await api.post(`/exams/schedules/${selectedScheduleId}/marks`, { marksData });
            alert('Marks saved as draft');
        } catch (err) {
            alert('Failed to save marks');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center text-gray-900">
                <div>
                    <h1 className="text-2xl font-bold">Mark Entry</h1>
                    <p className="text-gray-500">Enter and verify student marks for examinations.</p>
                </div>
            </div>

            <div className="card p-4 flex flex-wrap gap-4 items-end bg-white text-gray-900 border-none">
                <div className="flex flex-col space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Examination</label>
                    <select
                        className="input-field py-3 min-w-[200px]"
                        value={selectedExamId}
                        onChange={(e) => setSelectedExamId(e.target.value)}
                    >
                        <option value="">Select Exam</option>
                        {exams.map(e => <option key={e.id} value={e.id}>{e.exam_name}</option>)}
                    </select>
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Subject / Paper</label>
                    <select
                        className="input-field py-3 min-w-[250px]"
                        value={selectedScheduleId}
                        onChange={(e) => setSelectedScheduleId(e.target.value)}
                        disabled={!selectedExamId}
                    >
                        <option value="">Select Subject</option>
                        {schedules.map(s => <option key={s.id} value={s.id}>{s.subject_name} ({s.exam_date})</option>)}
                    </select>
                </div>
                <button
                    onClick={fetchMarksData}
                    disabled={!selectedScheduleId || loading}
                    className="btn-primary py-3"
                >
                    {loading ? 'Loading...' : 'Fetch Students'}
                </button>
            </div>

            {students.length > 0 && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-primary-50 p-4 rounded-2xl border border-primary-100">
                        <div className="flex items-center space-x-6">
                            <div>
                                <div className="text-[10px] font-bold text-primary-400 uppercase">Subject</div>
                                <div className="text-sm font-bold text-primary-900">{scheduleInfo?.subject_name}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-primary-400 uppercase">Max Marks</div>
                                <div className="text-sm font-bold text-primary-900">{scheduleInfo?.max_marks}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-primary-400 uppercase">Pass Marks</div>
                                <div className="text-sm font-bold text-primary-900">{scheduleInfo?.pass_marks}</div>
                            </div>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-primary flex items-center shadow-lg shadow-primary-200"
                        >
                            {saving ? <Clock size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                            Save as Draft
                        </button>
                    </div>

                    <div className="card overflow-hidden bg-white text-gray-900 border-none shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Roll</th>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Marks Obtained</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {students.map((student) => (
                                    <tr key={student.student_id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-gray-300">#{student.roll_number}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs mr-3">
                                                    {student.first_name[0]}{student.last_name[0]}
                                                </div>
                                                <div className="text-sm font-bold">{student.first_name} {student.last_name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                disabled={student.is_absent}
                                                className={cn(
                                                    "w-20 py-2 text-center font-bold rounded-xl border-2 transition-all",
                                                    student.is_absent ? "bg-gray-100 border-gray-100 text-gray-300" :
                                                        parseFloat(student.marks_obtained) < (scheduleInfo?.pass_marks || 33) ? "bg-red-50 border-red-100 text-red-600 focus:border-red-500" :
                                                            "bg-primary-50 border-primary-100 text-primary-700 focus:border-primary-500"
                                                )}
                                                value={student.is_absent ? 'ABS' : student.marks_obtained}
                                                onChange={(e) => handleMarkChange(student.student_id, e.target.value)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => {
                                                    setStudents(prev => prev.map(s => s.student_id === student.student_id ? { ...s, is_absent: !s.is_absent, marks_obtained: !s.is_absent ? 0 : s.marks_obtained } : s));
                                                }}
                                                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border-2 transition-all ${student.is_absent ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-100' : 'bg-white text-gray-400 border-gray-100 hover:border-red-200 hover:text-red-500'
                                                    }`}
                                            >
                                                {student.is_absent ? 'Absent' : 'Mark Absent'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                placeholder="Extra notes..."
                                                className="input-field py-2 text-xs border-none bg-gray-50 focus:bg-white"
                                                value={student.remarks}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setStudents(prev => prev.map(s => s.student_id === student.student_id ? { ...s, remarks: val } : s));
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
        </div>
    );
};

export default MarkEntry;
