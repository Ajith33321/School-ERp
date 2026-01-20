import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Bus,
    User,
    Phone,
    Settings,
    Edit,
    Trash2,
    Shield
} from 'lucide-react';
import api from '../../services/api';

interface Vehicle {
    id: string;
    vehicle_number: string;
    vehicle_model: string;
    seating_capacity: number;
    driver_name: string;
    driver_phone: string;
    status: string;
}

const VehicleMaster: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        vehicleNumber: '',
        vehicleModel: '',
        seatingCapacity: 40,
        driverName: '',
        driverPhone: '',
        driverLicense: ''
    });

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const res = await api.get('transport/vehicles');
            setVehicles(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('transport/vehicles', formData);
            setIsModalOpen(false);
            fetchVehicles();
            setFormData({
                vehicleNumber: '',
                vehicleModel: '',
                seatingCapacity: 40,
                driverName: '',
                driverPhone: '',
                driverLicense: ''
            });
        } catch (error) {
            console.error('Error adding vehicle:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage school bus fleet and driver assignments</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add New Vehicle
                </button>
            </div>

            {/* Vehicle Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="card p-6 animate-pulse h-48 bg-gray-50"></div>
                    ))
                ) : vehicles.length > 0 ? (
                    vehicles.map(vehicle => (
                        <div key={vehicle.id} className="card p-6 hover:shadow-md transition-shadow relative group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
                                    <Bus size={24} />
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${vehicle.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {vehicle.status.toUpperCase()}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{vehicle.vehicle_number}</h3>
                            <p className="text-sm text-gray-500 mb-4">{vehicle.vehicle_model} • {vehicle.seating_capacity} Seats</p>

                            <div className="space-y-2 border-t pt-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <User size={14} className="text-gray-400" />
                                    <span className="font-medium">{vehicle.driver_name || 'No Driver Assigned'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone size={14} className="text-gray-400" />
                                    <span>{vehicle.driver_phone || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-primary-600"><Edit size={16} /></button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 card p-12 text-center text-gray-500 italic">
                        No vehicles found. Add your first bus to get started.
                    </div>
                )}
            </div>

            {/* Add Vehicle Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Add New Vehicle</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. MH-12-AB-1234"
                                        className="input-field"
                                        value={formData.vehicleNumber}
                                        onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Model / Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Tata Starbus"
                                        className="input-field"
                                        value={formData.vehicleModel}
                                        onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Seating Capacity *</label>
                                    <input
                                        type="number"
                                        required
                                        className="input-field"
                                        value={formData.seatingCapacity}
                                        onChange={(e) => setFormData({ ...formData, seatingCapacity: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="col-span-2 border-t pt-4 mt-2">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Driver Details</h4>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.driverName}
                                        onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Driver Phone</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.driverPhone}
                                        onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Driver License No.</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.driverLicense}
                                        onChange={(e) => setFormData({ ...formData, driverLicense: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Add Vehicle</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleMaster;
