import React from 'react';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl animate-float">
                    <span className="text-4xl">🚧</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900">{title}</h1>
                <p className="text-slate-500 font-medium">This module is under development</p>
                <div className="flex gap-2 justify-center mt-6">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        </div>
    );
};

export default PlaceholderPage;
