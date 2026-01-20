import React, { useState, useEffect } from 'react';
import {
    Plus,
    DollarSign,
    Settings,
    Layers,
    Edit,
    Trash2,
    Check,
    X,
    PlusCircle,
    Calendar
} from 'lucide-react';
import api from '../../services/api';

const FeeSetup: React.FC = () => {
    const [feeGroups, setFeeGroups] = useState<any[]>([]);
    const [feeTypes, setFeeTypes] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showTypeModal, setShowTypeModal] = useState(false);

    // Forms
    const [groupForm, setGroupForm] = useState({ name: '', description: '' });
    const [typeForm, setTypeForm] = useState({ feeGroupId: '', name: '', code: '', isRecurring: true, frequency: 'monthly' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [grpRes, typRes, clsRes] = await Promise.all([
                api.get('finance/groups'),
                api.get('finance/types'),
                api.get('academic/classes')
            ]);
            setFeeGroups(grpRes.data.data);
            setFeeTypes(typRes.data.data);
            setClasses(clsRes.data.data);
        } catch (err) {
            console.error('Failed to fetch fee data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async () => {
        try {
            await api.post('finance/groups', groupForm);
            setShowGroupModal(false);
            setGroupForm({ name: '', description: '' });
            fetchData();
        } catch (err) {
            alert('Failed to create fee group');
        }
    };

    const handleCreateType = async () => {
        try {
            await api.post('finance/types', typeForm);
            setShowTypeModal(false);
            setTypeForm({ feeGroupId: '', name: '', code: '', isRecurring: true, frequency: 'monthly' });
            fetchData();
        } catch (err) {
            alert('Failed to create fee type');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center text-gray-900">
                <div>
                    <h1 className="text-2xl font-bold">Fee Configuration</h1>
                    <p className="text-gray-500">Define fee groups, types, and class-wise structures.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Fee Groups */}
                <div className="card bg-white text-gray-900 shadow-sm border-none">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center">
                            <Layers size={20} className="mr-2 text-primary-600" />
                            <h2 className="font-bold">Fee Groups</h2>
                        </div>
                        <button onClick={() => setShowGroupModal(true)} className="p-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 transition-colors">
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="p-5 space-y-3">
                        {feeGroups.map(group => (
                            <div key={group.id} className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100 hover:border-primary-100 transition-colors group">
                                <div>
                                    <div className="font-bold text-sm">{group.name}</div>
                                    <div className="text-xs text-gray-400 italic">{group.description || 'No description'}</div>
                                </div>
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 text-gray-400 hover:text-primary-600"><Edit size={14} /></button>
                                    <button className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fee Types */}
                <div className="card bg-white text-gray-900 shadow-sm border-none">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center">
                            <DollarSign size={20} className="mr-2 text-green-600" />
                            <h2 className="font-bold">Fee Types</h2>
                        </div>
                        <button onClick={() => setShowTypeModal(true)} className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors">
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="p-5 space-y-4">
                        {feeTypes.map(type => (
                            <div key={type.id} className="p-4 border border-gray-100 rounded-2xl hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="font-bold text-sm tracking-tight">{type.name}</div>
                                        <div className="text-[10px] uppercase font-bold text-primary-500">{type.group_name}</div>
                                    </div>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">{type.frequency}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`h-2 w-2 rounded-full ${type.is_recurring ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {type.is_recurring ? 'Recurring' : 'One-time'} • {type.code}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showGroupModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 bg-primary-600 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold">New Fee Group</h3>
                            <button onClick={() => setShowGroupModal(false)}><X size={24} /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Group Name</label>
                                    <input value={groupForm.name} onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })} type="text" className="input-field py-3 text-gray-900 border-gray-100 focus:border-primary-500" placeholder="e.g. Tuition Fees" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Description</label>
                                    <textarea value={groupForm.description} onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })} className="input-field min-h-[100px] text-gray-900 border-gray-100" placeholder="Basic academic fees..."></textarea>
                                </div>
                            </div>
                            <button onClick={handleCreateGroup} className="btn-primary w-full py-4 text-lg shadow-xl shadow-primary-100">Create Group</button>
                        </div>
                    </div>
                </div>
            )}

            {showTypeModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 bg-green-600 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold">New Fee Type</h3>
                            <button onClick={() => setShowTypeModal(false)}><X size={24} /></button>
                        </div>
                        <div className="p-8 space-y-5">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Fee Group</label>
                                    <select value={typeForm.feeGroupId} onChange={(e) => setTypeForm({ ...typeForm, feeGroupId: e.target.value })} className="input-field py-3 text-gray-900">
                                        <option value="">Select Group</option>
                                        {feeGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Name</label>
                                        <input value={typeForm.name} onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })} type="text" className="input-field text-gray-900" placeholder="e.g. Term 1" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Code</label>
                                        <input value={typeForm.code} onChange={(e) => setTypeForm({ ...typeForm, code: e.target.value })} type="text" className="input-field text-gray-900" placeholder="T1" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Recurring?</label>
                                        <div className="flex p-1 bg-gray-100 rounded-xl">
                                            <button onClick={() => setTypeForm({ ...typeForm, isRecurring: true })} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${typeForm.isRecurring ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-400'}`}>Yes</button>
                                            <button onClick={() => setTypeForm({ ...typeForm, isRecurring: false })} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!typeForm.isRecurring ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-400'}`}>No</button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Frequency</label>
                                        <select value={typeForm.frequency} onChange={(e) => setTypeForm({ ...typeForm, frequency: e.target.value })} className="input-field text-gray-900">
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="yearly">Yearly</option>
                                            <option value="one-time">One-time</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleCreateType} className="btn-success w-full py-4 text-lg shadow-xl shadow-green-100">Save Fee Type</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeSetup;
