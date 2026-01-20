import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Download, Printer, Users, Search, Filter } from 'lucide-react';
import api from '../../services/api';
import { cn } from '../../utils/cn';

interface IDCardTemplate {
    id: string;
    template_name: string;
    template_type: 'student' | 'staff';
    is_default: boolean;
}

const IDCardGeneration: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'student' | 'staff'>('student');
    const [templates, setTemplates] = useState<IDCardTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTemplates();
    }, [activeTab]);

    const fetchTemplates = async () => {
        try {
            // const response = await api.get(`id-cards/templates?type=${activeTab}`);
            // setTemplates(response.data);
            // Mock data for now
            setTemplates([
                { id: '1', template_name: 'Default Student Card', template_type: 'student', is_default: true },
                { id: '2', template_name: 'Premium Student Card', template_type: 'student', is_default: false },
            ]);
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    const handleGenerateCards = async () => {
        setLoading(true);
        try {
            // await api.post('id-cards/generate-bulk', {
            //     template_id: selectedTemplate,
            //     type: activeTab,
            //     class_id: selectedClass
            // });
            alert('ID Cards generated successfully!');
        } catch (error) {
            console.error('Error generating cards:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">ID Card Generation</h1>
                    <p className="text-slate-500 font-medium mt-1">Generate and manage student & staff ID cards</p>
                </div>
                <button className="btn-3d btn-3d-primary flex items-center gap-2">
                    <Plus size={20} />
                    Create Template
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-slate-100 p-2 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('student')}
                    className={cn(
                        "px-6 py-3 rounded-xl font-bold transition-all",
                        activeTab === 'student'
                            ? "bg-white text-blue-600 shadow-lg"
                            : "text-slate-600 hover:text-slate-900"
                    )}
                >
                    <Users size={18} className="inline mr-2" />
                    Student Cards
                </button>
                <button
                    onClick={() => setActiveTab('staff')}
                    className={cn(
                        "px-6 py-3 rounded-xl font-bold transition-all",
                        activeTab === 'staff'
                            ? "bg-white text-blue-600 shadow-lg"
                            : "text-slate-600 hover:text-slate-900"
                    )}
                >
                    <Users size={18} className="inline mr-2" />
                    Staff Cards
                </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel - Configuration */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card-modern">
                        <h3 className="text-lg font-black text-slate-900 mb-4">Card Configuration</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Select Template</label>
                                <select
                                    className="input-modern w-full"
                                    value={selectedTemplate}
                                    onChange={(e) => setSelectedTemplate(e.target.value)}
                                >
                                    <option value="">Choose template...</option>
                                    {templates.map(template => (
                                        <option key={template.id} value={template.id}>
                                            {template.template_name} {template.is_default && '(Default)'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {activeTab === 'student' && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Class</label>
                                    <select
                                        className="input-modern w-full"
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                    >
                                        <option value="">All Classes</option>
                                        <option value="1">Class 1</option>
                                        <option value="2">Class 2</option>
                                        <option value="3">Class 3</option>
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by name or ID..."
                                        className="input-modern w-full pl-10"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleGenerateCards}
                                disabled={!selectedTemplate || loading}
                                className="btn-3d btn-3d-primary w-full flex items-center justify-center gap-2"
                            >
                                <Printer size={18} />
                                {loading ? 'Generating...' : 'Generate Cards'}
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="card-modern">
                        <h3 className="text-lg font-black text-slate-900 mb-4">Statistics</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 font-medium">Total Cards Printed</span>
                                <span className="text-lg font-black text-blue-600">1,234</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 font-medium">This Month</span>
                                <span className="text-lg font-black text-green-600">45</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 font-medium">Pending</span>
                                <span className="text-lg font-black text-orange-600">12</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Preview & List */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Card Preview */}
                    <div className="card-modern">
                        <h3 className="text-lg font-black text-slate-900 mb-4">Card Preview</h3>
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 min-h-[300px] flex items-center justify-center">
                            <div className="text-center">
                                <CreditCard size={64} className="mx-auto text-slate-300 mb-4" />
                                <p className="text-slate-500 font-medium">Select a template to preview</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Cards */}
                    <div className="card-modern">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-black text-slate-900">Recent ID Cards</h3>
                            <button className="text-sm font-bold text-blue-600 hover:text-blue-700">
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div key={item} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black">
                                            {item}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Student Name {item}</p>
                                            <p className="text-xs text-slate-500">Class {item} - Roll No: {item}0{item}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 hover:bg-white rounded-lg transition-all">
                                            <Download size={18} className="text-blue-600" />
                                        </button>
                                        <button className="p-2 hover:bg-white rounded-lg transition-all">
                                            <Printer size={18} className="text-slate-600" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IDCardGeneration;
