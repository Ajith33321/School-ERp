import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Book,
    Layers,
    User,
    Settings,
    Edit,
    Trash2,
    CheckCircle,
    Loader2
} from 'lucide-react';
import api from '../../services/api';

const SubjectManagement: React.FC = () => {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [classSubjects, setClassSubjects] = useState<any[]>([]);
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);

    const [subjectForm, setSubjectForm] = useState({
        name: '',
        code: '',
        subject_type: 'theory',
        description: ''
    });

    const [mapForm, setMapForm] = useState({
        subject_id: '',
        is_mandatory: true,
        max_marks: 100,
        pass_marks: 33,
        weightage: 1
    });

    useEffect(() => {
        fetchSubjects();
        fetchClasses();
    }, []);

    useEffect(() => {
        if (selectedClassId) {
            fetchClassSubjects(selectedClassId);
        }
    }, [selectedClassId]);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const res = await api.get('academic/subjects');
            setSubjects(res.data.data);
        } catch (err) {
            console.error('Failed to fetch subjects');
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const res = await api.get('academic/classes');
            setClasses(res.data.data);
            if (res.data.data.length > 0) setSelectedClassId(res.data.data[0].id);
        } catch (err) {
            console.error('Failed to fetch classes');
        }
    };

    const fetchClassSubjects = async (classId: string) => {
        try {
            const res = await api.get(`academic/classes/${classId}/subjects`);
            setClassSubjects(res.data.data);
        } catch (err) {
            console.error('Failed to fetch class subjects');
        }
    };

    const handleCreateSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('academic/subjects', subjectForm);
            setShowSubjectModal(false);
            fetchSubjects();
            setSubjectForm({ name: '', code: '', subject_type: 'theory', description: '' });
        } catch (err) {
            alert('Failed to create subject');
        }
    };

    const handleMapSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('academic/class-subjects', { ...mapForm, class_id: selectedClassId });
            setShowMapModal(false);
            fetchClassSubjects(selectedClassId);
        } catch (err) {
            alert('Failed to map subject');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center text-gray-900">
                <div>
                    <h1 className="text-2xl font-bold">Subject Management</h1>
                    <p className="text-gray-500">Master list of subjects and class-wise mapping.</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => setShowSubjectModal(true)}
                        className="btn-secondary flex items-center"
                    >
                        <Plus size={18} className="mr-2" /> Add Master Subject
                    </button>
                    <button
                        onClick={() => setShowMapModal(true)}
                        className="btn-primary flex items-center"
                    >
                        <Layers size={18} className="mr-2" /> Map to Class
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Master Subjects */}
                <div className="lg:col-span-1">
                    <div className="card h-full">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="font-bold text-gray-900">Subject Master List</h2>
                        </div>
                        <div className="p-4 space-y-3">
                            {subjects.map(s => (
                                <div key={s.id} className="p-3 border border-gray-100 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors bg-white">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 bg-purple-50 text-purple-600 rounded flex items-center justify-center mr-3 font-bold text-xs">
                                            {s.code || s.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">{s.name}</div>
                                            <div className="text-xs text-gray-500 capitalize">{s.subject_type}</div>
                                        </div>
                                    </div>
                                    <Settings size={14} className="text-gray-300 pointer-events-none" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Class Mapping */}
                <div className="lg:col-span-2 space-y-4 text-gray-900">
                    <div className="card p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-semibold">Select Class:</span>
                            <select
                                className="input-field py-1"
                                value={selectedClassId}
                                onChange={(e) => setSelectedClassId(e.target.value)}
                            >
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="card overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Marks (Pass)</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {classSubjects.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                            No subjects mapped to this class yet.
                                        </td>
                                    </tr>
                                ) : classSubjects.map(cs => (
                                    <tr key={cs.id} className="hover:bg-gray-50 transition-colors bg-white">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">{cs.name}</div>
                                            <div className="text-xs text-gray-500">{cs.code}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cs.is_mandatory ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {cs.is_mandatory ? 'Mandatory' : 'Optional'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium">{cs.max_marks} ({cs.pass_marks})</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-red-600 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Master Subject Modal */}
            {showSubjectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200 text-gray-900">
                        <h2 className="text-xl font-bold mb-4">Add New Subject Master</h2>
                        <form onSubmit={handleCreateSubject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Subject Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={subjectForm.name}
                                    onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Subject Code</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={subjectForm.code}
                                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Type</label>
                                <select
                                    className="input-field"
                                    value={subjectForm.subject_type}
                                    onChange={(e) => setSubjectForm({ ...subjectForm, subject_type: e.target.value })}
                                >
                                    <option value="theory">Theory</option>
                                    <option value="practical">Practical</option>
                                    <option value="both">Both</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setShowSubjectModal(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Create Subject</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Mapping Modal */}
            {showMapModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200 text-gray-900">
                        <h2 className="text-xl font-bold mb-4">Map Subject to {classes.find(c => c.id === selectedClassId)?.name}</h2>
                        <form onSubmit={handleMapSubject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Select Subject *</label>
                                <select
                                    required
                                    className="input-field"
                                    value={mapForm.subject_id}
                                    onChange={(e) => setMapForm({ ...mapForm, subject_id: e.target.value })}
                                >
                                    <option value="">Choose Subject</option>
                                    {subjects.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="mandatory"
                                    checked={mapForm.is_mandatory}
                                    onChange={(e) => setMapForm({ ...mapForm, is_mandatory: e.target.checked })}
                                    className="h-4 w-4 text-primary-600 rounded border-gray-300"
                                />
                                <label htmlFor="mandatory" className="ml-2 text-sm font-semibold">Is Mandatory?</label>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-gray-900">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Max Marks</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={mapForm.max_marks}
                                        onChange={(e) => setMapForm({ ...mapForm, max_marks: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Pass Marks</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={mapForm.pass_marks}
                                        onChange={(e) => setMapForm({ ...mapForm, pass_marks: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setShowMapModal(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Add to Class</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectManagement;
