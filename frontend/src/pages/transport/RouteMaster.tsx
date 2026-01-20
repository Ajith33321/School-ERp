import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    MapPin,
    Clock,
    DollarSign,
    Bus,
    Trash2,
    MoveVertical,
    ChevronRight
} from 'lucide-react';
import api from '../../services/api';

const RouteMaster: React.FC = () => {
    const [routes, setRoutes] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        routeName: '',
        vehicleId: '',
        monthlyFee: 0,
        stops: [{ stopName: '', pickupTime: '', dropTime: '' }]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [routesRes, vehiclesRes] = await Promise.all([
                api.get('transport/routes'),
                api.get('transport/vehicles')
            ]);
            setRoutes(routesRes.data.data);
            setVehicles(vehiclesRes.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching transport data:', error);
            setLoading(false);
        }
    };

    const addStop = () => {
        setFormData({
            ...formData,
            stops: [...formData.stops, { stopName: '', pickupTime: '', dropTime: '' }]
        });
    };

    const removeStop = (index: number) => {
        setFormData({
            ...formData,
            stops: formData.stops.filter((_, i) => i !== index)
        });
    };

    const updateStop = (index: number, field: string, value: string) => {
        const newStops = [...formData.stops];
        (newStops[index] as any)[field] = value;
        setFormData({ ...formData, stops: newStops });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('transport/routes', formData);
            setIsModalOpen(false);
            fetchData();
            setFormData({
                routeName: '',
                vehicleId: '',
                monthlyFee: 0,
                stops: [{ stopName: '', pickupTime: '', dropTime: '' }]
            });
        } catch (error) {
            console.error('Error creating route:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Route Master</h1>
                    <p className="text-gray-500 text-sm mt-1">Design bus routes, stops, and schedules</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    Create New Route
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-2 text-center py-12">Loading routes...</div>
                ) : routes.length > 0 ? (
                    routes.map(route => (
                        <div key={route.id} className="card p-6 border-l-4 border-l-primary-500 hover:shadow-lg transition-all duration-300 group">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{route.route_name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Bus size={14} />
                                        <span>{route.vehicle_number || 'No Vehicle'}</span>
                                        <span className="mx-1">•</span>
                                        <DollarSign size={14} className="text-green-600" />
                                        <span className="font-semibold text-green-700">${route.monthly_fee}/mo</span>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 group-hover:text-primary-600 transition-colors">
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Major Stops</h4>
                                <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                                    <div className="flex items-center gap-4 pl-6 relative">
                                        <div className="absolute left-0 w-4 h-4 rounded-full bg-primary-500 border-4 border-white shadow-sm z-10"></div>
                                        <span className="text-sm font-medium text-gray-700">Campus Entry</span>
                                        <span className="text-xs text-gray-400 ml-auto">08:00 AM</span>
                                    </div>
                                    <div className="flex items-center gap-4 pl-6 relative">
                                        <div className="absolute left-0.5 w-3 h-3 rounded-full bg-gray-300 border-2 border-white shadow-sm z-10"></div>
                                        <span className="text-sm text-gray-600">Main Square Mall</span>
                                        <span className="text-xs text-gray-400 ml-auto">08:15 AM</span>
                                    </div>
                                    <div className="flex items-center gap-4 pl-6 relative">
                                        <div className="absolute left-0 w-4 h-4 rounded-full bg-primary-600 border-4 border-white shadow-sm z-10"></div>
                                        <span className="text-sm font-bold text-gray-900">Final Destination</span>
                                        <span className="text-xs text-gray-400 ml-auto">08:45 AM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 card p-12 text-center text-gray-500">
                        No routes created yet. Defined routes will appear here.
                    </div>
                )}
            </div>

            {/* Create Route Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Design New Route</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Route Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. South City Express"
                                        className="input-field"
                                        value={formData.routeName}
                                        onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign Vehicle</label>
                                    <select
                                        className="input-field"
                                        value={formData.vehicleId}
                                        onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                                    >
                                        <option value="">Select Bus</option>
                                        {vehicles.map(v => (
                                            <option key={v.id} value={v.id}>{v.vehicle_number} ({v.vehicle_model})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Fee ($) *</label>
                                    <input
                                        type="number"
                                        required
                                        className="input-field"
                                        value={formData.monthlyFee}
                                        onChange={(e) => setFormData({ ...formData, monthlyFee: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-gray-700">Bus Stops & Schedule</h4>
                                    <button
                                        type="button"
                                        onClick={addStop}
                                        className="text-primary-600 text-xs font-bold hover:underline flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Add Stop
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {formData.stops.map((stop, index) => (
                                        <div key={index} className="flex gap-4 items-end animate-in fade-in slide-in-from-right-2">
                                            <div className="flex-1">
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Stop Name</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400" size={14} />
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Central Park"
                                                        className="input-field pl-9 h-9 text-sm"
                                                        value={stop.stopName}
                                                        onChange={(e) => updateStop(index, 'stopName', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-32">
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Pickup Time</label>
                                                <div className="relative">
                                                    <Clock className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400" size={14} />
                                                    <input
                                                        type="time"
                                                        className="input-field pl-9 h-9 text-sm"
                                                        value={stop.pickupTime}
                                                        onChange={(e) => updateStop(index, 'pickupTime', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeStop(index)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg mb-0.5"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Save Route</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RouteMaster;
