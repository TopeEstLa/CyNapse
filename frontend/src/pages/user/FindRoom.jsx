import React, { useState, useEffect } from 'react';
import { roomApi } from '../../utils/api';
import { 
  Users, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Loader2, 
  Building2,
  Filter,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RoomStatus } from '../../utils/constants';

const FindRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minCapacity: '',
    floor: '',
    onlyAvailable: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await roomApi.list();
      setRooms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchCapacity = filters.minCapacity === '' || room.capacity >= parseInt(filters.minCapacity);
    const matchFloor = filters.floor === '' || room.floorNumber === parseInt(filters.floor);
    const matchAvailability = !filters.onlyAvailable || room.status === RoomStatus.FREE;
    return matchCapacity && matchFloor && matchAvailability;
  });

  const floors = [...new Set(rooms.map(r => r.floorNumber))].sort((a, b) => a - b);

  if (loading && rooms.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Initializing map...</p>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-10 text-gray-900">
      {/* Header Section */}
      <header className="space-y-2 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight uppercase">Find a Room</h1>
        <p className="text-gray-500 font-medium">Locate available spaces for meetings or activities.</p>
      </header>

      {/* Filters Bar */}
      <section className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 mb-2 border-b pb-4">
           <Filter className="w-5 h-5 text-blue-600" />
           <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">Filter Results</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <Users className="w-3 h-3" /> Min. Capacity
            </label>
            <input
              type="number"
              placeholder="Ex: 5"
              value={filters.minCapacity}
              onChange={(e) => setFilters({...filters, minCapacity: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <Layers className="w-3 h-3" /> Floor
            </label>
            <select
              value={filters.floor}
              onChange={(e) => setFilters({...filters, floor: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium transition-all appearance-none"
            >
              <option value="">All Floors</option>
              {floors.map(f => (
                <option key={f} value={f}>Floor {f}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 py-2 px-2">
            <button
              onClick={() => setFilters({...filters, onlyAvailable: !filters.onlyAvailable})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ring-2 ring-offset-2 ring-transparent ${filters.onlyAvailable ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${filters.onlyAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-xs font-bold text-gray-600 uppercase">Available only</span>
          </div>

          <div className="lg:col-span-1 md:col-span-3 flex justify-end">
             <div className="text-right hidden lg:block">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Rooms found</p>
                <p className="text-2xl font-bold text-blue-600">{filteredRooms.length}</p>
             </div>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => (
          <div 
            key={room.id}
            className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all overflow-hidden flex flex-col"
          >
            <div className="p-6 space-y-4 flex-1">
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-lg bg-gray-100 text-gray-600">
                   <MapPin className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  room.status === RoomStatus.FREE ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {room.status === RoomStatus.FREE ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {room.status === RoomStatus.FREE ? 'Available' : 'Occupied'}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 uppercase truncate">{room.name}</h3>
                <div className="flex items-center gap-4 mt-2">
                   <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                      <Layers className="w-3 h-3" /> Floor {room.floorNumber}
                   </span>
                   <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                      <Users className="w-3 h-3" /> {room.capacity} Capacity
                   </span>
                </div>
              </div>

              {room.status === RoomStatus.FREE && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                   <p className="text-[10px] font-bold text-green-600 uppercase mb-0.5">Quick access</p>
                   <p className="text-xs font-medium text-green-700 italic">Suitable for immediate use.</p>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate(`/monitoring/room/${room.id}`)}
              className="w-full py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
            >
              Check Sensors
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}

        {filteredRooms.length === 0 && (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 space-y-4">
             <Building2 className="w-12 h-12 text-gray-300 mx-auto" />
             <div>
                <p className="text-gray-500 font-bold uppercase text-sm">No matching rooms</p>
                <p className="text-gray-400 text-xs font-medium">Try adjusting your filters or checking other floors.</p>
             </div>
             <button 
              onClick={() => setFilters({minCapacity: '', floor: '', onlyAvailable: false})}
              className="text-blue-600 font-bold uppercase text-xs tracking-wider underline underline-offset-4"
             >
                Reset all filters
             </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default FindRoom;
