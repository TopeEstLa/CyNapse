import React, { useState, useEffect } from 'react';
import { roomApi } from '../../utils/api';
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
import { useAuth } from '../../context/AuthContext';
import { RoomStatus, Role } from '../../utils/constants';

const IoTMonitoring = () => {
  const [rooms, setRooms] = useState([]);
  const [overview, setOverview] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
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
      setLastRefresh(new Date());
      
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
    <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-8">
      <header className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Building Monitoring</h1>
          <p className="hidden sm:block text-gray-500 text-sm">Global view by floor and room.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-400 font-bold uppercase">
            Last update: {lastRefresh.toLocaleTimeString()}
          </span>
          <button 
            onClick={fetchData} 
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            aria-label="Refresh data"
          >
            <RefreshCcw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {overview && (
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Total Rooms</p>
            <p className="text-2xl font-bold text-gray-900">{overview.roomsTotal}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-blue-500">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Occupied</p>
            <p className="text-2xl font-bold text-blue-600">{overview.roomsOccupied}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-red-500">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">In Alert</p>
            <p className="text-2xl font-bold text-red-600">{overview.roomsInAlert}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Active Alerts</p>
            <p className="text-2xl font-bold text-yellow-600">{overview.activeAlerts}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-blue-500 hidden lg:block">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Avg. Temp</p>
            <p className="text-2xl font-bold text-blue-600">{overview.avgTemperature?.toFixed(1) || '0.0'}°C</p>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3 space-y-8">
          {sortedFloors.map(floor => (
            <div key={floor} className="space-y-4">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-bold text-gray-800">Floor {floor}</h2>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {roomsByFloor[floor].map(room => (
                  <button
                    key={room.id}
                    onClick={() => navigate(`/monitoring/room/${room.id}`)}
                    className="group relative bg-white border border-gray-200 rounded-xl p-6 text-left hover:border-blue-500 hover:shadow-md transition-all shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-900 truncate pr-4">{room.name}</h3>
                      <div className="flex gap-2">
                         {user?.role === Role.ADMIN && (
                           <div 
                             onClick={(e) => {
                               e.stopPropagation();
                               navigate(`/admin/rooms/${room.id}`);
                             }}
                             className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                           >
                             <ShieldCheck className="w-4 h-4" />
                           </div>
                         )}
                         <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                       <div className="flex items-center gap-1">
                         <Users className="w-4 h-4" />
                         <span>{room.capacity}</span>
                       </div>
                       <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                         room.status === RoomStatus.ALERT ? 'bg-red-100 text-red-700' :
                         room.status === RoomStatus.OCCUPIED ? 'bg-blue-100 text-blue-700' :
                         'bg-green-100 text-green-700'
                       }`}>
                         {room.status}
                       </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
};

export default IoTMonitoring;
