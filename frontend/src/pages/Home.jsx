import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  ArrowRight,
  Zap,
  Globe,
  Database,
  Loader2,
  Tag
} from 'lucide-react';
import { newsApi } from '../utils/api';

const Home = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const data = await newsApi.list();
        // Take only the 2 most recent news
        setLatestNews(data.slice(0, 2));
      } catch (err) {
        console.error('Failed to fetch news:', err);
      } finally {
        setNewsLoading(false);
      }
    };
    fetchLatestNews();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const features = [
    { icon: Building2, title: "Building Management", desc: "Complete supervision of your infrastructures by floor and room." },
    { icon: Cpu, title: "IoT Sensors", desc: "Precise monitoring of temperature, CO2, and occupancy." },
    { icon: Activity, title: "Real-time", desc: "Visualize data instantly with automatic updates." },
    { icon: ShieldCheck, title: "Security", desc: "Smart alerts and granular user access management." }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Geometric Shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-80 h-80 bg-primary/10 rotate-12 border-2 border-primary/5 rounded-3xl animate-move-slow" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-secondary/10 border-2 border-secondary/5 rounded-full animate-move-reverse" />
        <div className="absolute top-[40%] right-[20%] w-32 h-32 bg-warning/10 rotate-45 border border-warning/10 animate-move-slow" />
        <div className="absolute top-[60%] -left-10 w-56 h-56 bg-primary/10 -rotate-12 border-2 border-primary/10 rounded-[3rem] animate-move-reverse" />
        <div 
          className="absolute top-[30%] -left-12 w-40 h-40 bg-danger/10 animate-move-slow opacity-60" 
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
        />
        <div className="absolute -bottom-20 right-20 w-[30rem] h-[30rem] bg-warning/5 rotate-[30deg] border-2 border-warning/5 rounded-[5rem] animate-move-slow" />
        <div className="absolute bottom-[10%] left-[35%] w-20 h-20 bg-primary/10 rotate-[15deg] border border-primary/20 animate-move-reverse" />
      </div>

      <div className="relative z-10 space-y-16 md:space-y-24 py-10">
        {/* Hero Section */}
        <section className="text-center space-y-8 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest mx-auto">
            <Zap className="w-3 h-3 fill-primary" />
            New: Sensor monitoring
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight">
            Intelligence at the service <br className="hidden md:block" />
            <span className="text-primary">of your building.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
            Optimize your space management with CyNapse. A powerful IoT platform to monitor, analyze, and secure your environment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/monitoring"
              className="w-full sm:w-auto px-8 py-4 bg-background-dark text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-black transition-colors shadow-xl shadow-gray-200"
            >
              Access Dashboard
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-surface border border-gray-200 text-gray-900 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-gray-50 transition-colors"
            >
              Create an account
            </Link>
          </div>
        </section>

        {/* Stats/Badge Row */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 px-4 py-8 border-y border-gray-100 bg-surface/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-300" />
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Global Access</span>
          </div>
          <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-gray-300" />
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Real-time Data</span>
          </div>
          <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-gray-300" />
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">High Security</span>
          </div>
        </div>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="p-8 bg-surface/70 backdrop-blur-sm rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Bottom CTA */}
        <section className="px-4 max-w-5xl mx-auto mb-24">
          <div className="bg-background-dark rounded-[3rem] p-8 md:p-16 text-center space-y-8 text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <Building2 className="w-96 h-96 -translate-x-20 -translate-y-20 rotate-12" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight relative z-10">Ready to transform your offices?</h2>
              <p className="text-gray-400 font-medium max-w-xl mx-auto relative z-10">
                Join the dozens of companies that trust CyNapse for their digital transition.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-primary/90 transition-all shadow-2xl shadow-primary/20 relative z-10"
              >
                Start now
                <ArrowRight className="w-4 h-4" />
              </Link>
          </div>
        </section>

        {/* Actualities Section */}
        <section className="px-4 max-w-7xl mx-auto pb-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-3">Actualities</h2>
              <h3 className="text-4xl font-black text-gray-900 tracking-tight">Stay updated with <br/> the latest insights.</h3>
            </div>
            <Link to="/news" className="group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors">
              View all news
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {newsLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Fetching latest stories...</p>
            </div>
          ) : latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestNews.map((news, i) => (
                <Link 
                  key={news.id} 
                  to={`/news?title=${encodeURIComponent(news.title)}`}
                  className="group bg-surface/40 backdrop-blur-md border border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all hover:-translate-y-2"
                >
                  <div className="p-8 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{formatDate(news.publicationDate)}</span>
                      <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Article</span>
                    </div>
                    <h4 className="text-xl font-black text-gray-900 mb-4 group-hover:text-primary transition-colors leading-tight">{news.title}</h4>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8 line-clamp-2 flex-1">
                      {news.content.substring(0, 120)}...
                    </p>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900 group-hover:gap-4 transition-all">
                      Read more
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
               <p className="text-gray-400 font-medium">No recent news available.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
