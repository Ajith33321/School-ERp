import React from 'react';
import { MessageCircle, Users, Clock, Send } from 'lucide-react';

const LiveChat: React.FC = () => {
    return (
        <div className="space-y-8 pb-10">
            < div >
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Live Chat Support</h1>
                <p className="text-slate-500 font-medium mt-1">Real-time chat with students and parents</p>
            </div >

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat List */}
                <div className="lg:col-span-1 card-modern">
                    <h3 className="text-lg font-black text-slate-900 mb-4">Active Chats</h3>
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black">
                                        U{item}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-900">User {item}</p>
                                        <p className="text-xs text-slate-500">Last message...</p>
                                    </div>
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="lg:col-span-2 card-modern">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black">
                                U1
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900">User 1</h3>
                                <p className="text-xs text-green-600 font-bold">● Online</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="h-96 overflow-y-auto mb-4 space-y-4">
                        {[1, 2, 3].map((msg) => (
                            <div key={msg} className={msg % 2 === 0 ? "flex justify-end" : ""}>
                                <div className={`max-w-[70%] p-4 rounded-2xl ${msg % 2 === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-900'}`}>
                                    <p className="font-medium">This is a sample message {msg}</p>
                                    <p className="text-xs mt-1 opacity-70">10:{msg}0 AM</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="input-modern flex-1"
                        />
                        <button className="btn-3d btn-3d-primary px-6">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default LiveChat;
