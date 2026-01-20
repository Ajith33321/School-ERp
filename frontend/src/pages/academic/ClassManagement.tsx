import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Layers,
    User,
    MoreVertical,
    Edit,
    Trash2,
    ChevronRight,
    Loader2
} from 'lucide-react';
import api from '../../services/api';

const ClassManagement: React.FC = () => {
    const [classes, setClasses] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState<any>(null);
    const [showClassModal, setShowClassModal] = useState(false);
    const [showSectionModal, setShowSectionModal] = useState(false);

    const [classForm, setClassForm] = useState({
        name: '',
        short_name: '',
        capacity: 40,
        display_order: 0
    });

    const [sectionForm, setSectionForm] = useState({
        class_id: '',
        name: '',
        capacity: 40,
        room_number: ''
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchSections(selectedClass.id);
        } else {
            setSections([]);
        }
    }, [selectedClass]);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const res = await api.get('academic/classes');
            setClasses(res.data.data);
            if (res.data.data.length > 0 && !selectedClass) {
                setSelectedClass(res.data.data[0]);
            }
        } catch (err) {
            console.error('Failed to fetch classes');
        } finally {
            setLoading(false);
        }
    };

    const fetchSections = async (classId: string) => {
        try {
            const res = await api.get(`academic/sections?classId=${classId}`);
            setSections(res.data.data);
        } catch (err) {
            console.error('Failed to fetch sections');
        }
    };

    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('academic/classes', classForm);
            setShowClassModal(false);
            fetchClasses();
            setClassForm({ name: '', short_name: '', capacity: 40, display_order: 0 });
        } catch (err) {
            alert('Failed to create class');
        }
    };

    const handleCreateSection = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('academic/sections', { ...sectionForm, class_id: selectedClass.id });
            setShowSectionModal(false);
            fetchSections(selectedClass.id);
            setSectionForm({ class_id: '', name: '', capacity: 40, room_number: '' });
        } catch (err) {
            alert('Failed to create section');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center text-gray-900">
                <div>
                    <h1 className="text-2xl font-bold">Classes & Sections</h1>
                    <p className="text-gray-500">Manage school academic structure.</p>
                </div>
                <button
                    onClick={() => setShowClassModal(true)}
                    className="btn-primary flex items-center"
                >
                    <Plus size={18} className="mr-2" /> Add Class
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Classes List */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="card h-full flex flex-col">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="font-bold text-gray-900">Classes</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto max-h-[600px]">
                            {loading ? (
                                <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-gray-400" /></div>
                            ) : classes.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setSelectedClass(c)}
                                    className={`w-full flex items-center justify-between p-4 border-b border-gray-100 transition-colors ${selectedClass?.id === c.id ? 'bg-primary-50 border-primary-200' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center mr-3 ${selectedClass?.id === c.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            <Layers size={18} />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-gray-900">{c.name}</div>
                                            <div className="text-xs text-gray-500">{c.short_name} • Cap: {c.capacity}</div>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className={selectedClass?.id === c.id ? 'text-primary-600' : 'text-gray-300'} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sections List */}
                <div className="lg:col-span-2 space-y-4">
                    {selectedClass ? (
                        <div className="card h-full flex flex-col">
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center text-gray-900">
                                <h2 className="font-bold">Sections in {selectedClass.name}</h2>
                                <button
                                    onClick={() => setShowSectionModal(true)}
                                    className="btn-secondary py-1.5 text-xs flex items-center"
                                >
                                    <Plus size={14} className="mr-1" /> Add Section
                                </button>
                            </div>
                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sections.length === 0 ? (
                                    <div className="col-span-2 py-12 text-center text-gray-500 border-2 border-dashed border-gray-100 rounded-xl">
                                        No sections defined for this class.
                                    </div>
                                ) : sections.map(s => (
                                    <div key={s.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow relative group bg-white">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="h-8 w-8 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center font-bold">
                                                {s.name}
                                            </div>
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <User size={14} className="mr-2 text-gray-400" />
                                                <span>Teacher: {s.teacher_first_name || 'Not Assigned'}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Layers size={14} className="mr-2 text-gray-400" />
                                                <span>Capacity: {s.capacity} Students</span>
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                Room: {s.room_number || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            Select a class to view sections
                        </div>
                    )}
                </div>
            </div>

            {/* Class Modal Placeholder */}
            {showClassModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Add New Class</h2>
                        <form onSubmit={handleCreateClass} className="space-y-4 text-gray-900">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Class Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    placeholder="e.g. Class 10"
                                    value={classForm.name}
                                    onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Short Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. 10th"
                                    value={classForm.short_name}
                                    onChange={(e) => setClassForm({ ...classForm, short_name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Capacity</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={classForm.capacity}
                                        onChange={(e) => setClassForm({ ...classForm, capacity: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Order Index</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={classForm.display_order}
                                        onChange={(e) => setClassForm({ ...classForm, display_order: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setShowClassModal(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Create Class</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassManagement;
