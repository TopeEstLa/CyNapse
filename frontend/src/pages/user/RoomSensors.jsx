import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { roomApi, deviceApi, BASE_URL } from '../../utils/api';
import { 
  ArrowLeft, 
  Cpu, 
  Loader2, 
  RefreshCcw, 
  Thermometer, 
  Wind, 
  Users, 
  Activity, 
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
import { useAuth } from '../../context/AuthContext';
import DeleteRequestModal from '../../components/DeleteRequestModal';
import { Role, DeviceType } from '../../utils/constants';

const RoomSensors = () => {
  const { id } = useParams(); // roomId
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [actuators, setActuators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [downloading, setDownloading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    deviceId: null,
    deviceType: null,
    deviceName: ''
  });

  const canRequestDelete = user && [Role.EXPERT, Role.ADMIN].includes(user.role);
  const canDownloadReport = user && [Role.ADVANCED, Role.EXPERT, Role.ADMIN].includes(user.role);

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
      setLastRefresh(new Date());
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
      const response = await fetch(`${BASE_URL}/api/reports/rooms/${id}`, {
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

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-8 text-gray-900">
      <header className="flex items-center justify-between border-b pb-4">
        <Link 
          to="/monitoring"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Monitoring
        </Link>
        <div className="flex gap-2">
           {canDownloadReport && (
             <a 
               href={`${BASE_URL}/api/reports/rooms/${id}`}
               target="_blank"
               rel="noopener noreferrer"
               download={`report-room-${room?.name || id}.txt`}
               className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
             >
               <FileText className="w-4 h-4" />
               Download Report
             </a>
           )}
           <div className="flex items-center gap-3">
             <span className="text-[10px] text-gray-400 font-bold uppercase whitespace-nowrap">
               Updated: {lastRefresh.toLocaleTimeString()}
             </span>
             <button 
               onClick={fetchData} 
               className="p-2 bg-white border border-gray-300 rounded-lg text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
               aria-label="Refresh data"
             >
               <RefreshCcw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
             </button>
           </div>
        </div>
      </header>

      {/* Room Info Section */}
      <section className="bg-gray-900 rounded-xl p-8 text-white relative overflow-hidden shadow-lg">
         <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider">
               Floor {room?.floorNumber}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{room?.name}</h1>
            <div className="flex items-center gap-4 pt-2">
               <div className="flex items-center gap-2 text-gray-300">
                  <Users className="w-5 h-5" />
                  <span className="text-lg font-medium">Capacity: {room?.capacity} ppl.</span>
               </div>
            </div>
         </div>
      </section>

      {/* Sensor Cards */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-3 border-b pb-2">
          <Signal className="w-6 h-6 text-blue-600" />
          Sensors
        </h2>
        
        {successMessage && (
           <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center gap-3 text-green-700 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              {successMessage}
           </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensors && sensors.map(device => {
            return (
              <div key={device.id} className="relative group">
                <button
                  onClick={() => navigate(`/device/sensor-${device.id}`)}
                  className="w-full bg-white rounded-xl p-6 text-left border border-gray-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-lg bg-gray-100 text-gray-600`}>
                       {getDeviceIcon(device.type)}
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold text-white uppercase ${getStatusColor(device.status)}`}>
                      {device.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{device.name}</h3>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">{device.type.replace('_', ' ')}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between border border-gray-100">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Current Value</span>
                          <span className="text-2xl font-bold text-gray-900">{formatValue(device)}</span>
                       </div>
                       {device.electricityConsumption !== undefined && (
                         <div className="text-right">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Power</span>
                            <div className="flex items-center gap-1 text-yellow-600 font-bold">
                               <Zap className="w-3 h-3" />
                               <span>{device.electricityConsumption}W</span>
                            </div>
                         </div>
                       )}
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase">
                       <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleTimeString() : 'N/A'}</span>
                       </div>
                       <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
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
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors z-10"
                    title="Request deletion"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Actuator Cards */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-3 border-b pb-2">
          <Cpu className="w-6 h-6 text-blue-600" />
          Actuators
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {actuators && actuators.map(device => {
            return (
              <div key={device.id} className="relative group">
                <button
                  onClick={() => navigate(`/device/actuator-${device.id}`)}
                  className="w-full bg-white rounded-xl p-6 text-left border border-gray-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-lg bg-gray-100 text-gray-600`}>
                       {getDeviceIcon(device.type)}
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold text-white uppercase ${getStatusColor(device.status)}`}>
                      {device.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{device.name}</h3>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">{device.type.replace('_', ' ')}</p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between border border-blue-100">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-blue-400 uppercase">State</span>
                          <span className="text-2xl font-bold text-blue-600 uppercase">{device.currentState || 'OFF'}</span>
                       </div>
                       {device.electricityConsumption !== undefined && (
                         <div className="text-right">
                            <span className="text-[10px] font-bold text-blue-400 uppercase">Power</span>
                            <div className="flex items-center gap-1 text-yellow-600 font-bold">
                               <Zap className="w-3 h-3" />
                               <span>{device.electricityConsumption}W</span>
                            </div>
                         </div>
                       )}
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase">
                       <div className="flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5" />
                          <span>{user && [Role.EXPERT, Role.ADMIN].includes(user.role) ? 'Control Actuator' : 'View Details'}</span>
                       </div>
                       <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
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
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors z-10"
                    title="Request deletion"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <DeleteRequestModal 
        {...deleteModal}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onSuccess={() => {
          setSuccessMessage('Deletion request submitted successfully.');
          setTimeout(() => setSuccessMessage(null), 5000);
        }}
      />
    </main>
  );
};

export default RoomSensors;
