import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Bed,
    User,
    ArrowRightLeft,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import api from '../../services/api';

const RoomAllocation: React.FC = () => {
    const [hostels, setHostels] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedHostel, setSelectedHostel] = useState('');
    const [formData, setFormData] = useState({
        studentId: '',
        roomId: '',
        allocationDate: new Date().toISOString().split('T')[0],
        remarks: ''
    });

    useEffect(() => {
        fetchHostels();
    }, []);

    useEffect(() => {
        if (selectedHostel) {
            fetchRooms(selectedHostel);
        }
    }, [selectedHostel]);

    const fetchHostels = async () => {
        try {
            const res = await api.get('hostel');
            setHostels(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching hostels:', error);
        }
    };

    const fetchRooms = async (hostelId: string) => {
        try {
            const res = await api.get(`hostel/${hostelId}/rooms`);
            setRooms(res.data.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('hostel/allocate', formData);
            alert('Room allocated successfully!');
            setIsModalOpen(false);
            setFormData({
                studentId: '',
                roomId: '',
                allocationDate: new Date().toISOString().split('T')[0],
                remarks: ''
            });
        } catch (error) {
            console.error('Error allocating room:', error);
            alert((error as any).response?.data?.message || 'Failed to allocate room');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Room Allocation</h1>
                    <p className="text-gray-500 text-sm mt-1">Assign students to rooms and manage occupancy</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    New Allocation
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card p-4 flex items-center gap-4 border-l-4 border-l-blue-500">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Bed size={20} /></div>
                    <div>
                        <div className="text-sm font-bold text-gray-900">156 / 200</div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Total Beds Occuiped</div>
                    </div>
                </div>
                <div className="card p-4 flex items-center gap-4 border-l-4 border-l-green-500">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle size={20} /></div>
                    <div>
                        <div className="text-sm font-bold text-gray-900">44</div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Available Beds</div>
                    </div>
                </div>
            </div>

            {/* Allocation List Table View */}
            <div className="card overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input type="text" placeholder="Search by student or room..." className="input-field pl-10 h-9" />
                    </div>
                    <select className="input-field h-9 w-48 text-sm">
                        <option>All Hostels</option>
                        {hostels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                    </select>
                </div>
                <div className="overflow-x-auto text-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-[10px] tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Hostel / Room</th>
                                <th className="px-6 py-4 text-center">Date</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                                    Use the "New Allocation" button to start assigning rooms.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Allocation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <ArrowRightLeft className="text-primary-600" size={20} />
                                New Room Allocation
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Student *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Enter Student Code or ID"
                                        required
                                        className="input-field pl-10"
                                        value={formData.studentId}
                                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hostel *</label>
                                    <select
                                        required
                                        className="input-field"
                                        value={selectedHostel}
                                        onChange={(e) => setSelectedHostel(e.target.value)}
                                    >
                                        <option value="">Select Hostel</option>
                                        {hostels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Rooms *</label>
                                    <select
                                        required
                                        className="input-field"
                                        value={formData.roomId}
                                        onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                                    >
                                        <option value="">Select Room</option>
                                        {rooms.map(r => (
                                            <option key={r.id} value={r.id} disabled={r.occupied_beds >= r.capacity}>
                                                Room {r.room_number} ({r.occupied_beds}/{r.capacity})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Allocation Date *</label>
                                <input
                                    type="date"
                                    required
                                    className="input-field"
                                    value={formData.allocationDate}
                                    onChange={(e) => setFormData({ ...formData, allocationDate: e.target.value })}
                                />
                            </div>

                            <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex gap-3 text-amber-800 text-xs">
                                <AlertCircle size={18} className="shrink-0" />
                                <p>Allocation creates a monthly hostel fee entry for the student automatically if configured.</p>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Confirm Allocation</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomAllocation;
