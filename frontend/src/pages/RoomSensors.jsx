import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { 
  ArrowLeft, 
  Cpu, 
  Loader2, 
  RefreshCcw, 
  Thermometer, 
  Wind, 
  Users, 
  Activity, 
  AlertTriangle,
  Clock,
  ArrowRight,
  Droplets,
  Lightbulb,
  Layers,
  ShieldAlert,
  CheckCircle
} from 'lucide-react';

const RoomSensors = () => {
  const { id } = useParams(); // roomId
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const data = await api.get(`/api/monitoring/rooms/${id}`);
      setRoom(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'THERMOMETER': return <Thermometer className="w-5 h-5" />;
      case 'HUMIDITY_SENSOR': return <Droplets className="w-5 h-5" />;
      case 'CO2_SENSOR': return <Wind className="w-5 h-5" />;
      case 'PEOPLE_COUNTER': return <Users className="w-5 h-5" />;
      case 'SMART_LIGHT': return <Lightbulb className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  const formatValue = (device) => {
    if (device.lastValue === null || device.lastValue === undefined) return '--';
    
    if (device.type === 'SMART_LIGHT') {
      return device.lastValue === 1 ? 'Allumé' : 'Éteint';
    }

    const val = typeof device.lastValue === 'number' ? device.lastValue.toFixed(1) : device.lastValue;
    
    switch (device.type) {
      case 'THERMOMETER': return `${val}°C`;
      case 'HUMIDITY_SENSOR': return `${val}%`;
      case 'CO2_SENSOR': return `${val} ppm`;
      case 'PEOPLE_COUNTER': return `${val} pers.`;
      default: return val;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE': return 'bg-green-500';
      case 'OFFLINE': return 'bg-red-500';
      case 'MAINTENANCE': return 'bg-amber-500';
      default: return 'bg-gray-400';
    }
  };

  if (loading && !room) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center px-4">
      <Loader2 className="w-10 h-10 animate-spin text-accent" />
      <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Chargement de la salle...</p>
    </div>
  );

  const allRoomAlerts = room?.devices?.flatMap(d => d.alertViews || []) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-10 text-gray-900">
      <div className="flex items-center justify-between">
        <Link 
          to="/monitoring"
          className="inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="w-3 h-3" />
          Retour
        </Link>
        <button 
          onClick={fetchData} 
          className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-accent transition-colors shadow-sm"
        >
          <RefreshCcw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Hero Section */}
      <section className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Activity className="w-64 h-64 rotate-12" />
         </div>
         
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/20 text-accent rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  <Layers className="w-3 h-3" />
                  Étage {room?.floorNumber}
               </div>
               <h1 className="text-5xl md:text-7xl font-black tracking-tight uppercase leading-none">{room?.name}</h1>
               <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                  <div className="p-4 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-4">
                     <Users className="w-8 h-8 text-accent" />
                     <div>
                        <p className="text-[10px] font-bold uppercase opacity-40">Capacité Maximale</p>
                        <p className="text-2xl font-black">{room?.capacity} <span className="text-sm font-medium opacity-50 uppercase">pers.</span></p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Alert Section */}
            <div className="space-y-4">
               {allRoomAlerts.length > 0 ? (
                 <div className="bg-red-600 rounded-[2.5rem] p-8 space-y-5 shadow-2xl shadow-red-900/40 border border-red-500">
                    <div className="flex items-center justify-between">
                       <h2 className="flex items-center gap-3 text-sm font-black uppercase tracking-widest">
                          <ShieldAlert className="w-6 h-6" />
                          Alertes de Salle
                       </h2>
                       <span className="px-3 py-1 bg-white text-red-600 rounded-full text-xs font-black">{allRoomAlerts.length}</span>
                    </div>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20">
                       {allRoomAlerts.map((alert) => (
                         <div key={alert.id} className="text-sm bg-white/10 p-4 rounded-2xl border border-white/5 space-y-1">
                            <p className="font-black text-[10px] uppercase opacity-60 tracking-widest">{alert.deviceName}</p>
                            <p className="font-bold leading-relaxed">{alert.message}</p>
                         </div>
                       ))}
                    </div>
                 </div>
               ) : (
                 <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-center space-y-4">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                       <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-green-500">Tout va bien</p>
                 </div>
               )}
            </div>
         </div>
      </section>

      {/* Sensor Cards */}
      <div className="space-y-8">
        <h2 className="text-2xl font-black flex items-center gap-4 uppercase tracking-tighter">
          <Cpu className="w-7 h-7 text-accent" />
          État des Capteurs
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {room?.devices?.map(device => {
            const hasAlert = device.alertViews && device.alertViews.length > 0;
            
            return (
              <button
                key={device.id}
                onClick={() => navigate(`/monitoring/room/${id}/device/${device.id}`)}
                className="group bg-white rounded-[3rem] p-8 text-left border border-gray-100 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-10">
                  <div className={`p-6 rounded-3xl ${getStatusColor(device.status)} bg-opacity-10 text-gray-900`}>
                     <div className={getStatusColor(device.status).replace('bg-', 'text-')}>
                        {getDeviceIcon(device.type)}
                     </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black text-white uppercase ${getStatusColor(device.status)}`}>
                    {device.status}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black group-hover:text-accent transition-colors truncate uppercase tracking-tight">{device.name}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-60">{device.type.replace('_', ' ')}</p>
                  </div>

                  <div className="bg-gray-50 rounded-[2rem] p-6 flex flex-col space-y-1 border border-transparent group-hover:border-accent/10 transition-colors">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Dernière Valeur</span>
                     <span className="text-3xl font-black text-gray-900">
                       {formatValue(device)}
                     </span>
                  </div>

                  {hasAlert ? (
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100 space-y-2">
                       {device.alertViews.map(alert => (
                         <div key={alert.id} className="flex gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] font-bold text-red-800 leading-snug">
                               Capteur {device.name} : {alert.message}
                            </p>
                         </div>
                       ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600 px-2">
                       <CheckCircle className="w-3 h-3" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Aucun souci</span>
                    </div>
                  )}

                  <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-black uppercase text-gray-300">
                     <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleTimeString() : 'N/A'}</span>
                     </div>
                     <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoomSensors;
