import React from 'react';
import { Image as ImageIcon, Upload, FolderOpen, Grid } from 'lucide-react';

const Gallery: React.FC = () => {
    const albums = [
        { id: 1, name: 'Annual Day 2024', photos: 45, cover: '🎭' },
        { id: 2, name: 'Sports Day', photos: 67, cover: '⚽' },
        { id: 3, name: 'Science Exhibition', photos: 34, cover: '🔬' },
        { id: 4, name: 'Cultural Fest', photos: 89, cover: '🎨' },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Gallery</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage school photos and albums</p>
                </div>
                <button className="btn-3d btn-3d-primary flex items-center gap-2">
                    <Upload size={20} />
                    Upload Photos
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {albums.map((album) => (
                    <div key={album.id} className="card-modern group hover:shadow-2xl transition-all cursor-pointer">
                        <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4 text-6xl">
                            {album.cover}
                        </div>
                        <h3 className="font-black text-slate-900 mb-1">{album.name}</h3>
                        <p className="text-sm text-slate-500 font-bold">{album.photos} photos</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
