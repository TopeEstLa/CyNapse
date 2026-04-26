import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {api} from '../../../utils/api.js';
import {ArrowLeft, Loader2, Save} from 'lucide-react';

const AdminNewsEdit = () => {
    const {slug} = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(slug);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        author: '',
        publicationDate: new Date().toISOString().split('T')[0]
    });

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (isEdit) {
            fetchNews();
        }
    }, [slug]);

    const fetchNews = async () => {
        try {
            const data = await api.get(`/api/admin/news/get?slug=${slug}`);
            setFormData({
                id: data.id,
                title: data.title,
                slug: data.slug,
                content: data.content,
                author: data.author,
                publicationDate: data.publicationDate.split('T')[0]
            });
        } catch (err) {
            setError('Failed to fetch news article');
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        if (!isEdit) {
            setFormData({
                ...formData,
                title,
                slug: generateSlug(title)
            });
        } else {
            setFormData({...formData, title});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        const payload = {
            ...formData,
            publicationDate: new Date(formData.publicationDate).toISOString()
        };

        try {
            if (isEdit) {
                await api.post('/api/admin/news/update', payload);
                setSuccess('News article updated successfully');
            } else {
                await api.post('/api/admin/news/create', payload);
                setSuccess('News article created successfully');
                setTimeout(() => navigate('/admin/news'), 1500);
            }
        } catch (err) {
            setError(err.message || 'Failed to save news article');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading article...</div>;

    return (
        <div className="max-w-4xl mx-auto py-6">
            <header className="flex items-center gap-4 mb-8">
                <Link to="/admin/news" className="p-2 border rounded hover:bg-gray-50 text-gray-600">
                    <ArrowLeft size={20}/>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">{isEdit ? 'Edit Article' : 'Create New Article'}</h1>
                    <p className="text-gray-500">Publish news and updates to the platform.</p>
                </div>
            </header>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white border rounded shadow-sm p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={handleTitleChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-100 outline-none"
                            placeholder="Article title"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">URL Slug</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({...formData, slug: generateSlug(e.target.value)})}
                            className="w-full p-2 border rounded bg-gray-50 font-mono text-sm"
                            disabled={isEdit}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Author Name</label>
                        <input
                            type="text"
                            value={formData.author}
                            onChange={(e) => setFormData({...formData, author: e.target.value})}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-100 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Publication Date</label>
                        <input
                            type="date"
                            value={formData.publicationDate}
                            onChange={(e) => setFormData({...formData, publicationDate: e.target.value})}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-100 outline-none"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Content (Markdown supported)</label>
                    <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        placeholder="Write article content here..."
                        rows={15}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-100 outline-none font-medium"
                        required
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Link to="/admin/news" className="px-6 py-2 border rounded hover:bg-gray-50">Cancel</Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-8 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>}
                        {isEdit ? 'Update Article' : 'Publish Article'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminNewsEdit;
