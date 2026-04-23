import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { roomApi, deviceApi } from '../utils/api';
import { 
  ArrowLeft, 
  Cpu, 
  Loader2, 
  RefreshCcw, 
  Thermometer, 
  Wind, 
  Users, 
  Activity, 
  ShieldAlert,
  CheckCircle,
  Signal,
  Flame,
  FileText,
  Zap,
  Trash2,
  CheckCircle2,
  Droplets,
  Lightbulb,
  Layers,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DeleteRequestModal from '../components/DeleteRequestModal';
import { Role, DeviceType } from '../utils/constants';

const RoomSensors = () => {
  const { id } = useParams(); // roomId
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [actuators, setActuators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    deviceId: null,
    deviceType: null,
    deviceName: ''
  });

  const canRequestDelete = user && [Role.ADVANCED, Role.EXPERT, Role.ADMIN].includes(user.role);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [roomData, sensorsData, actuatorsData] = await Promise.all([
        roomApi.get(id),
        deviceApi.sensors(id),
        deviceApi.actuators(id)
      ]);
      setRoom(roomData);
      setSensors(sensorsData);
      setActuators(actuatorsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
      const response = await fetch(`/api/reports/rooms/${id}`, {
        method: 'GET',
      });
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-room-${room?.name || id}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert('Failed to download report');
    } finally {
      setDownloading(false);
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case DeviceType.THERMOMETER: return <Thermometer className="w-5 h-5" />;
      case DeviceType.HEATER: return <Flame className="w-5 h-5" />;
      case DeviceType.HUMIDITY_SENSOR: return <Droplets className="w-5 h-5" />;
      case DeviceType.CO2_SENSOR: return <Wind className="w-5 h-5" />;
      case DeviceType.PEOPLE_COUNTER: return <Users className="w-5 h-5" />;
      case DeviceType.SMART_LIGHT: return <Lightbulb className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  const formatValue = (device) => {
    const lastValue = device.lastValue || (device.readings?.length > 0 ? device.readings[device.readings.length - 1].value : null);

    if (lastValue === null || lastValue === undefined) return '--';
    
    if (device.type === DeviceType.SMART_LIGHT) {
      return lastValue === 1 || lastValue === 'ON' ? 'On' : 'Off';
    }

    const val = typeof lastValue === 'number' ? lastValue.toFixed(1) : lastValue;
    
    switch (device.type) {
      case DeviceType.THERMOMETER: return `${val}°C`;
      case DeviceType.HUMIDITY_SENSOR: return `${val}%`;
      case DeviceType.CO2_SENSOR: return `${val} ppm`;
      case DeviceType.PEOPLE_COUNTER: return `${val} ppl.`;
      default: return val;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE': return 'bg-secondary';
      case 'OFFLINE': return 'bg-danger';
      case 'MAINTENANCE': return 'bg-warning';
      default: return 'bg-gray-400';
    }
  };

  if (loading && !room) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center px-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Loading room...</p>
    </div>
  );

  const allRoomAlerts = room?.alerts || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-10 text-gray-900">
      <div className="flex items-center justify-between">
        <Link 
          to="/monitoring"
          className="inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="w-3 h-3" />
          Back
        </Link>
        <div className="flex gap-2">
           <button 
             onClick={handleDownloadReport}
             disabled={downloading}
             className="flex items-center gap-2 px-4 py-2 bg-surface border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary hover:border-primary/20 transition-all shadow-sm disabled:opacity-50"
           >
             {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
             Report
           </button>
           <button 
             onClick={fetchData} 
             className="p-2 bg-surface border border-gray-100 rounded-xl text-gray-400 hover:text-primary transition-colors shadow-sm"
           >
             <RefreshCcw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
           </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-background-dark rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Activity className="w-64 h-64 rotate-12" />
         </div>
         
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  <Layers className="w-3 h-3" />
                  Floor {room?.floorNumber}
               </div>
               <h1 className="text-5xl md:text-7xl font-black tracking-tight uppercase leading-none">{room?.name}</h1>
               <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                  <div className="p-4 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-4">
                     <Users className="w-8 h-8 text-primary" />
                     <div>
                        <p className="text-[10px] font-bold uppercase opacity-40">Maximum Capacity</p>
                        <p className="text-2xl font-black">{room?.capacity} <span className="text-sm font-medium opacity-50 uppercase">ppl.</span></p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Alert Section */}
            <div className="space-y-4">
               {allRoomAlerts.length > 0 ? (
                 <div className="bg-danger rounded-[2.5rem] p-8 space-y-5 shadow-2xl shadow-red-900/40 border border-danger/50">
                    <div className="flex items-center justify-between">
                       <h2 className="flex items-center gap-3 text-sm font-black uppercase tracking-widest">
                          <ShieldAlert className="w-6 h-6" />
                          Room Alerts
                       </h2>
                       <span className="px-3 py-1 bg-white text-danger rounded-full text-xs font-black">{allRoomAlerts.length}</span>
                    </div>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20">
                       {allRoomAlerts.map((alert) => (
                         <div key={alert.id} className="text-sm bg-white/10 p-4 rounded-2xl border border-white/5 space-y-1">
                            <p className="font-bold leading-relaxed">{alert.message}</p>
                            <p className="text-[9px] font-bold opacity-40 uppercase">{new Date(alert.createdAt).toLocaleString()}</p>
                         </div>
                       ))}
                    </div>
                 </div>
               ) : (
                 <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-center space-y-4">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto border border-secondary/20">
                       <CheckCircle className="w-8 h-8 text-secondary" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-secondary">All good</p>
                 </div>
               )}
            </div>
         </div>
      </section>

      {/* Sensor Cards */}
      <div className="space-y-8">
        <h2 className="text-2xl font-black flex items-center gap-4 uppercase tracking-tighter">
          <Signal className="w-7 h-7 text-primary" />
          Sensors
        </h2>
        
        {successMessage && (
           <div className="bg-secondary/10 border border-secondary/20 p-4 rounded-2xl flex items-center gap-3 text-secondary text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-300">
              <CheckCircle2 className="w-4 h-4" />
              {successMessage}
           </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sensors && sensors.map(device => {
            return (
              <div key={device.id} className="relative group">
                <button
                  onClick={() => navigate(`/monitoring/room/${id}/device/sensor-${device.id}`)}
                  className="w-full bg-surface rounded-[3rem] p-8 text-left border border-gray-100 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden"
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
                      <h3 className="text-2xl font-black group-hover:text-primary transition-colors truncate uppercase tracking-tight">{device.name}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-60">{device.type.replace('_', ' ')}</p>
                    </div>

                    <div className="bg-background rounded-[2rem] p-6 flex flex-col space-y-1 border border-transparent group-hover:border-primary/10 transition-colors">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Last Reading</span>
                       <div className="flex items-baseline justify-between">
                          <span className="text-3xl font-black text-gray-900">
                            {formatValue(device)}
                          </span>
                          {device.electricityConsumption !== undefined && device.electricityConsumption !== null && (
                             <div className="flex items-center gap-1 text-warning">
                                <Zap className="w-3 h-3 fill-current" />
                                <span className="text-[10px] font-black">{device.electricityConsumption}W</span>
                             </div>
                          )}
                       </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-black uppercase text-gray-300">
                       <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleTimeString() : 'N/A'}</span>
                       </div>
                       <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </button>
                
                {canRequestDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModal({
                        isOpen: true,
                        deviceId: device.id,
                        deviceType: 'SENSOR',
                        deviceName: device.name
                      });
                    }}
                    className="absolute top-4 right-16 p-2.5 bg-danger/10 text-danger rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-danger hover:text-white z-10 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actuator Cards */}
      <div className="space-y-8">
        <h2 className="text-2xl font-black flex items-center gap-4 uppercase tracking-tighter">
          <Cpu className="w-7 h-7 text-primary" />
          Actuators
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {actuators && actuators.map(device => {
            return (
              <div key={device.id} className="relative group">
                <button
                  onClick={() => navigate(`/monitoring/room/${id}/device/actuator-${device.id}`)}
                  className="w-full bg-surface rounded-[3rem] p-8 text-left border border-gray-100 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden"
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
                      <h3 className="text-2xl font-black group-hover:text-primary transition-colors truncate uppercase tracking-tight">{device.name}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-60">{device.type.replace('_', ' ')}</p>
                    </div>

                    <div className="bg-primary/5 rounded-[2rem] p-6 flex flex-col space-y-1 border border-transparent group-hover:border-primary/10 transition-colors">
                       <span className="text-[10px] font-black text-primary uppercase tracking-[0.1em]">Current State</span>
                       <div className="flex items-baseline justify-between">
                          <span className="text-3xl font-black text-primary">
                            {device.currentState || 'OFF'}
                          </span>
                          {device.electricityConsumption !== undefined && device.electricityConsumption !== null && (
                             <div className="flex items-center gap-1 text-warning">
                                <Zap className="w-3 h-3 fill-current" />
                                <span className="text-[10px] font-black">{device.electricityConsumption}W</span>
                             </div>
                          )}
                       </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-black uppercase text-gray-300">
                       <div className="flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5" />
                          <span>Actuator Control</span>
                       </div>
                       <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </button>
                
                {canRequestDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModal({
                        isOpen: true,
                        deviceId: device.id,
                        deviceType: 'ACTUATOR',
                        deviceName: device.name
                      });
                    }}
                    className="absolute top-4 right-16 p-2.5 bg-danger/10 text-danger rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-danger hover:text-white z-10 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <DeleteRequestModal 
        {...deleteModal}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onSuccess={() => {
          setSuccessMessage('Deletion request submitted successfully.');
          setTimeout(() => setSuccessMessage(null), 5000);
        }}
      />
    </div>
  );
};

export default RoomSensors;
