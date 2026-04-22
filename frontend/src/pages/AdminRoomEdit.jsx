import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { 
  Home, 
  Cpu, 
  Plus, 
  Loader2, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  ArrowLeft,
  Settings,
  Activity,
  Signal,
  Thermometer,
  Wind,
  Users,
  Lightbulb,
  Droplets
} from 'lucide-react';

const AdminRoomEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState({ name: '', floorNumber: 0, capacity: 0 });
  const [devices, setDevices] = useState([]);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [deviceFormData, setDeviceFormData] = useState({ name: '', type: 'THERMOMETER', status: 'ONLINE' });
  const [savingRoom, setSavingRoom] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [room, roomDevices] = await Promise.all([
        api.get(`/api/admin/room/get?id=${id}`),
        api.get(`/api/admin/device/list?roomId=${id}`)
      ]);
      setRoomData({ name: room.name, floorNumber: room.floorNumber, capacity: room.capacity });
      setDevices(roomDevices);
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
      await api.post('/api/admin/room/update', { ...roomData, id: parseInt(id) });
      alert('Room updated');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingRoom(false);
    }
  };

  const handleDeviceOpenModal = (device = null) => {
    if (device) {
      setCurrentDevice(device);
      setDeviceFormData({ name: device.name, type: device.type, status: device.status });
    } else {
      setCurrentDevice(null);
      setDeviceFormData({ name: '', type: 'THERMOMETER', status: 'ONLINE' });
    }
    setIsDeviceModalOpen(true);
  };

  const handleDeviceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentDevice) {
        await api.post('/api/admin/device/update', { ...deviceFormData, id: currentDevice.id, roomId: parseInt(id) });
      } else {
        await api.post('/api/admin/device/create', { ...deviceFormData, roomId: parseInt(id) });
      }
      fetchData();
      setIsDeviceModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeviceDelete = async (deviceId) => {
    if (window.confirm('Delete this sensor?')) {
      try {
        await api.delete(`/api/admin/device/delete?id=${deviceId}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'THERMOMETER': return <Thermometer className="w-4 h-4" />;
      case 'HUMIDITY_SENSOR': return <Droplets className="w-4 h-4" />;
      case 'CO2_SENSOR': return <Wind className="w-4 h-4" />;
      case 'PEOPLE_COUNTER': return <Users className="w-4 h-4" />;
      case 'SMART_LIGHT': return <Lightbulb className="w-4 h-4" />;
      default: return <Cpu className="w-4 h-4" />;
    }
  };

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mt-20" />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col gap-2">
        <Link to="/admin/rooms" className="text-[10px] font-black text-gray-400 hover:text-accent flex items-center gap-1 uppercase tracking-widest transition-colors w-fit">
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-tight uppercase">Configuration: {roomData.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1">
           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-accent/10 rounded-xl text-accent">
                    <Settings className="w-5 h-5" />
                 </div>
                 <h2 className="text-lg font-black text-gray-900 uppercase">Properties</h2>
              </div>

              <form onSubmit={handleRoomSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Name</label>
                  <input
                    type="text"
                    required
                    value={roomData.name}
                    onChange={(e) => setRoomData({ ...roomData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold"
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
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Capacity</label>
                    <input
                      type="number"
                      required
                      value={roomData.capacity}
                      onChange={(e) => setRoomData({ ...roomData, capacity: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={savingRoom}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all font-black uppercase text-xs tracking-widest shadow-lg shadow-gray-200 disabled:opacity-50"
                >
                  {savingRoom ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save
                </button>
              </form>
           </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm min-h-[400px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-xl text-accent">
                       <Cpu className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-black text-gray-900 uppercase">IoT Sensors</h2>
                 </div>
                 <button
                    onClick={() => handleDeviceOpenModal()}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white rounded-xl hover:bg-accent/90 transition-all font-bold text-[10px] uppercase tracking-widest shadow-md shadow-accent/20"
                 >
                    <Plus className="w-4 h-4" />
                    Add
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {devices.map((device) => (
                   <div key={device.id} className="p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-accent/10 hover:bg-white transition-all group">
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white rounded-xl shadow-sm text-gray-400">
                               {getDeviceIcon(device.type)}
                            </div>
                            <div>
                               <p className="text-sm font-black text-gray-900 leading-tight">{device.name}</p>
                               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{device.type.replace('_', ' ')}</p>
                            </div>
                         </div>
                         <div className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase ${
                            device.status === 'ONLINE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                         }`}>
                            {device.status}
                         </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                         <p className="text-[9px] font-black text-gray-300 uppercase">ID: {device.id}</p>
                         <div className="flex gap-1">
                            <button 
                               onClick={() => handleDeviceOpenModal(device)}
                               className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
                            >
                               <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                               onClick={() => handleDeviceDelete(device.id)}
                               className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                               <Trash2 className="w-3.5 h-3.5" />
                            </button>
                         </div>
                      </div>
                   </div>
                 ))}
                 
                 {devices.length === 0 && (
                   <div className="col-span-full py-16 text-center space-y-4">
                      <Activity className="w-10 h-10 text-gray-100 mx-auto" />
                      <p className="text-gray-300 font-bold uppercase tracking-widest text-[10px]">No sensor</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {isDeviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 uppercase">{currentDevice ? 'Edit' : 'New'}</h2>
              <button onClick={() => setIsDeviceModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleDeviceSubmit} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sensor name</label>
                <input
                  type="text"
                  required
                  value={deviceFormData.name}
                  onChange={(e) => setDeviceFormData({ ...deviceFormData, name: e.target.value })}
                  className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
                  <select
                    value={deviceFormData.type}
                    onChange={(e) => setDeviceFormData({ ...deviceFormData, type: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white outline-none font-bold text-sm"
                  >
                    <option value="THERMOMETER">Thermometer</option>
                    <option value="HUMIDITY_SENSOR">Humidity</option>
                    <option value="CO2_SENSOR">CO2</option>
                    <option value="PEOPLE_COUNTER">Counter</option>
                    <option value="SMART_LIGHT">Light</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Initial Status</label>
                  <select
                    value={deviceFormData.status}
                    onChange={(e) => setDeviceFormData({ ...deviceFormData, status: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white outline-none font-bold text-sm"
                  >
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeviceModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-100 text-gray-400 rounded-2xl hover:bg-gray-50 transition-colors font-black uppercase text-[10px] tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-accent text-white rounded-2xl hover:bg-accent/90 transition-colors font-black uppercase text-[10px] tracking-widest shadow-lg shadow-accent/20"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoomEdit;
