import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { newsApi } from '../../utils/api';

const NewsDetail = () => {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const data = await newsApi.get(slug);
        setNews(data);
      } catch (err) {
        setError(err.message || 'Failed to load news');
      } finally {
        setLoading(false);
      }
    };
    fetchNewsDetail();
  }, [slug]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <div className="p-8 text-center">Loading news article...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!news) return <div className="p-8 text-center">News not found</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Link to="/news" className="text-blue-600 hover:underline mb-6 inline-block">← Back to all news</Link>
      
      <article className="bg-white p-8 border rounded shadow-sm">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-4xl font-bold mb-2">{news.title}</h1>
          <div className="text-gray-500 text-sm">
            <span>By {news.author}</span> • <span>{formatDate(news.publicationDate)}</span>
          </div>
        </header>

        <div className="prose max-w-none">
          <ReactMarkdown>{news.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default NewsDetail;
