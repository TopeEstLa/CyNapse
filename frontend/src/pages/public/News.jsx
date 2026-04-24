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
        <div className="text-center py-12">Loading news...</div>
      ) : filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNews.map((news) => (
            <div key={news.id} className="border p-6 rounded hover:shadow-lg transition-shadow bg-white">
              <div className="flex justify-between items-start mb-4 text-sm text-gray-500">
                <span>{formatDate(news.publicationDate)}</span>
                <span>By {news.author}</span>
              </div>
              <h2 className="text-2xl font-bold mb-3">{news.title}</h2>
              <Link 
                to={`/news/${news.slug}`} 
                className="text-blue-600 font-bold hover:underline"
              >
                Read full article →
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
