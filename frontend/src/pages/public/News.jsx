import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { newsApi } from '../../utils/api';

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    title: searchParams.get('title') || '',
    author: searchParams.get('author') || '',
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
    return matchesTitle && matchesAuthor;
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const params = {};
    if (newFilters.title) params.title = newFilters.title;
    if (newFilters.author) params.author = newFilters.author;
    setSearchParams(params);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-8 py-8">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold">CyNapse Newsroom</h1>
        <p className="text-gray-600">Stay updated with the latest insights.</p>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-gray-50 p-4 rounded border">
        <input
          type="text"
          placeholder="Search by title..."
          value={filters.title}
          onChange={(e) => handleFilterChange('title', e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="text"
          placeholder="Filter by author..."
          value={filters.author}
          onChange={(e) => handleFilterChange('author', e.target.value)}
          className="border p-2 rounded flex-1"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Fetching News...</p>
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {filteredNews.map((news) => (
            <div key={news.id} className="group bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">
                    {formatDate(news.publicationDate)}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    By {news.author}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                  {news.title}
                </h2>
                <p className="text-gray-500 text-sm mb-8 line-clamp-3 font-medium">
                  {news.content?.substring(0, 150)}...
                </p>
              </div>
              <Link 
                to={`/news/${news.slug}`} 
                className="flex items-center justify-center w-full py-4 bg-gray-50 text-gray-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all group/btn"
              >
                Read full article
                <span className="ml-2 group-hover/btn:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No news found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default News;
