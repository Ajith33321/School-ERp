import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Box,
    Package,
    AlertTriangle,
    Edit,
    Trash2,
    Settings,
    MoreHorizontal
} from 'lucide-react';
import api from '../../services/api';

interface Item {
    id: string;
    name: string;
    code: string;
    category_name: string;
    unit_of_measure: string;
    reorder_level: number;
    current_stock: number;
}

const ItemMaster: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        categoryId: '',
        unitOfMeasure: 'pcs',
        reorderLevel: 10,
        description: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [itemsRes, catsRes] = await Promise.all([
                api.get('inventory/items'),
                api.get('inventory/categories')
            ]);
            setItems(itemsRes.data.data);
            setCategories(catsRes.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching inventory data:', error);
            setLoading(false);
        }
    };

    const handleCreateItem = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('inventory/items', formData);
            setIsModalOpen(false);
            fetchData();
            setFormData({
                name: '',
                code: '',
                categoryId: '',
                unitOfMeasure: 'pcs',
                reorderLevel: 10,
                description: ''
            });
        } catch (error) {
            console.error('Error creating item:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory Items</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage store items and asset tracking</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add New Item
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card p-4 flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Package size={20} /></div>
                    <div>
                        <div className="text-lg font-bold">245</div>
                        <div className="text-xs text-gray-500">Total Items</div>
                    </div>
                </div>
                <div className="card p-4 flex items-center gap-4 border-l-4 border-l-red-500">
                    <div className="p-2 bg-red-100 rounded-lg text-red-600"><AlertTriangle size={20} /></div>
                    <div>
                        <div className="text-lg font-bold text-red-700">12</div>
                        <div className="text-xs text-gray-500">Low Stock</div>
                    </div>
                </div>
            </div>

            {/* Item Table */}
            <div className="card overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by code or name..."
                            className="input-field pl-10 h-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-secondary btn-sm flex items-center gap-2 text-xs">
                        <Settings size={14} />
                        Manage Categories
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                            <tr>
                                <th className="px-6 py-4">Item Name / Code</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">UOM</th>
                                <th className="px-6 py-4 text-center">Stock</th>
                                <th className="px-6 py-4 text-center">Reorder</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center">Loading inventory...</td></tr>
                            ) : items.length > 0 ? (
                                items.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{item.name}</div>
                                            <div className="text-xs text-gray-500 font-mono">{item.code}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.category_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 uppercase">{item.unit_of_measure}</td>
                                        <td className="px-6 py-4 text-center font-bold text-gray-900">{item.current_stock}</td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-500">{item.reorder_level}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.current_stock <= item.reorder_level
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'
                                                }`}>
                                                {item.current_stock <= item.reorder_level ? 'Low Stock' : 'In Stock'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 text-gray-400">
                                                <button className="hover:text-primary-600"><Edit size={16} /></button>
                                                <button className="hover:text-red-600"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No inventory items found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Item Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Add New Inventory Item</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
                        </div>
                        <form onSubmit={handleCreateItem} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Code</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                    <select
                                        required
                                        className="input-field"
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit of Measure</label>
                                    <select
                                        className="input-field"
                                        value={formData.unitOfMeasure}
                                        onChange={(e) => setFormData({ ...formData, unitOfMeasure: e.target.value })}
                                    >
                                        <option value="pcs">Pieces (Pcs)</option>
                                        <option value="kg">Kilograms (Kg)</option>
                                        <option value="ltr">Liters (Ltr)</option>
                                        <option value="box">Box</option>
                                        <option value="pack">Pack</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="input-field"
                                        value={formData.reorderLevel}
                                        onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Add Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemMaster;
