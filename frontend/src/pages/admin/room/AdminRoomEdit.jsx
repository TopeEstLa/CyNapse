import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, adminApi } from '../../../utils/api.js';
import { 
  Home, 
  Cpu, 
  Plus, 
  Loader2, 
  Edit2, 
  Trash2, 
  Save, 
  ArrowLeft,
  Settings,
  Activity,
  Signal,
  Thermometer,
  Wind,
  Users,
  Lightbulb,
  Droplets,
  Flame
} from 'lucide-react';
import { DeviceType } from '../../../utils/constants.js';

const AdminRoomEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState({ name: '', floorNumber: 0, capacity: 0 });
  const [sensors, setSensors] = useState([]);
  const [actuators, setActuators] = useState([]);
  const [savingRoom, setSavingRoom] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [room, roomSensors, roomActuators] = await Promise.all([
        api.get(`/api/admin/room/get?id=${id}`),
        api.get(`/api/admin/sensor/list?roomId=${id}`),
        api.get(`/api/admin/actuator/list?roomId=${id}`)
      ]);
      setRoomData({ name: room.name, floorNumber: room.floorNumber, capacity: room.capacity });
      setSensors(roomSensors);
      setActuators(roomActuators);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    setSavingRoom(true);
    try {
      await adminApi.updateRoom({ ...roomData, id: parseInt(id) });
      alert('Room updated');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingRoom(false);
    }
  };

  const handleSensorDelete = async (sensorId) => {
    if (window.confirm('Delete this sensor?')) {
      try {
        await api.delete(`/api/admin/sensor/delete?id=${sensorId}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleActuatorDelete = async (actuatorId) => {
    if (window.confirm('Delete this actuator?')) {
      try {
        await api.delete(`/api/admin/actuator/delete?id=${actuatorId}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case DeviceType.THERMOMETER: return <Thermometer className="w-4 h-4" />;
      case DeviceType.HEATER: return <Flame className="w-4 h-4" />;
      case DeviceType.HUMIDITY_SENSOR: return <Droplets className="w-4 h-4" />;
      case DeviceType.CO2_SENSOR: return <Wind className="w-4 h-4" />;
      case DeviceType.PEOPLE_COUNTER: return <Users className="w-4 h-4" />;
      case DeviceType.SMART_LIGHT: return <Lightbulb className="w-4 h-4" />;
      default: return <Cpu className="w-4 h-4" />;
    }
  };

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mt-20" />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10 text-gray-900">
      <div className="flex flex-col gap-2">
        <Link to="/admin/rooms" className="text-[10px] font-black text-gray-400 hover:text-primary flex items-center gap-1 uppercase tracking-widest transition-colors w-fit">
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>
        <h1 className="text-2xl font-black tracking-tight leading-tight uppercase">Configuration: {roomData.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-1">
           <div className="bg-surface p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 sticky top-24">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <Settings className="w-5 h-5" />
                 </div>
                 <h2 className="text-lg font-black uppercase">Properties</h2>
              </div>

              <form onSubmit={handleRoomSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Name</label>
                  <input
                    type="text"
                    required
                    value={roomData.name}
                    onChange={(e) => setRoomData({ ...roomData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-background-light border border-transparent rounded-2xl focus:bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Floor</label>
                    <input
                      type="number"
                      required
                      value={roomData.floorNumber}
                      onChange={(e) => setRoomData({ ...roomData, floorNumber: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-background-light border border-transparent rounded-2xl focus:bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Capacity</label>
                    <input
                      type="number"
                      required
                      value={roomData.capacity}
                      onChange={(e) => setRoomData({ ...roomData, capacity: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-background-light border border-transparent rounded-2xl focus:bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={savingRoom}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-background-dark text-white rounded-2xl hover:bg-black transition-all font-black uppercase text-xs tracking-widest shadow-lg shadow-gray-200 disabled:opacity-50"
                >
                  {savingRoom ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save
                </button>
              </form>
           </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
           {/* Sensors Section */}
           <div className="bg-surface p-6 rounded-3xl border border-gray-100 shadow-sm min-h-[300px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                       <Signal className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-black uppercase">Sensors</h2>
                 </div>
                 <Link
                    to={`/admin/sensors/new?roomId=${id}`}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-bold text-[10px] uppercase tracking-widest shadow-md shadow-primary/20"
                 >
                    <Plus className="w-4 h-4" />
                    Add Sensor
                 </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {sensors.map((sensor) => (
                   <div key={sensor.id} className="p-5 bg-background-light rounded-2xl border border-transparent hover:border-primary/10 hover:bg-surface transition-all group">
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-surface rounded-xl shadow-sm text-gray-400">
                               {getDeviceIcon(sensor.type)}
                            </div>
                            <div>
                               <p className="text-sm font-black leading-tight">{sensor.name}</p>
                               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{sensor.type.replace('_', ' ')}</p>
                            </div>
                         </div>
                         <div className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase ${
                            sensor.status === 'ONLINE' ? 'bg-secondary/10 text-secondary' : 'bg-danger/10 text-danger'
                         }`}>
                            {sensor.status}
                         </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                         <p className="text-[9px] font-black text-gray-300 uppercase">ID: {sensor.id}</p>
                         <div className="flex gap-1">
                            <Link 
                               to={`/admin/sensors/${sensor.id}`}
                               className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            >
                               <Edit2 className="w-3.5 h-3.5" />
                            </Link>
                            <button 
                               onClick={() => handleSensorDelete(sensor.id)}
                               className="p-2 text-gray-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                            >
                               <Trash2 className="w-3.5 h-3.5" />
                            </button>
                         </div>
                      </div>
                   </div>
                 ))}
                 
                 {sensors.length === 0 && (
                   <div className="col-span-full py-16 text-center space-y-4 text-gray-300">
                      <Activity className="w-10 h-10 mx-auto" />
                      <p className="font-bold uppercase tracking-widest text-[10px]">No sensor</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Actuators Section */}
           <div className="bg-surface p-6 rounded-3xl border border-gray-100 shadow-sm min-h-[300px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                       <Cpu className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-black uppercase">Actuators</h2>
                 </div>
                 <Link
                    to={`/admin/actuators/new?roomId=${id}`}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-dark text-white rounded-xl hover:bg-black transition-all font-bold text-[10px] uppercase tracking-widest shadow-md shadow-primary-dark/20"
                 >
                    <Plus className="w-4 h-4" />
                    Add Actuator
                 </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {actuators.map((actuator) => (
                   <div key={actuator.id} className="p-5 bg-background-light rounded-2xl border border-transparent hover:border-primary/10 hover:bg-surface transition-all group">
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-surface rounded-xl shadow-sm text-gray-400">
                               {getDeviceIcon(actuator.type)}
                            </div>
                            <div>
                               <p className="text-sm font-black leading-tight">{actuator.name}</p>
                               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{actuator.type.replace('_', ' ')}</p>
                            </div>
                         </div>
                         <div className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase ${
                            actuator.status === 'ONLINE' ? 'bg-secondary/10 text-secondary' : 'bg-danger/10 text-danger'
                         }`}>
                            {actuator.status}
                         </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                         <div>
                            <p className="text-[9px] font-black text-gray-300 uppercase">ID: {actuator.id}</p>
                            <p className="text-[8px] font-bold text-primary uppercase mt-1">State: {actuator.currentState || 'N/A'}</p>
                         </div>
                         <div className="flex gap-1">
                            <Link 
                               to={`/admin/actuators/${actuator.id}`}
                               className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            >
                               <Edit2 className="w-3.5 h-3.5" />
                            </Link>
                            <button 
                               onClick={() => handleActuatorDelete(actuator.id)}
                               className="p-2 text-gray-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                            >
                               <Trash2 className="w-3.5 h-3.5" />
                            </button>
                         </div>
                      </div>
                   </div>
                 ))}
                 
                 {actuators.length === 0 && (
                   <div className="col-span-full py-16 text-center space-y-4 text-gray-300">
                      <Cpu className="w-10 h-10 mx-auto" />
                      <p className="font-bold uppercase tracking-widest text-[10px]">No actuator</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRoomEdit;
