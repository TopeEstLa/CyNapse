import React, { useState, useEffect } from 'react';
import { api, adminApi } from '../../../utils/api.js';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [formData, setFormData] = useState({ name: '', floorNumber: 0, capacity: 0 });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await api.get('/api/admin/room/list');
      setRooms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (room = null) => {
    if (room) {
      setCurrentRoom(room);
      setFormData({ name: room.name, floorNumber: room.floorNumber, capacity: room.capacity });
    } else {
      setCurrentRoom(null);
      setFormData({ name: '', floorNumber: 0, capacity: 0 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRoom(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentRoom) {
        await adminApi.updateRoom({ ...formData, id: currentRoom.id });
      } else {
        await adminApi.createRoom(formData);
      }
      fetchRooms();
      handleCloseModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this room?')) {
      try {
        await adminApi.deleteRoom(id);
        fetchRooms();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredRooms = rooms.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Loading rooms...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Rooms</h1>
          <p className="text-gray-500">Add, edit or delete building rooms.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded w-full text-sm"
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={16} /> Add Room
          </button>
        </div>
      </div>

      <div className="bg-white border rounded overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Room Name</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Floor</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Capacity</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredRooms.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{r.name}</td>
                <td className="px-6 py-4">{r.floorNumber}</td>
                <td className="px-6 py-4">{r.capacity} people</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/admin/rooms/${r.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Edit details">
                      <Edit2 size={16} />
                    </Link>
                    <button onClick={() => handleDelete(r.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded shadow-lg w-full max-w-md">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">{currentRoom ? 'Edit Room' : 'New Room'}</h2>
              <button onClick={handleCloseModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Room Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Floor</label>
                  <input
                    type="number"
                    required
                    value={formData.floorNumber}
                    onChange={(e) => setFormData({ ...formData, floorNumber: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Capacity</label>
                  <input
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  {currentRoom ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;
