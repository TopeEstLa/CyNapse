import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../../utils/api.js';
import { Tag, Loader2, ArrowLeft, Save, AlertCircle, CheckCircle2, Calendar, User, Type, Link as LinkIcon } from 'lucide-react';

const AdminNewsEdit = () => {
  const { slug } = useParams();
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
      setFormData({ ...formData, title });
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 text-gray-900">
      <Link to="/admin/news" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to News Management
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Tag className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Article' : 'Create New Article'}</h1>
          <p className="text-sm text-gray-500">{isEdit ? `Editing: ${formData.title}` : 'Share a new update with the community'}</p>
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-2xl flex items-center gap-2 mb-6">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-secondary/10 border border-secondary/20 text-secondary px-4 py-3 rounded-2xl flex items-center gap-2 mb-6">
          <CheckCircle2 className="w-5 h-5" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Type className="w-4 h-4 text-gray-400" />
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter article title"
                className="w-full px-4 py-3 bg-background-light border border-transparent focus:bg-surface focus:border-primary rounded-xl outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-gray-400" />
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                placeholder="url-friendly-slug"
                className="w-full px-4 py-3 bg-background-light border border-transparent focus:bg-surface focus:border-primary rounded-xl outline-none transition-all font-mono text-xs"
                required
                disabled={isEdit}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Author name"
                className="w-full px-4 py-3 bg-background-light border border-transparent focus:bg-surface focus:border-primary rounded-xl outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                Publication Date
              </label>
              <input
                type="date"
                value={formData.publicationDate}
                onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
                className="w-full px-4 py-3 bg-background-light border border-transparent focus:bg-surface focus:border-primary rounded-xl outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your article content here..."
              rows={12}
              className="w-full px-4 py-3 bg-background-light border border-transparent focus:bg-surface focus:border-primary rounded-xl outline-none transition-all resize-none font-medium leading-relaxed"
              required
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEdit ? 'Update Article' : 'Publish Article'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminNewsEdit;
