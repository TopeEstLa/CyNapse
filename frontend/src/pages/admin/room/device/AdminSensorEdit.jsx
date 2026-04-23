import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../../../utils/api.js';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Signal,
  Cpu,
  Thermometer,
  Wind,
  Users,
  Lightbulb,
  Droplets,
  Flame
} from 'lucide-react';
import { DeviceType } from '../../../../utils/constants.js';

const AdminSensorEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get('roomId');

  const [loading, setLoading] = useState(id !== 'new');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: DeviceType.THERMOMETER,
    status: 'ONLINE',
    roomId: roomId ? parseInt(roomId) : ''
  });
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
    if (id !== 'new') {
      fetchSensor();
    }
  }, [id]);

  const fetchRooms = async () => {
    try {
      const data = await api.get('/api/admin/room/list');
      setRooms(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSensor = async () => {
    try {
      const data = await api.get(`/api/admin/sensor/get?id=${id}`);
      setFormData({
        name: data.name,
        type: data.type,
        status: data.status,
        roomId: data.roomId
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (id === 'new') {
        await api.post('/api/admin/sensor/create', formData);
      } else {
        await api.post('/api/admin/sensor/update', { ...formData, id: parseInt(id) });
      }
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert('Error saving sensor');
    } finally {
      setSaving(false);
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case DeviceType.THERMOMETER: return <Thermometer className="w-6 h-6" />;
      case DeviceType.HEATER: return <Flame className="w-6 h-6" />;
      case DeviceType.HUMIDITY_SENSOR: return <Droplets className="w-6 h-6" />;
      case DeviceType.CO2_SENSOR: return <Wind className="w-6 h-6" />;
      case DeviceType.PEOPLE_COUNTER: return <Users className="w-6 h-6" />;
      case DeviceType.SMART_LIGHT: return <Lightbulb className="w-6 h-6" />;
      default: return <Cpu className="w-6 h-6" />;
    }
  };

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mt-20" />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10 text-gray-900">
      <div className="flex flex-col gap-2">
        <button onClick={() => navigate(-1)} className="text-[10px] font-black text-gray-400 hover:text-primary flex items-center gap-1 uppercase tracking-widest transition-colors w-fit">
          <ArrowLeft className="w-3 h-3" /> Back
        </button>
        <h1 className="text-2xl font-black tracking-tight leading-tight uppercase">
          {id === 'new' ? 'New Sensor' : `Edit Sensor: ${formData.name}`}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Signal className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black uppercase">Configuration</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-3 bg-background-light border border-transparent rounded-2xl focus:bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold"
                  placeholder="e.g. Main Thermometer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-5 py-3 bg-background-light border border-transparent rounded-2xl focus:bg-surface outline-none font-bold text-sm"
                  >
                    {Object.values(DeviceType).map(type => (
                      <option key={type} value={type}>{type.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-5 py-3 bg-background-light border border-transparent rounded-2xl focus:bg-surface outline-none font-bold text-sm"
                  >
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Room</label>
                <select
                  required
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: parseInt(e.target.value) })}
                  className="w-full px-5 py-3 bg-background-light border border-transparent rounded-2xl focus:bg-surface outline-none font-bold text-sm"
                >
                  <option value="">Select a room</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.name} (Floor {room.floorNumber})</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-background-dark text-white rounded-2xl hover:bg-black transition-all font-black uppercase text-xs tracking-widest shadow-lg shadow-gray-200 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Sensor
            </button>
          </form>
        </div>

        <div className="md:col-span-1">
          <div className="bg-background-dark p-8 rounded-3xl text-white space-y-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {getDeviceIcon(formData.type)}
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Preview</p>
              <h3 className="text-xl font-black uppercase tracking-tight">{formData.name || 'Unnamed Sensor'}</h3>
              <div className={`mt-2 inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                formData.status === 'ONLINE' ? 'bg-secondary text-white' : 'bg-danger text-white'
              }`}>
                {formData.status}
              </div>
            </div>
            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60">
                <span>Type</span>
                <span className="text-white opacity-100">{formData.type.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60">
                <span>Room ID</span>
                <span className="text-white opacity-100">{formData.roomId || 'Not set'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSensorEdit;
