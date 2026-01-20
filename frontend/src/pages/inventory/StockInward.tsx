import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Truck,
    Calendar,
    FileText,
    Trash2,
    Save,
    Package
} from 'lucide-react';
import { cn } from '../../utils/cn';
import api from '../../services/api';

const StockInward: React.FC = () => {
    const [vendors, setVendors] = useState<any[]>([]);
    const [items, setItems] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);

    // Form state
    const [stockInInfo, setStockInInfo] = useState({
        vendorId: '',
        billNumber: '',
        billDate: new Date().toISOString().split('T')[0],
        totalAmount: 0,
        remarks: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [vendorsRes, itemsRes] = await Promise.all([
                api.get('inventory/vendors'),
                api.get('inventory/items')
            ]);
            setVendors(vendorsRes.data.data);
            setItems(itemsRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const addItemSelected = () => {
        setSelectedItems([...selectedItems, { itemId: '', quantity: 1, unitPrice: 0 }]);
    };

    const removeItem = (index: number) => {
        setSelectedItems(selectedItems.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...selectedItems];
        newItems[index][field] = value;
        setSelectedItems(newItems);

        // Update total amount
        const total = newItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
        setStockInInfo({ ...stockInInfo, totalAmount: total });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('inventory/stock-in', {
                ...stockInInfo,
                items: selectedItems
            });
            alert('Stock added successfully!');
            // Reset form
            setSelectedItems([]);
            setStockInInfo({
                vendorId: '',
                billNumber: '',
                billDate: new Date().toISOString().split('T')[0],
                totalAmount: 0,
                remarks: ''
            });
        } catch (error) {
            console.error('Error adding stock:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Stock Inward (Purchase)</h1>
                    <p className="text-gray-500 text-sm mt-1">Record new purchases and replenish stock</p>
                </div>
                <button className="btn-secondary flex items-center gap-2">
                    <FileText size={18} />
                    View Purchase History
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header Information */}
                <div className="card p-6">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4 tracking-wider">Purchase Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor *</label>
                            <div className="relative">
                                <Truck className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400" size={18} />
                                <select
                                    required
                                    className="input-field pl-10"
                                    value={stockInInfo.vendorId}
                                    onChange={(e) => setStockInInfo({ ...stockInInfo, vendorId: e.target.value })}
                                >
                                    <option value="">Select Vendor</option>
                                    {vendors.map(v => (
                                        <option key={v.id} value={v.id}>{v.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bill/Invoice Number *</label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                placeholder="INV-2024-001"
                                value={stockInInfo.billNumber}
                                onChange={(e) => setStockInInfo({ ...stockInInfo, billNumber: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bill Date *</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="date"
                                    required
                                    className="input-field pl-10"
                                    value={stockInInfo.billDate}
                                    onChange={(e) => setStockInInfo({ ...stockInInfo, billDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount ($)</label>
                            <input
                                type="number"
                                readOnly
                                className="input-field bg-gray-50 font-bold"
                                value={stockInInfo.totalAmount}
                            />
                        </div>
                    </div>
                </div>

                {/* Items Grid */}
                <div className="card overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Item Details</h3>
                        <button
                            type="button"
                            onClick={addItemSelected}
                            className="btn-primary btn-sm flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Add Row
                        </button>
                    </div>
                    <div className="p-6">
                        {selectedItems.length > 0 ? (
                            <div className="space-y-4">
                                {selectedItems.map((selected, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-4 items-end animate-in fade-in slide-in-from-top-2">
                                        <div className="col-span-12 md:col-span-5">
                                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Item *</label>
                                            <select
                                                required
                                                className="input-field"
                                                value={selected.itemId}
                                                onChange={(e) => updateItem(index, 'itemId', e.target.value)}
                                            >
                                                <option value="">Select Item</option>
                                                {items.map(item => (
                                                    <option key={item.id} value={item.id}>{item.name} ({item.code})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-span-12 md:col-span-2">
                                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Quantity *</label>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                className="input-field text-center"
                                                value={selected.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div className="col-span-12 md:col-span-2">
                                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Unit Price ($) *</label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                step="0.01"
                                                className="input-field text-right"
                                                value={selected.unitPrice}
                                                onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                                            />
                                        </div>
                                        <div className="col-span-12 md:col-span-2">
                                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Subtotal</label>
                                            <div className="input-field bg-gray-50 text-right font-medium">
                                                {(selected.quantity * selected.unitPrice).toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="col-span-12 md:col-span-1 py-1">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
                                <Package className="mx-auto text-gray-300 mb-3" size={48} />
                                <p className="text-gray-500">No items added to this purchase record.</p>
                                <button
                                    type="button"
                                    onClick={addItemSelected}
                                    className="text-primary-600 font-medium hover:underline text-sm mt-1"
                                >
                                    Click here to add the first item
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Remarks & Footer */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-1 card p-6 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Remarks</label>
                        <textarea
                            rows={3}
                            className="input-field"
                            placeholder="Add notes about this purchase..."
                            value={stockInInfo.remarks}
                            onChange={(e) => setStockInInfo({ ...stockInInfo, remarks: e.target.value })}
                        ></textarea>
                    </div>
                    <div className="w-full md:w-64 space-y-3">
                        <button
                            type="submit"
                            disabled={selectedItems.length === 0}
                            className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary-200"
                        >
                            <Save size={20} />
                            Save Record
                        </button>
                        <button type="button" className="btn-secondary w-full py-3">Discard</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default StockInward;
