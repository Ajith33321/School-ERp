import React, { useState, useEffect } from 'react';
import {
    Settings,
    Layers,
    ShieldCheck,
    Plus,
    Edit,
    Trash2,
    Check,
    X,
    PlusCircle
} from 'lucide-react';
import api from '../../services/api';

const ExamTypeSetup: React.FC = () => {
    const [examTypes, setExamTypes] = useState<any[]>([]);
    const [gradingSystems, setGradingSystems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showTypeModal, setShowTypeModal] = useState(false);
    const [showGradingModal, setShowGradingModal] = useState(false);

    // New Type Form
    const [typeName, setTypeName] = useState('');
    const [typeDesc, setTypeDesc] = useState('');

    // New Grading System Form
    const [gsName, setGsName] = useState('');
    const [gsDesc, setGsDesc] = useState('');
    const [scales, setScales] = useState<any[]>([
        { grade_name: 'A+', min_percentage: 90, max_percentage: 100, grade_point: 10, display_order: 1 }
    ]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [typesRes, gsRes] = await Promise.all([
                api.get('/exams/types'),
                api.get('/exams/grading-systems')
            ]);
            setExamTypes(typesRes.data.data);
            setGradingSystems(gsRes.data.data);
        } catch (err) {
            console.error('Failed to fetch exam data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateType = async () => {
        try {
            await api.post('/exams/types', { name: typeName, description: typeDesc, displayOrder: examTypes.length + 1 });
            setShowTypeModal(false);
            setTypeName('');
            setTypeDesc('');
            fetchData();
        } catch (err) {
            alert('Failed to create exam type');
        }
    };

    const handleAddScaleLine = () => {
        setScales([...scales, { grade_name: '', min_percentage: 0, max_percentage: 0, grade_point: 0, display_order: scales.length + 1 }]);
    };

    const handleCreateGrading = async () => {
        try {
            await api.post('/exams/grading-systems', { name: gsName, description: gsDesc, scales });
            setShowGradingModal(false);
            setGsName('');
            setGsDesc('');
            setScales([{ grade_name: 'A+', min_percentage: 90, max_percentage: 100, grade_point: 10, display_order: 1 }]);
            fetchData();
        } catch (err) {
            alert('Failed to create grading system');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center text-gray-900">
                <div>
                    <h1 className="text-2xl font-bold">Exam Configuration</h1>
                    <p className="text-gray-500">Configure exam types and grading scales.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Exam Types */}
                <div className="card bg-white text-gray-900">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center">
                            <Layers size={20} className="mr-2 text-primary-600" />
                            <h2 className="font-bold">Exam Types</h2>
                        </div>
                        <button onClick={() => setShowTypeModal(true)} className="p-2 bg-primary-50 text-primary-600 rounded-full hover:bg-primary-100 transition-colors">
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="p-4 space-y-3">
                        {examTypes.map(type => (
                            <div key={type.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                                <div>
                                    <div className="font-bold text-sm">{type.name}</div>
                                    <div className="text-[10px] text-gray-400 font-medium italic">{type.description || 'No description'}</div>
                                </div>
                                <div className="flex space-x-1">
                                    <button className="p-1.5 text-gray-400 hover:text-primary-600"><Edit size={14} /></button>
                                    <button className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grading Systems */}
                <div className="card bg-white text-gray-900">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center">
                            <ShieldCheck size={20} className="mr-2 text-green-600" />
                            <h2 className="font-bold">Grading Systems</h2>
                        </div>
                        <button onClick={() => setShowGradingModal(true)} className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors">
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="p-4 space-y-4">
                        {gradingSystems.map(gs => (
                            <div key={gs.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                                <div className="bg-gray-50 p-3 border-b border-gray-100 flex justify-between items-center">
                                    <div className="font-bold text-sm tracking-tight">{gs.name}</div>
                                    <div className="flex space-x-1">
                                        <button className="p-1 text-gray-400 hover:text-primary-600"><Edit size={14} /></button>
                                    </div>
                                </div>
                                <div className="p-3 text-xs">
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {gs.scales?.map((scale: any) => (
                                            <span key={scale.id} className="px-2 py-1 bg-white border border-gray-100 rounded-lg font-bold shadow-sm">
                                                {scale.grade_name}: {scale.min_percentage}-{scale.max_percentage}%
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showTypeModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 bg-primary-600 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold">New Exam Type</h3>
                            <button onClick={() => setShowTypeModal(false)}><X size={24} /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Type Name</label>
                                    <input value={typeName} onChange={(e) => setTypeName(e.target.value)} type="text" className="input-field py-3 text-gray-900" placeholder="e.g. Mid-Term Exam" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                                    <textarea value={typeDesc} onChange={(e) => setTypeDesc(e.target.value)} className="input-field min-h-[100px] text-gray-900" placeholder="Add some details..."></textarea>
                                </div>
                            </div>
                            <button onClick={handleCreateType} className="btn-primary w-full py-4 text-lg">Create Type</button>
                        </div>
                    </div>
                </div>
            )}

            {showGradingModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                        <div className="p-6 bg-green-600 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold">New Grading System</h3>
                            <button onClick={() => setShowGradingModal(false)}><X size={24} /></button>
                        </div>
                        <div className="p-8 space-y-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">System Name</label>
                                    <input value={gsName} onChange={(e) => setGsName(e.target.value)} type="text" className="input-field text-gray-900" placeholder="e.g. CBSE Letter Grade" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                                    <input value={gsDesc} onChange={(e) => setGsDesc(e.target.value)} type="text" className="input-field text-gray-900" placeholder="Optional info..." />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-gray-700">Grading Scales</label>
                                    <button onClick={handleAddScaleLine} className="text-xs font-bold text-green-600 flex items-center">
                                        <PlusCircle size={16} className="mr-1" /> Add Row
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {scales.map((scale, idx) => (
                                        <div key={idx} className="grid grid-cols-4 gap-3">
                                            <input
                                                value={scale.grade_name}
                                                onChange={(e) => {
                                                    const newScales = [...scales];
                                                    newScales[idx].grade_name = e.target.value;
                                                    setScales(newScales);
                                                }}
                                                className="input-field text-xs text-gray-900"
                                                placeholder="Grade (e.g. A+)"
                                            />
                                            <div className="flex items-center space-x-1">
                                                <input
                                                    value={scale.min_percentage}
                                                    onChange={(e) => {
                                                        const newScales = [...scales];
                                                        newScales[idx].min_percentage = parseFloat(e.target.value);
                                                        setScales(newScales);
                                                    }}
                                                    type="number" className="input-field text-xs text-gray-900" placeholder="Min %"
                                                />
                                                <span className="text-gray-300">-</span>
                                                <input
                                                    value={scale.max_percentage}
                                                    onChange={(e) => {
                                                        const newScales = [...scales];
                                                        newScales[idx].max_percentage = parseFloat(e.target.value);
                                                        setScales(newScales);
                                                    }}
                                                    type="number" className="input-field text-xs text-gray-900" placeholder="Max %"
                                                />
                                            </div>
                                            <input
                                                value={scale.grade_point}
                                                onChange={(e) => {
                                                    const newScales = [...scales];
                                                    newScales[idx].grade_point = parseFloat(e.target.value);
                                                    setScales(newScales);
                                                }}
                                                type="number" className="input-field text-xs text-gray-900" placeholder="GP"
                                            />
                                            <button
                                                onClick={() => setScales(scales.filter((_, i) => i !== idx))}
                                                className="p-2 text-red-400 hover:text-red-600"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button onClick={handleCreateGrading} className="btn-success w-full py-4 text-lg">Create System</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamTypeSetup;
