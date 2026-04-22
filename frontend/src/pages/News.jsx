import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Zap, Shield, TrendingUp, Cpu, Calendar, Tag, ChevronRight } from 'lucide-react';

const News = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const allNews = [
    {
      id: 3,
      date: "Apr 22, 2026",
      title: "CyNapse Gaming LAN: Return to Cauchy",
      tag: "Event",
      icon: TrendingUp,
      summary: "Get ready for the biggest gaming event of the year at CY Tech Cergy. Compete, connect, and win big at Cauchy.",
      content: `
        The legend returns. CyNapse is proud to announce the 'Cauchy Clash 2026', a massive 48-hour gaming LAN event taking place at the heart of CY Tech Cergy. 
        
        The historic Cauchy Amphitheater and its surrounding rooms will be transformed into a high-tech gaming arena, powered by CyNapse's ultra-low latency infrastructure.

        Event Details:
        - Dates: May 22-24, 2026
        - Location: Cauchy Complex, CY Tech Campus, Cergy.
        - Tournaments: League of Legends, Valorant, Rocket League, and a special Smash Bros. Ultimate bracket in the main amphi.
        - Connectivity: 10Gbps dedicated fiber line and custom-configured CyNapse monitoring to ensure zero lag during high-stakes matches.

        "We wanted to give back to the student community that helped us test our early sensor prototypes," says the event coordinator. "Cauchy is where CyNapse was born, so it's only fitting that we host the biggest LAN in Cergy right here."

        Registration opens next week. Whether you're a hardcore competitor or a casual player, there's a place for you. Don't miss out on the legendary midnight pizza run and the 'Amphi-After-Dark' casual gaming sessions!
      `
    },
    {
      id: 1,
      date: "Apr 18, 2026",
      title: "Optimizing Energy with Smart Sensors",
      tag: "Innovation",
      icon: Zap,
      summary: "Discover how our latest updates help buildings reduce energy waste by 30% using real-time occupancy data.",
      content: `
        The future of sustainable building management has arrived. With the release of CyNapse v4.2, we are introducing our most advanced energy optimization engine yet. 
        
        Using a combination of high-precision PIR (Passive Infrared) sensors and our new AI-driven occupancy predictor, buildings can now reduce their carbon footprint without impacting user comfort. 

        Key highlights of this update:
        - Real-time HVAC adjustments: The system now talks directly to smart thermostats, lowering cooling or heating in zones that have been empty for more than 10 minutes.
        - Adaptive Lighting: Lights no longer just turn on or off; they dim based on the amount of natural light entering through windows (daylight harvesting) and the specific density of people in the room.
        - Historical Analysis: Facility managers can now view a 'thermal map' of their building over time to identify poorly insulated areas.

        "Our goal is to make buildings think for themselves," says our lead developer. "By using live data, we eliminate the 'ghost energy' wasted on empty corridors and unused meeting rooms."
      `
    },
    {
      id: 2,
      date: "Mar 28, 2026",
      title: "Security Protocols 2.0",
      tag: "Security",
      icon: Shield,
      summary: "We've enhanced our granular access management to provide even more security for sensitive areas.",
      content: `
        Security is at the heart of everything we do. As IoT ecosystems grow, so do the potential threats. That's why we've rebuilt our security architecture from the ground up.

        Protocol 2.0 introduces:
        - End-to-End Hardware Encryption: Every sensor now has a unique cryptographic signature, preventing 'man-in-the-middle' attacks or device spoofing.
        - Multi-Factor Access Control: For high-security zones like server rooms or executive offices, CyNapse now supports secondary biometric validation directly through the mobile app.
        - Instant Lockdown: In the event of a detected breach, administrators can trigger a building-wide lockdown of smart locks with a single tap.

        This update also includes an automated audit trail, which logs every single door opening and access request in an immutable ledger, ensuring total transparency for compliance officers.
      `
    },
    {
      id: 4,
      date: "Jan 20, 2026",
      title: "New IoT Sensor Compatibility",
      tag: "IoT",
      icon: Cpu,
      summary: "Our platform now supports over 50 new hardware manufacturers for seamless integration.",
      content: `
        The power of CyNapse lies in its flexibility. We believe you shouldn't be locked into a single hardware vendor. Our latest integration sprint has added native support for over 50 new IoT devices.

        What's new in the library:
        - Industrial Grade Air Quality Monitors: Support for high-end CO2 and particulate matter sensors for laboratory and medical environments.
        - Smart Water Leak Detectors: Prevent costly floods with new sub-floor moisture sensors.
        - Legacy System Bridges: We've developed new drivers for older BACnet and Modbus systems, allowing you to bring 20-year-old building tech into the modern CyNapse dashboard.

        With these additions, CyNapse remains the most versatile 'agnostic' IoT platform on the market today.
      `
    }
  ];

  if (selectedArticle) {
    return (
      <div className="relative min-h-screen overflow-hidden pt-12 pb-24">
        {/* Background Geometric Shapes */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-80 h-80 bg-purple-200/10 rotate-12 border-2 border-purple-300/5 rounded-3xl animate-move-slow" />
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-blue-200/5 border-2 border-blue-300/5 rounded-full animate-move-reverse" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <button 
            onClick={() => setSelectedArticle(null)}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-accent transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Newsroom
          </button>

          <article className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[3rem] p-8 md:p-16 shadow-2xl">
            <header className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-accent/10 rounded-2xl text-accent">
                  <selectedArticle.icon className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <Tag className="w-3 h-3 text-accent" />
                    <span className="text-[10px] font-black text-accent uppercase tracking-widest">{selectedArticle.tag}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{selectedArticle.date}</span>
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
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">CN</div>
                <div>
                  <p className="text-xs font-black text-gray-900 uppercase">CyNapse Editorial Team</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Technology Department</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </footer>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden pt-12 pb-24">
      {/* Background Geometric Shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-80 h-80 bg-purple-200/20 rotate-12 border-2 border-purple-300/10 rounded-3xl animate-move-slow" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-blue-200/10 border-2 border-blue-300/10 rounded-full animate-move-reverse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-accent transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <header className="mb-20 text-center md:text-left">
          <h2 className="text-sm font-black text-accent uppercase tracking-[0.2em] mb-3">Insights & Updates</h2>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight">CyNapse Newsroom</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {allNews.map((news, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedArticle(news)}
              className="group bg-white/40 backdrop-blur-md border border-gray-100 rounded-[3rem] overflow-hidden hover:shadow-2xl hover:shadow-accent/5 transition-all cursor-pointer hover:-translate-y-2"
            >
              <div className="p-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent/10 rounded-xl text-accent group-hover:scale-110 transition-transform">
                      <news.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{news.date}</span>
                  </div>
                  <span className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-full">{news.tag}</span>
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-6 group-hover:text-accent transition-colors leading-tight">
                  {news.title}
                </h2>
                <p className="text-gray-500 font-medium leading-relaxed mb-10 flex-1">
                  {news.summary}
                </p>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900 group-hover:gap-4 transition-all">
                  Read full article
                  <ArrowRight className="w-4 h-4 text-accent" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
