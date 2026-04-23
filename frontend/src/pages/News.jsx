import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, User, Search, Loader2, X, Tag } from 'lucide-react';
import { newsApi } from '../utils/api';

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    title: searchParams.get('title') || '',
    author: searchParams.get('author') || '',
    date: searchParams.get('date') || ''
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await newsApi.list();
      setNewsList(data);
    } catch (err) {
      console.error('Failed to fetch news:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = newsList.filter(news => {
    const matchesTitle = news.title.toLowerCase().includes(filters.title.toLowerCase());
    const matchesAuthor = news.author.toLowerCase().includes(filters.author.toLowerCase());
    const matchesDate = filters.date ? news.publicationDate.includes(filters.date) : true;
    return matchesTitle && matchesAuthor && matchesDate;
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = {};
    if (newFilters.title) params.title = newFilters.title;
    if (newFilters.author) params.author = newFilters.author;
    if (newFilters.date) params.date = newFilters.date;
    setSearchParams(params);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (selectedArticle) {
    return (
      <div className="relative min-h-screen overflow-hidden pt-12 pb-24">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-80 h-80 bg-primary/10 rotate-12 border-2 border-primary/5 rounded-3xl animate-move-slow" />
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-secondary/5 border-2 border-secondary/5 rounded-full animate-move-reverse" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <button 
            onClick={() => setSelectedArticle(null)}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Newsroom
          </button>

          <article className="bg-surface/60 backdrop-blur-xl border border-white/40 rounded-[3rem] p-8 md:p-16 shadow-2xl">
            <header className="mb-12">
              <div className="flex items-center gap-6 mb-8">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{formatDate(selectedArticle.publicationDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <User className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">By {selectedArticle.author}</span>
                  </div>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                {selectedArticle.title}
              </h1>
            </header>

            <div className="prose prose-slate prose-lg max-w-none">
              {selectedArticle.content.split('\n').map((paragraph, i) => (
                paragraph.trim() && (
                  <p key={i} className="text-gray-600 leading-relaxed mb-6 font-medium">
                    {paragraph.trim()}
                  </p>
                )
              ))}
            </div>

            <footer className="mt-16 pt-12 border-t border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-background-light flex items-center justify-center font-bold text-slate-400">
                  {selectedArticle.author.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-black text-gray-900 uppercase">{selectedArticle.author}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Contributor</p>
                </div>
              </div>
            </footer>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden pt-12 pb-24">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-80 h-80 bg-primary/20 rotate-12 border-2 border-primary/10 rounded-3xl animate-move-slow" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-secondary/10 border-2 border-secondary/10 rounded-full animate-move-reverse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <header className="mb-12 text-center md:text-left">
          <h2 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-3">Insights & Updates</h2>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight">CyNapse Newsroom</h1>
        </header>

        {/* Filters */}
        <div className="bg-surface/40 backdrop-blur-md border border-gray-100 rounded-[2rem] p-6 mb-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by title..."
                value={filters.title}
                onChange={(e) => handleFilterChange('title', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              />
            </div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Filter by author..."
                value={filters.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading insights...</p>
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {filteredNews.map((news, i) => (
              <div 
                key={news.id} 
                onClick={() => setSelectedArticle(news)}
                className="group bg-surface/40 backdrop-blur-md border border-gray-100 rounded-[3rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer hover:-translate-y-2"
              >
                <div className="p-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                        <Tag className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{formatDate(news.publicationDate)}</span>
                    </div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">By {news.author}</span>
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 mb-6 group-hover:text-primary transition-colors leading-tight">
                    {news.title}
                  </h2>
                  <p className="text-gray-500 font-medium leading-relaxed mb-10 line-clamp-3 flex-1">
                    {news.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900 group-hover:gap-4 transition-all">
                    Read full article
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-surface/20 backdrop-blur-sm rounded-[3rem] border border-dashed border-gray-200">
            <X className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No news found</h3>
            <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
            <button 
              onClick={() => {
                setFilters({ title: '', author: '', date: '' });
                setSearchParams({});
              }}
              className="mt-6 text-primary font-bold uppercase tracking-widest text-xs hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
