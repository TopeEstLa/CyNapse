import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsApi } from '../../utils/api';

const Home = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const data = await newsApi.list();
        setLatestNews(data.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch news:', err);
      } finally {
        setNewsLoading(false);
      }
    };
    fetchLatestNews();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to CyNapse</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Intelligent IoT platform to manage your building infrastructure.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/monitoring" className="bg-blue-600 text-white px-6 py-2 rounded">Monitoring</Link>
          <Link to="/register" className="border border-gray-300 px-6 py-2 rounded">Register</Link>
        </div>
      </section>

      {/* Latest News */}
      <section className="space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-2xl font-bold">Latest News</h2>
          <Link to="/news" className="text-blue-600 hover:underline">View all</Link>
        </div>

        {newsLoading ? (
          <div>Loading news...</div>
        ) : latestNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latestNews.map((news) => (
            <div key={news.id} className="border p-4 rounded hover:shadow-md transition-shadow">
              <span className="text-sm text-gray-500">{formatDate(news.publicationDate)}</span>
              <h3 className="text-xl font-semibold mt-1">{news.title}</h3>
              <Link to={`/news/${news.slug}`} className="text-blue-600 mt-4 inline-block">Read more →</Link>
            </div>
          ))}
          </div>        ) : (
          <p>No news available.</p>
        )}
      </section>

      {/* Train Widget Placeholder (as requested in GEMINI.md) */}
      <section className="bg-gray-100 p-6 rounded text-center">
        <h2 className="text-xl font-bold mb-2">Next Trains (Cergy Prefecture)</h2>
        <p className="text-gray-500italic">[Widget placeholder: Train/RER times will appear here]</p>
      </section>
    </div>
  );
};

export default Home;
