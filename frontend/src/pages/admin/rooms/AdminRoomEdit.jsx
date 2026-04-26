import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, adminApi } from '../../../utils/api.js';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  ArrowLeft,
  Settings,
  Activity
} from 'lucide-react';

const AdminRoomEdit = () => {
  const { id } = useParams();
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
      alert('Room updated successfully');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingRoom(false);
    }
  };

  const handleDeleteDevice = async (type, deviceId) => {
    if (window.confirm(`Delete this ${type}?`)) {
      try {
        await api.delete(`/api/admin/${type}/delete?id=${deviceId}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading room data...</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      <header className="flex items-center gap-4">
        <Link to="/admin/rooms" className="p-2 border rounded hover:bg-gray-50"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="text-2xl font-bold">Room Configuration: {roomData.name}</h1>
          <p className="text-gray-500 text-sm">Manage room properties and devices.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <section className="bg-white p-6 border rounded shadow-sm sticky top-24">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Settings size={20} className="text-blue-600" />
              General Properties
            </h2>
            <form onSubmit={handleRoomSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Room Name</label>
                <input
                  type="text"
                  required
                  value={roomData.name}
                  onChange={(e) => setRoomData({ ...roomData, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Floor</label>
                <input
                  type="number"
                  required
                  value={roomData.floorNumber}
                  onChange={(e) => setRoomData({ ...roomData, floorNumber: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Capacity</label>
                <input
                  type="number"
                  required
                  value={roomData.capacity}
                  onChange={(e) => setRoomData({ ...roomData, capacity: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="submit"
                disabled={savingRoom}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {savingRoom ? 'Saving...' : <><Save size={18} /> Save Properties</>}
              </button>
            </form>
          </section>
        </div>

        <div className="md:col-span-2 space-y-8">
          <section className="bg-white p-6 border rounded shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Activity size={20} className="text-green-600" /> Sensors
              </h2>
              <Link to={`/admin/sensors/new?roomId=${id}`} className="text-sm bg-gray-100 px-3 py-1 rounded border hover:bg-gray-200 flex items-center gap-1">
                <Plus size={14} /> Add Sensor
              </Link>
            </div>
            <div className="divide-y border-t border-b">
              {sensors.length > 0 ? sensors.map(s => (
                <div key={s.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-gray-500 uppercase">{s.type.replace('_', ' ')} • ID: {s.id}</div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/admin/sensors/${s.id}?roomId=${id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></Link>
                    <button onClick={() => handleDeleteDevice('sensor', s.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                  </div>
                </div>
              )) : <div className="py-8 text-center text-gray-400 italic">No sensors registered.</div>}
            </div>
          </section>

          <section className="bg-white p-6 border rounded shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Activity size={20} className="text-purple-600" /> Actuators
              </h2>
              <Link to={`/admin/actuators/new?roomId=${id}`} className="text-sm bg-gray-100 px-3 py-1 rounded border hover:bg-gray-200 flex items-center gap-1">
                <Plus size={14} /> Add Actuator
              </Link>
            </div>
            <div className="divide-y border-t border-b">
              {actuators.length > 0 ? actuators.map(a => (
                <div key={a.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-xs text-gray-500 uppercase">{a.type.replace('_', ' ')} • ID: {a.id}</div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/admin/actuators/${a.id}?roomId=${id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></Link>
                    <button onClick={() => handleDeleteDevice('actuator', a.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                  </div>
                </div>
              )) : <div className="py-8 text-center text-gray-400 italic">No actuators registered.</div>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminRoomEdit;
