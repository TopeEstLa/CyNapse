import React, { useState, useEffect } from 'react';
import { roomApi } from '../utils/api';
import { 
  AlertTriangle, 
  Users, 
  Loader2, 
  ArrowRight, 
  RefreshCcw, 
  Layers, 
  ShieldCheck,
  Building2,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RoomStatus, Role } from '../utils/constants';

const IoTMonitoring = () => {
  const [rooms, setRooms] = useState([]);
  const [overview, setOverview] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const roomsData = await roomApi.list();
      setRooms(roomsData);
      
      const totalConsumption = roomsData.reduce((acc, room) => {
         return acc + (room.totalConsumption || 0);
      }, 0);

      const overviewData = {
        roomsTotal: roomsData.length,
        roomsOccupied: roomsData.filter(r => r.status === RoomStatus.OCCUPIED).length,
        roomsInAlert: roomsData.filter(r => r.status === RoomStatus.ALERT).length,
        activeAlerts: roomsData.reduce((acc, r) => acc + (r.alerts?.length || 0), 0),
        avgTemperature: 22.5,
        totalConsumption: totalConsumption
      };
      setOverview(overviewData);

      const allAlerts = roomsData.flatMap(r => 
        (r.alerts || []).map(a => ({ ...a, roomName: r.name }))
      ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setAlerts(allAlerts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case RoomStatus.FREE: return 'bg-secondary';
      case RoomStatus.OCCUPIED: return 'bg-primary';
      case RoomStatus.ALERT: return 'bg-danger shadow-[0_0_20px_rgba(239,68,68,0.3)]';
      default: return 'bg-gray-400';
    }
  };

  const roomsByFloor = rooms.reduce((acc, room) => {
    const floor = room.floorNumber;
    if (!acc[floor]) acc[floor] = [];
    acc[floor].push(room);
    return acc;
  }, {});

  const sortedFloors = Object.keys(roomsByFloor).sort((a, b) => b - a);

  if (loading && !rooms.length) return <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mt-20" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Building Monitoring</h1>
          <p className="hidden sm:block text-gray-500 italic text-sm">Global view by floor and room.</p>
        </div>
        <button onClick={fetchData} className="p-2.5 bg-surface border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
          <RefreshCcw className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {overview && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          <div className="bg-surface p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Rooms</p>
            <p className="text-xl font-black text-gray-900">{overview.roomsTotal}</p>
          </div>
          <div className="bg-surface p-4 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-primary">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Occupied</p>
            <p className="text-xl font-black text-primary">{overview.roomsOccupied}</p>
          </div>
          <div className="bg-surface p-4 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-danger">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">In Alert</p>
            <p className="text-xl font-black text-danger">{overview.roomsInAlert}</p>
          </div>
          <div className="bg-surface p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Alerts</p>
            <p className="text-xl font-black text-warning">{overview.activeAlerts}</p>
          </div>
          <div className="bg-surface p-4 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-primary hidden lg:block">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avg. Temp</p>
            <p className="text-xl font-black text-primary">{overview.avgTemperature?.toFixed(1) || '0.0'}°C</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-12">
          {sortedFloors.map(floor => (
            <div key={floor} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background-dark rounded-lg text-white">
                  <Layers className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Floor {floor}</h2>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {roomsByFloor[floor].map(room => (
                  <button
                    key={room.id}
                    onClick={() => navigate(`/monitoring/room/${room.id}`)}
                    className={`group relative overflow-hidden rounded-3xl p-5 md:p-6 text-left transition-transform hover:scale-[1.02] active:scale-[0.98] ${getStatusColor(room.status)} shadow-lg shadow-gray-200`}
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Building2 className="w-16 h-16 md:w-20 md:h-20" />
                    </div>
                    
                    <div className="relative z-10 text-white space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg md:text-xl font-black leading-tight truncate pr-4">{room.name}</h3>
                        <div className="flex gap-1.5 md:gap-2">
                           {user?.role === Role.ADMIN && (
                             <div 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 navigate(`/admin/rooms/${room.id}`);
                               }}
                               className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md hover:bg-white/40 transition-colors"
                             >
                               <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4" />
                             </div>
                           )}
                           <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
                             <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                           </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-[10px] font-bold text-white/90">
                         <div className="flex items-center gap-1">
                           <Users className="w-3 h-3" />
                           <span>{room.capacity} ppl.</span>
                         </div>
                         <div className="px-2 py-0.5 bg-white/20 rounded-md backdrop-blur-md uppercase tracking-tighter">
                           {room.status}
                         </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-background-dark p-6 md:p-8 rounded-[2rem] shadow-2xl text-white space-y-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black flex items-center gap-3 uppercase tracking-tight">
                <AlertTriangle className="w-5 h-5 text-danger" />
                Alerts
              </h2>
              <span className="bg-danger text-white px-2 py-0.5 rounded-lg text-[10px] font-black">
                {alerts.length}
              </span>
            </div>

            <div className="space-y-4 max-h-[300px] lg:max-h-[calc(100vh-400px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 text-xs">
              {alerts.length === 0 ? (
                <div className="py-8 text-center text-white/40">
                  <ShieldCheck className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest">System Nominal</p>
                </div>
              ) : (
                alerts.map(alert => (
                  <div key={alert.id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                        alert.severity === 'HIGH' ? 'bg-danger text-white' : 'bg-warning text-white'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-[8px] font-bold text-white/30">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[11px] font-bold text-white/80 leading-relaxed">
                       Alert in room <span className="text-white underline">{alert.roomName || 'Unknown'}</span> sensor <span className="text-white underline">{alert.deviceName || 'N/A'}</span> : {alert.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IoTMonitoring;
