import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Train, 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  Globe, 
  ArrowRight,
  Newspaper,
  Calendar,
  ChevronRight
} from 'lucide-react';
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
        setLatestNews(data.slice(0, 3));
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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-12 pb-20 animate-fade-in pt-12">
      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left: Network Mobility */}
        <section className="space-y-8">
          <div className="flex items-end justify-between px-2">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Network Mobility</h2>
              <p className="text-gray-500 font-medium text-sm">Real-time RER A departures at Châtelet.</p>
            </div>
            {!transportLoading && transportData && (
              <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border ${
                !transportData.degraded 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                  : 'bg-amber-50 text-amber-700 border-amber-100'
              }`}>
                {!transportData.degraded ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                {transportData.degraded ? 'Delay' : 'Live'}
              </div>
            )}
          </div>

          <div className="bg-gray-900 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden h-full min-h-[400px]">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Globe size={180} strokeWidth={0.5} className="text-white" />
            </div>

            {transportLoading ? (
              <div className="flex flex-col items-center justify-center h-full py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-blue-200 font-bold uppercase tracking-widest text-[9px]">Synchronizing...</p>
              </div>
            ) : transportData && transportData.departures ? (
              <div className="space-y-3 relative z-10">
                {transportData.departures.slice(0, 5).map((dep, index) => (
                  <div key={index} className="group bg-white/5 backdrop-blur-sm p-5 rounded-2xl flex items-center justify-between border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all gap-4">
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-0.5 truncate">To</span>
                      <span className="font-bold text-white text-base tracking-tight truncate group-hover:text-blue-400 transition-colors">{dep.destination}</span>
                    </div>
                    
                    <div className="flex items-center gap-6 flex-shrink-0">
                      <div className="flex flex-col items-center">
                        <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Track</span>
                        <span className="bg-white/10 text-white min-w-[28px] h-7 px-1.5 flex items-center justify-center rounded-lg font-black text-xs border border-white/10">
                          {dep.platform === 'unknown' ? '-' : dep.platform}
                        </span>
                      </div>
                      
                      <div className="flex flex-col items-end min-w-[70px]">
                        <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Time</span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-black shadow-lg ${
                          dep.minutesUntilDeparture <= 2 
                            ? 'bg-red-500 text-white animate-pulse' 
                            : 'bg-blue-600 text-white'
                        }`}>
                          {dep.minutesUntilDeparture}m
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 italic">No signal.</div>
            )}
          </div>
        </section>

        {/* Right: Latest News */}
        <section className="space-y-8">
          <div className="flex items-end justify-between px-2">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Latest News</h2>
              <p className="text-gray-500 font-medium text-sm">Inside the CyNapse ecosystem.</p>
            </div>
            <Link to="/news" className="group p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-4">
            {newsLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-100 rounded-[2rem] animate-pulse"></div>
              ))
            ) : latestNews.length > 0 ? (
              latestNews.map((news) => (
                <Link 
                  key={news.id} 
                  to={`/news/${news.slug}`}
                  className="group flex items-center bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300"
                >
                  <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                    <Newspaper size={24} />
                  </div>
                  <div className="ml-5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50/50 px-2 py-0.5 rounded-lg">Update</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{formatDate(news.publicationDate)}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 text-base tracking-tight uppercase">
                      {news.title}
                    </h3>
                  </div>
                  <ChevronRight size={16} className="text-gray-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all ml-4" />
                </Link>
              ))
            ) : (
              <div className="py-20 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Empty Feed</p>
              </div>
            )}
            
            <Link 
              to="/news" 
              className="flex items-center justify-center w-full py-5 bg-white text-gray-900 border border-gray-200 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-gray-200/50 mt-6 active:scale-95"
            >
              Enter Newsroom
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
