import React, { useState } from 'react';
import { Calculator, Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { cn } from '../../utils/cn';

const AccountsFinance: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Accounts & Finance</h1>
                    <p className="text-slate-500 font-medium mt-1">Complete accounting and financial management</p>
                </div>
                <button className="btn-3d btn-3d-primary flex items-center gap-2">
                    <Plus size={20} />
                    New Voucher
                </button>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Income', value: '₹45.2L', change: '+12.5%', icon: TrendingUp, positive: true },
                    { label: 'Total Expenses', value: '₹28.7L', change: '+8.2%', icon: TrendingDown, positive: false },
                    { label: 'Net Profit', value: '₹16.5L', change: '+18.3%', icon: DollarSign, positive: true },
                    { label: 'Pending Payments', value: '₹5.2L', change: '-5.1%', icon: Calculator, positive: true },
                ].map((stat, idx) => (
                    <div key={idx} className="card-modern">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-bold text-slate-500 uppercase">{stat.label}</p>
                            <stat.icon size={20} className={stat.positive ? 'text-green-500' : 'text-red-500'} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">{stat.value}</h3>
                        <span className={cn("text-sm font-bold", stat.positive ? "text-green-600" : "text-red-600")}>
                            {stat.change}
                        </span>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Chart of Accounts', desc: 'Manage account ledgers', color: 'blue' },
                    { title: 'Voucher Entry', desc: 'Record transactions', color: 'green' },
                    { title: 'Financial Reports', desc: 'View P&L, Balance Sheet', color: 'purple' },
                ].map((action, idx) => (
                    <div key={idx} className="card-modern hover:shadow-2xl transition-all cursor-pointer group">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 flex items-center justify-center mb-4`}>
                            <Calculator className="text-white" size={24} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-2">{action.title}</h3>
                        <p className="text-slate-600 font-medium">{action.desc}</p>
                    </div>
                ))}
            </div>

            {/* Recent Transactions */}
            <div className="card-modern">
                <h3 className="text-xl font-black text-slate-900 mb-6">Recent Transactions</h3>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div>
                                <p className="font-bold text-slate-900">Transaction #{item}</p>
                                <p className="text-sm text-slate-500">2024-01-{item.toString().padStart(2, '0')}</p>
                            </div>
                            <span className="text-lg font-black text-green-600">+₹{item * 1000}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AccountsFinance;
