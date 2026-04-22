import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  ArrowRight,
  Zap,
  Globe,
  Database
} from 'lucide-react';

const Home = () => {
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
        {/* Animated Purple Box - Top Right */}
        <div className="absolute top-10 right-10 w-80 h-80 bg-purple-200/20 rotate-12 border-2 border-purple-300/10 rounded-3xl animate-move-slow" />
        
        {/* Animated Blue Circle - Bottom Left */}
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-blue-200/10 border-2 border-blue-300/10 rounded-full animate-move-reverse" />
        
        {/* Static/Animated Pink Accent - Middle Right */}
        <div className="absolute top-[40%] right-[20%] w-32 h-32 bg-pink-100/10 rotate-45 border border-pink-200/20 animate-move-slow" />

        {/* New: Emerald Diamond - Middle Left */}
        <div className="absolute top-[60%] -left-10 w-56 h-56 bg-emerald-100/20 -rotate-12 border-2 border-emerald-200/20 rounded-[3rem] animate-move-reverse" />

        {/* New: Red Triangle - Left Side */}
        <div 
          className="absolute top-[30%] -left-12 w-40 h-40 bg-red-100/15 animate-move-slow opacity-60" 
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
        />

        {/* New: Large Amber Box - Bottom Right */}
        <div className="absolute -bottom-20 right-20 w-[30rem] h-[30rem] bg-amber-100/10 rotate-[30deg] border-2 border-amber-200/10 rounded-[5rem] animate-move-slow" />

        {/* New: Indigo Square - Bottom Center-Left */}
        <div className="absolute bottom-[10%] left-[35%] w-20 h-20 bg-indigo-100/20 rotate-[15deg] border border-indigo-200/30 animate-move-reverse" />
        
        {/* Simple line accents */}
        <div className="absolute top-[15%] left-[15%] w-40 h-1 bg-slate-200/30 -rotate-45" />
        <div className="absolute bottom-[30%] right-[30%] w-1 h-32 bg-slate-200/30 rotate-12" />
        <div className="absolute top-[70%] left-[25%] w-24 h-px bg-slate-200/40 rotate-90" />
      </div>

      <div className="relative z-10 space-y-16 md:space-y-24 py-10">
        {/* Hero Section */}
        <section className="text-center space-y-8 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-xs font-black uppercase tracking-widest mx-auto">
            <Zap className="w-3 h-3 fill-accent" />
            New: Sensor monitoring
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight">
            Intelligence at the service <br className="hidden md:block" />
            <span className="text-accent">of your building.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
            Optimize your space management with CyNapse. A powerful IoT platform to monitor, analyze, and secure your environment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/monitoring"
              className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-black transition-colors shadow-xl shadow-gray-200"
            >
              Access Dashboard
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-gray-50 transition-colors"
            >
              Create an account
            </Link>
          </div>
        </section>

        {/* Stats/Badge Row */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 px-4 py-8 border-y border-gray-100 bg-white/30 backdrop-blur-sm">
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
            <div key={i} className="p-8 bg-white/70 backdrop-blur-sm rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Bottom CTA */}
        <section className="px-4 max-w-5xl mx-auto mb-24">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-center space-y-8 text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <Building2 className="w-96 h-96 -translate-x-20 -translate-y-20 rotate-12" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight relative z-10">Ready to transform your offices?</h2>
              <p className="text-slate-400 font-medium max-w-xl mx-auto relative z-10">
                Join the dozens of companies that trust CyNapse for their digital transition.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-3 px-10 py-5 bg-accent text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-accent/90 transition-all shadow-2xl shadow-accent/20 relative z-10"
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
              <h2 className="text-sm font-black text-accent uppercase tracking-[0.2em] mb-3">Actualities</h2>
              <h3 className="text-4xl font-black text-gray-900 tracking-tight">Stay updated with <br/> the latest insights.</h3>
            </div>
            <Link to="/news" className="group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-accent transition-colors">
              View all news
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                date: "Apr 22, 2026",
                title: "CyNapse Gaming LAN: Return to Cauchy",
                desc: "Get ready for the biggest gaming event of the year at CY Tech Cergy. Compete, connect, and win big at Cauchy.",
                tag: "Event"
              },
              {
                date: "Apr 18, 2026",
                title: "Optimizing Energy with Smart Sensors",
                desc: "Discover how our latest updates help buildings reduce energy waste by 30% using real-time occupancy data.",
                tag: "Innovation"
              }
            ].map((news, i) => (
              <div key={i} className="group bg-white/40 backdrop-blur-md border border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-accent/5 transition-all hover:-translate-y-2">
                <div className="p-8 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{news.date}</span>
                    <span className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-full">{news.tag}</span>
                  </div>
                  <h4 className="text-xl font-black text-gray-900 mb-4 group-hover:text-accent transition-colors leading-tight">{news.title}</h4>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8 flex-1">{news.desc}</p>
                  <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900 group-hover:gap-4 transition-all">
                    Read more
                    <ArrowRight className="w-4 h-4 text-accent" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
