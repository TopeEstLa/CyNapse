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
    { icon: Building2, title: "Gestion Bâtiment", desc: "Supervision complète de vos infrastructures par étage et par salle." },
    { icon: Cpu, title: "Capteurs IoT", desc: "Monitoring précis de la température, du CO2 et de l'occupation." },
    { icon: Activity, title: "Temps Réel", desc: "Visualisez les données instantanément avec des mises à jour automatiques." },
    { icon: ShieldCheck, title: "Sécurité", desc: "Alertes intelligentes et gestion granulaire des accès utilisateurs." }
  ];

  return (
    <div className="space-y-16 md:space-y-24 py-10">
      {/* Hero Section */}
      <section className="text-center space-y-8 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-xs font-black uppercase tracking-widest mx-auto">
          <Zap className="w-3 h-3 fill-accent" />
          Nouveau : Monitoring par capteur
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight">
          L'intelligence au service <br className="hidden md:block" />
          <span className="text-accent">de votre bâtiment.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
          Optimisez la gestion de vos espaces avec CyNapse. Une plateforme IoT puissante pour surveiller, analyser et sécuriser votre environnement.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/monitoring"
            className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-black transition-colors shadow-xl shadow-gray-200"
          >
            Accéder au Dashboard
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-gray-50 transition-colors"
          >
            Créer un compte
          </Link>
        </div>
      </section>

      {/* Stats/Badge Row */}
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 px-4 py-8 border-y border-gray-100">
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
          <div key={i} className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group">
            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
              <f.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">{f.title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Bottom CTA */}
      <section className="px-4 max-w-5xl mx-auto">
         <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-center space-y-8 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
               <Building2 className="w-96 h-96 -translate-x-20 -translate-y-20 rotate-12" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">Prêt à transformer vos bureaux ?</h2>
            <p className="text-slate-400 font-medium max-w-xl mx-auto">
              Rejoignez les dizaines d'entreprises qui font confiance à CyNapse pour leur transition numérique.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-3 px-10 py-5 bg-accent text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-accent/90 transition-all shadow-2xl shadow-accent/20"
            >
              Démarrer maintenant
              <ArrowRight className="w-4 h-4" />
            </Link>
         </div>
      </section>
    </div>
  );
};

export default Home;
