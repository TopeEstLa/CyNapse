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
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-[0.2em] mb-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600"></span>
          </span>
          System Online
        </div>
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
          Welcome to <span className="text-blue-600">CyNapse</span>
        </h1>
        <p className="max-w-lg mx-auto text-gray-500 font-medium text-xs md:text-sm">
          The central nervous system for your smart ecosystem.
        </p>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

        {/* Left: Latest News */}
        <section className="space-y-6 lg:space-y-8">
          <div className="flex items-end justify-between px-2">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">Latest News</h2>
              <p className="text-gray-500 font-medium text-xs md:text-sm">Inside the CyNapse ecosystem.</p>
            </div>
            <Link to="/news" className="group p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
              <ChevronRight size={18} md:size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3 md:space-y-4">
            {newsLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-20 md:h-24 bg-gray-100 rounded-[1.5rem] md:rounded-[2rem] animate-pulse"></div>
              ))
            ) : latestNews.length > 0 ? (
              latestNews.map((news) => (
                <Link 
                  key={news.id} 
                  to={`/news/${news.slug}`}
                  className="group flex items-center bg-white p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300"
                >
                  <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                    <Newspaper size={20} md:size={24} />
                  </div>
                  <div className="ml-4 md:ml-5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5 md:mb-1">
                      <span className="text-[8px] md:text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50/50 px-1.5 md:px-2 py-0.5 rounded-lg">Update</span>
                      <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest">{formatDate(news.publicationDate)}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 text-sm md:text-base tracking-tight uppercase">
                      {news.title}
                    </h3>
                  </div>
                  <ChevronRight size={14} md:size={16} className="text-gray-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all ml-3 md:ml-4 flex-shrink-0" />
                </Link>
              ))
            ) : (
              <div className="py-12 md:py-20 text-center bg-gray-50 rounded-[2rem] md:rounded-[2.5rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">Empty Feed</p>
              </div>
            )}

            <Link 
              to="/news" 
              className="flex items-center justify-center w-full py-4 md:py-5 bg-white text-gray-900 border border-gray-200 rounded-[1.5rem] md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-gray-200/50 mt-4 md:mt-6 active:scale-95"
            >
              Enter Newsroom
            </Link>
          </div>
        </section>

        {/* Right: Network Mobility */}
        <section className="space-y-6 lg:space-y-8">
          <div className="flex items-end justify-between px-2">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">Network Mobility</h2>
              <p className="text-gray-500 font-medium text-xs md:text-sm">Real-time RER A departures at Châtelet.</p>
            </div>
            {!transportLoading && transportData && (
              <div className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-widest border ${
                !transportData.degraded 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                  : 'bg-amber-50 text-amber-700 border-amber-100'
              }`}>
                {!transportData.degraded ? <CheckCircle size={10} className="md:w-3 md:h-3" /> : <AlertTriangle size={10} className="md:w-3 md:h-3" />}
                <span className="hidden xs:inline">{transportData.degraded ? 'Delay' : 'Live'}</span>
              </div>
            )}
          </div>

          <div className="bg-gray-900 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 shadow-2xl relative overflow-hidden h-full min-h-[350px] md:min-h-[400px]">
            <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5">
               <Globe size={120} md:size={180} strokeWidth={0.5} className="text-white" />
            </div>

            {transportLoading ? (
              <div className="flex flex-col items-center justify-center h-full py-12 md:py-20">
                <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-blue-200 font-bold uppercase tracking-widest text-[8px] md:text-[9px]">Synchronizing...</p>
              </div>
            ) : transportData && transportData.departures ? (
              <div className="space-y-2 md:space-y-3 relative z-10">
                {transportData.departures.slice(0, 5).map((dep, index) => (
                  <div key={index} className="group bg-white/5 backdrop-blur-sm p-4 md:p-5 rounded-xl md:rounded-2xl flex items-center justify-between border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all gap-3 md:gap-4">
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[8px] md:text-[9px] text-gray-500 font-black uppercase tracking-widest mb-0.5 truncate">To</span>
                      <span className="font-bold text-white text-sm md:text-base tracking-tight truncate group-hover:text-blue-400 transition-colors">{dep.destination}</span>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
                      <div className="flex flex-col items-center">
                        <span className="text-[7px] md:text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Track</span>
                        <span className="bg-white/10 text-white min-w-[24px] md:min-w-[28px] h-6 md:h-7 px-1 flex items-center justify-center rounded-lg font-black text-[10px] md:text-xs border border-white/10">
                          {dep.platform === 'unknown' ? '-' : dep.platform}
                        </span>
                      </div>

                      <div className="flex flex-col items-end min-w-[50px] md:min-w-[70px]">
                        <span className="text-[7px] md:text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Time</span>
                        <span className={`px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-[10px] md:text-xs font-black shadow-lg ${
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
      </div>
    </div>
  );
};

export default Home;
