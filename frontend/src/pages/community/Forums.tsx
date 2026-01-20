import React from 'react';
import { MessageCircle, Plus, Users, MessageSquare } from 'lucide-react';

const Forums: React.FC = () => {
    const categories = [
        { id: 1, name: 'General Discussion', topics: 45, posts: 234, icon: '💬' },
        { id: 2, name: 'Academic Help', topics: 67, posts: 456, icon: '📚' },
        { id: 3, name: 'Events & Activities', topics: 34, posts: 189, icon: '🎉' },
        { id: 4, name: 'Parent Corner', topics: 23, posts: 145, icon: '👨‍👩‍👧' },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Forums & Discussion</h1>
                    <p className="text-slate-500 font-medium mt-1">Community discussions and Q&A</p>
                </div>
                <button className="btn-3d btn-3d-primary flex items-center gap-2">
                    <Plus size={20} />
                    New Topic
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="card-modern hover:shadow-2xl transition-all cursor-pointer">
                        <div className="flex items-start gap-4">
                            <div className="text-5xl">{cat.icon}</div>
                            <div className="flex-1">
                                <h3 className="text-xl font-black text-slate-900 mb-2">{cat.name}</h3>
                                <div className="flex gap-4 text-sm">
                                    <span className="text-slate-600 font-medium">
                                        <MessageSquare size={14} className="inline mr-1" />
                                        {cat.topics} topics
                                    </span>
                                    <span className="text-slate-600 font-medium">
                                        <Users size={14} className="inline mr-1" />
                                        {cat.posts} posts
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Forums;
