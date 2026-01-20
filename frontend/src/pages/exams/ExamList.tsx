import React, { useState, useEffect } from 'react';
import {
    FileText,
    Plus,
    Calendar,
    Layers,
    Search,
    CheckCircle,
    Clock,
    ChevronRight,
    TrendingUp,
    X
} from 'lucide-react';
import api from '../../services/api';

const ExamList: React.FC = () => {
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Masters
    const [examTypes, setExamTypes] = useState<any[]>([]);
    const [gradingSystems, setGradingSystems] = useState<any[]>([]);

    // Form
    const [formData, setFormData] = useState({
        examName: '',
        examTypeId: '',
        gradingSystemId: '',
        startDate: '',
        endDate: '',
        syllabusPercentage: 100
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [examsRes, typesRes, gsRes] = await Promise.all([
                api.get('/exams', { params: { academicYearId: '00000000-0000-0000-0000-000000000000' } }),
                api.get('/exams/types'),
                api.get('/exams/grading-systems')
            ]);
            setExams(examsRes.data.data);
            setExamTypes(typesRes.data.data);
            setGradingSystems(gsRes.data.data);
        } catch (err) {
            console.error('Failed to fetch exams');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateExam = async () => {
        try {
            await api.post('/exams', {
                ...formData,
                academicYearId: '00000000-0000-0000-0000-000000000000' // Mock
            });
            setShowModal(false);
            fetchData();
            alert('Exam created successfully');
        } catch (err) {
            alert('Failed to create exam');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center text-gray-900">
                <div>
                    <h1 className="text-2xl font-bold">Exams</h1>
                    <p className="text-gray-500">Manage all internal and external examinations.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center"
                >
                    <Plus size={20} className="mr-2" /> New Exam
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-gray-500 font-bold">Loading exams...</div>
                ) : exams.length === 0 ? (
                    <div className="col-span-full card p-20 flex flex-col items-center justify-center text-center bg-white">
                        <FileText size={48} className="text-gray-200 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">No Exams Scheduled</h3>
                        <p className="text-gray-500 max-w-xs mt-2">Get started by creating your first examination of the academic year.</p>
                    </div>
                ) : exams.map(exam => (
                    <div key={exam.id} className="card bg-white p-6 hover:shadow-xl hover:shadow-primary-50 transition-all border-none text-gray-900 flex flex-col justify-between group">
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                                    <FileText size={24} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${exam.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                    {exam.status}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold group-hover:text-primary-600 transition-colors">{exam.exam_name}</h3>
                                <p className="text-xs text-gray-400 font-medium italic mt-1">{exam.exam_type_name}</p>
                            </div>
                            <div className="space-y-2 py-4 border-y border-gray-50">
                                <div className="flex items-center text-xs text-gray-500">
                                    <Calendar size={14} className="mr-2 text-gray-400" />
                                    {new Date(exam.start_date).toLocaleDateString()} - {new Date(exam.end_date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                    <TrendingUp size={14} className="mr-2 text-gray-400" />
                                    {exam.grading_system_name || 'Letter Grade'} System
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-3 text-sm font-bold bg-gray-50 text-gray-600 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-all flex items-center justify-center">
                            View Schedule <ChevronRight size={16} className="ml-1" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Create Exam Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="p-6 bg-primary-600 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold">Create New Exam</h3>
                            <button onClick={() => setShowModal(false)}><X size={24} /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Exam Name</label>
                                    <input
                                        className="input-field py-3 text-gray-900 border-gray-100 focus:border-primary-500"
                                        placeholder="e.g. Annual Exams 2026"
                                        value={formData.examName}
                                        onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Exam Type</label>
                                        <select
                                            className="input-field py-3 text-gray-900"
                                            value={formData.examTypeId}
                                            onChange={(e) => setFormData({ ...formData, examTypeId: e.target.value })}
                                        >
                                            <option value="">Select Type</option>
                                            {examTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Grading System</label>
                                        <select
                                            className="input-field py-3 text-gray-900"
                                            value={formData.gradingSystemId}
                                            onChange={(e) => setFormData({ ...formData, gradingSystemId: e.target.value })}
                                        >
                                            <option value="">Select System</option>
                                            {gradingSystems.map(gs => <option key={gs.id} value={gs.id}>{gs.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Start Date</label>
                                        <input
                                            type="date"
                                            className="input-field py-3 text-gray-900"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">End Date</label>
                                        <input
                                            type="date"
                                            className="input-field py-3 text-gray-900"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleCreateExam}
                                className="btn-primary w-full py-4 text-lg shadow-xl shadow-primary-100"
                            >
                                Schedule Exam
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamList;
