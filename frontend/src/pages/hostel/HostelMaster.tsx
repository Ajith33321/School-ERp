import React, { useState, useEffect } from 'react';
import {
    Plus,
    Home,
    Users,
    Bed,
    Shield,
    MoreVertical,
    Search,
    MapPin
} from 'lucide-react';
import api from '../../services/api';

const HostelMaster: React.FC = () => {
    const [hostels, setHostels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        type: 'boys',
        address: '',
        wardenName: '',
        wardenPhone: ''
    });

    useEffect(() => {
        fetchHostels();
    }, []);

    const fetchHostels = async () => {
        try {
            const res = await api.get('hostel');
            setHostels(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching hostels:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('hostel', formData);
            setIsModalOpen(false);
            fetchHostels();
            setFormData({
                name: '',
                type: 'boys',
                address: '',
                wardenName: '',
                wardenPhone: ''
            });
        } catch (error) {
            console.error('Error creating hostel:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hostel Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage hostels, room types, and resident services</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Hostel
                </button>
            </div>

            {/* Hostel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-3 text-center py-12">Loading hostels...</div>
                ) : hostels.length > 0 ? (
                    hostels.map(hostel => (
                        <div key={hostel.id} className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${hostel.type === 'boys' ? 'bg-blue-50 text-blue-600' :
                                    hostel.type === 'girls' ? 'bg-pink-50 text-pink-600' : 'bg-purple-50 text-purple-600'
                                    }`}>
                                    <Home size={24} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${hostel.type === 'boys' ? 'bg-blue-100 text-blue-700' :
                                        hostel.type === 'girls' ? 'bg-pink-100 text-pink-700' : 'bg-purple-100 text-purple-700'
                                        }`}>
                                        {hostel.type}
                                    </span>
                                    <button className="text-gray-300 hover:text-gray-600">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">{hostel.name}</h3>

                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                <MapPin size={14} className="shrink-0" />
                                <span className="truncate">{hostel.address || 'No Address Provided'}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-50">
                                <div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Warden</div>
                                    <div className="text-sm font-medium text-gray-800">{hostel.warden_name || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Capacity</div>
                                    <div className="text-sm font-medium text-gray-800 flex items-center gap-1">
                                        <Users size={14} className="text-gray-400" />
                                        <span>45 / 120</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center py-12 card text-gray-500 italic">
                        No hostsels found. Start by adding a new hostel.
                    </div>
                )}
            </div>

            {/* Add Hostel Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Enroll New Hostel</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Type *</label>
                                    <select
                                        className="input-field"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="boys">Boys Hostel</option>
                                        <option value="girls">Girls Hostel</option>
                                        <option value="staff">Staff Hostel</option>
                                        <option value="common">Common</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Warden Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.wardenName}
                                        onChange={(e) => setFormData({ ...formData, wardenName: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Warden Phone</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.wardenPhone}
                                        onChange={(e) => setFormData({ ...formData, wardenPhone: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                                    <textarea
                                        rows={2}
                                        className="input-field"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Register Hostel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HostelMaster;
