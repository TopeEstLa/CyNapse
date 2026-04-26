import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../../utils/api.js';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Signal
} from 'lucide-react';
import { DeviceType } from '../../../utils/constants.js';

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

  if (loading) return <div className="p-8 text-center">Loading sensor details...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 border rounded hover:bg-gray-50">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">
          {id === 'new' ? 'Add New Sensor' : `Edit Sensor: ${formData.name}`}
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-6 border rounded shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-4 text-blue-600 font-bold border-b pb-2">
          <Signal size={20} />
          <span>Sensor Configuration</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sensor Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="e.g. Temperature Sensor 1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Sensor Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2 border rounded bg-white"
              >
                {Object.values(DeviceType).map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2 border rounded bg-white"
              >
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Assign to Room</label>
            <select
              required
              value={formData.roomId}
              onChange={(e) => setFormData({ ...formData, roomId: parseInt(e.target.value) })}
              className="w-full p-2 border rounded bg-white"
            >
              <option value="">Select a room...</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>{room.name} (Floor {room.floorNumber})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {id === 'new' ? 'Create Sensor' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSensorEdit;
