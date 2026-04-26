import React, {useEffect, useState} from 'react';
import {api} from '../../../utils/api.js';
import {Edit2, Plus, Search, Trash2} from 'lucide-react';
import {Link} from 'react-router-dom';

const AdminNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const data = await api.get('/api/admin/news/list');
            setNews(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this news article?')) return;
        try {
            await api.delete(`/api/admin/news/delete?id=${id}`);
            setNews(news.filter(n => n.id !== id));
        } catch (err) {
            alert('Failed to delete news: ' + err.message);
        }
    };

    const filteredNews = news.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center">Loading news management...</div>;

    return (
        <div className="space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">News Management</h1>
                    <p className="text-gray-500">Create, update or remove platform news.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/>
                        <input
                            type="text"
                            placeholder="Search news..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded text-sm w-full sm:w-64"
                        />
                    </div>
                    <Link to="/admin/news/create"
                          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
                        <Plus size={16}/> New Article
                    </Link>
                </div>
            </header>

            <div className="bg-white border rounded overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase">
                    <tr>
                        <th className="px-6 py-3">Article Title</th>
                        <th className="px-6 py-3">Author</th>
                        <th className="px-6 py-3">Publication Date</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {filteredNews.length > 0 ? filteredNews.map((n) => (
                        <tr key={n.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <div className="font-medium text-gray-900">{n.title}</div>
                                <div className="text-xs text-gray-400">slug: {n.slug}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{n.author}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                {new Date(n.publicationDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <Link to={`/admin/news/edit/${n.slug}`}
                                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                                        <Edit2 size={16}/>
                                    </Link>
                                    <button onClick={() => handleDelete(n.id)}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="4" className="px-6 py-12 text-center text-gray-400">No news articles found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminNews;
