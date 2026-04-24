import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Train, Clock, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import { newsApi, transportApi } from '../../utils/api';

const Home = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [transportData, setTransportData] = useState(null);
  const [transportLoading, setTransportLoading] = useState(true);

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

    const fetchTransportData = async () => {
      try {
        const data = await transportApi.getNextRerA();
        setTransportData(data);
      } catch (err) {
        console.error('Failed to fetch transport data:', err);
      } finally {
        setTransportLoading(false);
      }
    };

    fetchLatestNews();
    fetchTransportData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-12 py-8">
      <section className="space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-2xl font-bold">Latest News</h2>
          <Link to="/news" className="text-blue-600 hover:underline">View all</Link>
        </div>

        {newsLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
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

      <section className="bg-gray-100 p-6 rounded-xl shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Train className="text-blue-600" /> {transportData?.line || 'RER A'} - {transportData?.station || 'Châtelet-Les Halles'}
          </h2>
          {!transportLoading && transportData && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${
              !transportData.degraded ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {!transportData.degraded ? (
                <><CheckCircle size={16} /> Traffic Fluid</>
              ) : (
                <><AlertTriangle size={16} /> Traffic Degraded</>
              )}
            </div>
          )}
        </div>

        {transportLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : transportData && transportData.departures ? (
          <div className="grid grid-cols-1 gap-4">
            {transportData.departures.slice(0, 6).map((dep, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border-l-4 border-blue-500 transition-all hover:shadow-md">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Destination</span>
                  <span className="font-bold text-lg text-gray-800 leading-tight">{dep.destination}</span>
                </div>
                
                <div className="flex items-center gap-4 sm:gap-8">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <MapPin size={12} /> Voie
                    </span>
                    <span className="bg-gray-100 text-gray-700 min-w-[32px] h-8 px-2 flex items-center justify-center rounded font-black text-sm">
                      {dep.platform === 'unknown' ? '-' : dep.platform}
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Clock size={12} /> Départ
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-lg font-black shadow-sm ${
                      dep.minutesUntilDeparture <= 2 
                        ? 'bg-red-100 text-red-600 animate-pulse' 
                        : 'bg-blue-600 text-white'
                    }`}>
                      {dep.minutesUntilDeparture} min
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg text-center text-gray-400 italic shadow-sm border border-dashed border-gray-300">
            No transport information available.
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
