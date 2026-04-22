import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { 
  ArrowLeft, 
  Thermometer, 
  Users, 
  Wind, 
  Clock, 
  AlertTriangle, 
  Loader2, 
  RefreshCcw,
  Cpu,
  History as HistoryIcon,
  ShieldCheck,
  Activity,
  Calendar,
  Droplets,
  Lightbulb
} from 'lucide-react';

const DeviceDetail = () => {
  const { roomId, deviceId } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [roomId, deviceId]);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      
      const [deviceView, deviceHistory] = await Promise.all([
        api.get(`/api/monitoring/device/${deviceId}`),
        api.get(`/api/monitoring/rooms/${deviceId}/history`)
      ]);

      setDevice(deviceView);
      setHistory(deviceHistory);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE': return 'text-green-500 bg-green-50';
      case 'OFFLINE': return 'text-red-500 bg-red-50';
      case 'MAINTENANCE': return 'text-amber-500 bg-amber-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'THERMOMETER': return <Thermometer className="w-8 h-8" />;
      case 'HUMIDITY_SENSOR': return <Droplets className="w-8 h-8" />;
      case 'CO2_SENSOR': return <Wind className="w-8 h-8" />;
      case 'PEOPLE_COUNTER': return <Users className="w-8 h-8" />;
      case 'SMART_LIGHT': return <Lightbulb className="w-8 h-8" />;
      default: return <Cpu className="w-8 h-8" />;
    }
  };

  const getDeviceUnit = (type) => {
    switch (type) {
      case 'THERMOMETER': return '°C';
      case 'HUMIDITY_SENSOR': return '%';
      case 'CO2_SENSOR': return 'ppm';
      case 'PEOPLE_COUNTER': return 'pers.';
      case 'SMART_LIGHT': return '';
      default: return '';
    }
  };

  const formatValue = (val, type) => {
    if (val === null || val === undefined) return '--';
    if (type === 'SMART_LIGHT') return val === 1 ? 'Allumé' : 'Éteint';
    return typeof val === 'number' ? val.toFixed(1) : val;
  };

  if (loading && !device) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
      <Loader2 className="w-10 h-10 animate-spin text-accent" />
      <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Analyse des données...</p>
    </div>
  );

  if (!device) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs uppercase font-black">
      <h2 className="text-2xl mb-4">Capteur introuvable</h2>
      <button onClick={() => navigate(`/monitoring/room/${roomId}`)} className="text-accent">
        <ArrowLeft className="w-4 h-4 inline mr-2" /> Retour
      </button>
    </div>
  );

  const alerts = device.alertViews || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 text-center md:text-left">
          <button 
            onClick={() => navigate(`/monitoring/room/${roomId}`)}
            className="inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest mx-auto md:mx-0"
          >
            <ArrowLeft className="w-3 h-3" />
            Retour à la salle
          </button>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase leading-tight">{device.name}</h1>
            <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${getStatusColor(device.status)}`}>
              {device.status}
            </span>
          </div>
          <p className="text-gray-500 font-medium italic">
            Type: <span className="text-gray-900 font-bold uppercase">{device.type.replace('_', ' ')}</span> | 
            ID: <span className="text-gray-900 font-bold">{deviceId}</span>
          </p>
        </div>
        
        <button 
          onClick={fetchData} 
          disabled={refreshing}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-xs font-black text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 uppercase tracking-widest"
        >
          <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Synchroniser
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              {getDeviceIcon(device.type)}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 text-center sm:text-left">
               <div className={`p-5 rounded-[2rem] ${getStatusColor(device.status)} bg-opacity-10`}>
                  <div className={getStatusColor(device.status).split(' ')[0]}>
                    {getDeviceIcon(device.type)}
                  </div>
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valeur Temps Réel</p>
                  <p className="text-5xl md:text-6xl font-black text-gray-900">
                    {formatValue(device.lastValue, device.type)}
                    <span className="text-xl ml-2 text-gray-400 font-bold uppercase">
                      {getDeviceUnit(device.type)}
                    </span>
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-gray-50 text-center md:text-left text-xs uppercase tracking-tighter">
               <div>
                  <p className="text-[9px] font-black text-gray-400 mb-1">Statut</p>
                  <p className="font-bold text-gray-900">{device.status}</p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-gray-400 mb-1">Activité</p>
                  <p className="font-bold text-gray-900">
                     {device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleTimeString() : 'N/A'}
                  </p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-gray-400 mb-1">Dernière MaJ</p>
                  <p className="font-bold text-gray-900">
                     {device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleDateString() : 'N/A'}
                  </p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-gray-400 mb-1">Alertes</p>
                  <p className={`font-bold ${alerts.length > 0 ? 'text-red-500' : 'text-green-600'}`}>
                    {alerts.length} active(s)
                  </p>
               </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 uppercase tracking-tight">
                <HistoryIcon className="w-5 h-5 text-accent" />
                Historique des Mesures
              </h3>
              <Activity className="w-4 h-4 text-gray-200" />
            </div>
            
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="py-20 text-center text-gray-300 font-bold uppercase text-[10px] tracking-widest">
                  Aucun journal disponible
                </div>
              ) : (
                history.slice(0, 30).map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-4">
                       <div className="hidden sm:flex w-10 h-10 rounded-xl bg-gray-50 items-center justify-center text-gray-400 group-hover:text-accent group-hover:bg-white transition-colors">
                          <Clock className="w-4 h-4" />
                       </div>
                       <div>
                          <p className="text-lg font-black text-gray-900 leading-tight">
                            {formatValue(h.value, device.type)}
                            <span className="text-[10px] ml-1 text-gray-400 uppercase font-bold tracking-widest">{h.metric || getDeviceUnit(device.type)}</span>
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{new Date(h.capturedAt).toLocaleString()}</p>
                       </div>
                    </div>
                    {i === 0 && <span className="px-3 py-1 bg-accent text-white text-[8px] font-black rounded-full uppercase tracking-tighter">Live</span>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
           <div className="bg-slate-900 p-6 md:p-8 rounded-3xl shadow-2xl text-white space-y-6">
              <h3 className="text-xl font-black flex items-center gap-3 uppercase tracking-tight">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                État d'Alerte
              </h3>
              
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <div className="py-10 text-center text-white/30 border border-white/5 rounded-2xl bg-white/5">
                    <ShieldCheck className="w-10 h-10 mx-auto mb-4 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Nominal</p>
                  </div>
                ) : (
                  alerts.map(alert => (
                    <div key={alert.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-left">
                       <div className="flex justify-between items-center">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                            alert.severity === 'HIGH' ? 'bg-red-600 text-white shadow-sm' : 'bg-amber-500 text-white shadow-sm'
                          }`}>
                            {alert.severity}
                          </span>
                          <span className="text-[8px] font-bold text-white/30">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                       </div>
                       <p className="text-[11px] font-bold text-white/80 leading-relaxed italic underline decoration-white/20">Capteur {device.name} : {alert.message}</p>
                    </div>
                  ))
                )}
              </div>
           </div>

           <div className="bg-accent p-6 md:p-8 rounded-3xl text-white space-y-4 shadow-xl shadow-accent/20">
              <ShieldCheck className="w-8 h-8 opacity-40" />
              <h4 className="text-lg font-black leading-tight uppercase tracking-tight">Vérifié</h4>
              <p className="text-xs font-bold opacity-80 leading-relaxed italic">Structure de données conforme.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetail;
