import React, { useState } from 'react';
import { Globe, Languages, Plus } from 'lucide-react';

const LanguageSettings: React.FC = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧', status: 'active' },
        { code: 'hi', name: 'Hindi', flag: '🇮🇳', status: 'active' },
        { code: 'ta', name: 'Tamil', flag: '🇮🇳', status: 'inactive' },
        { code: 'te', name: 'Telugu', flag: '🇮🇳', status: 'inactive' },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Language Settings</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage multi-language support</p>
                </div>
                <button className="btn-3d btn-3d-primary flex items-center gap-2">
                    <Plus size={20} />
                    Add Language
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {languages.map((lang) => (
                    <div key={lang.code} className="card-modern">
                        <div className="text-center">
                            <div className="text-6xl mb-4">{lang.flag}</div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">{lang.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-black ${lang.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                {lang.status}
                            </span>
                            <button className="mt-4 w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100">
                                Configure
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card-modern">
                <h3 className="text-xl font-black text-slate-900 mb-4">Translation Progress</h3>
                <div className="space-y-4">
                    {languages.filter(l => l.status === 'active').map((lang) => (
                        <div key={lang.code}>
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-slate-900">{lang.name}</span>
                                <span className="text-sm font-bold text-blue-600">85%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LanguageSettings;
