import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { 
  Search, 
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
      const data = await api.get('/api/monitoring/rooms');
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
    const matchAvailability = !filters.onlyAvailable || room.status === 'FREE';
    return matchCapacity && matchFloor && matchAvailability;
  });

  const floors = [...new Set(rooms.map(r => r.floorNumber))].sort((a, b) => a - b);

  if (loading && rooms.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 animate-spin text-accent" />
      <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Initialisation du plan...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Header Section */}
      <section className="space-y-4 text-center md:text-left">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase leading-none">Trouver une salle</h1>
        <p className="text-gray-500 font-medium italic">Localisez instantanément un espace disponible pour vos réunions ou activités.</p>
      </section>

      {/* Filters Bar */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 mb-2">
           <Filter className="w-5 h-5 text-accent" />
           <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Critères de recherche</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400 flex items-center gap-2">
              <Users className="w-3 h-3" /> Capacité Min.
            </label>
            <input
              type="number"
              placeholder="Ex: 5"
              value={filters.minCapacity}
              onChange={(e) => setFilters({...filters, minCapacity: e.target.value})}
              className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none font-bold transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400 flex items-center gap-2">
              <Layers className="w-3 h-3" /> Étage
            </label>
            <select
              value={filters.floor}
              onChange={(e) => setFilters({...filters, floor: e.target.value})}
              className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none font-bold transition-all appearance-none"
            >
              <option value="">Tous les étages</option>
              {floors.map(f => (
                <option key={f} value={f}>Étage {f}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 py-3 px-2">
            <button
              onClick={() => setFilters({...filters, onlyAvailable: !filters.onlyAvailable})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ring-2 ring-offset-2 ring-transparent ${filters.onlyAvailable ? 'bg-accent' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${filters.onlyAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">Uniquement disponibles</span>
          </div>

          <div className="lg:col-span-1 md:col-span-3 flex justify-end">
             <div className="text-right hidden lg:block">
                <p className="text-[10px] font-black text-gray-400 uppercase">Résultats trouvés</p>
                <p className="text-2xl font-black text-accent">{filteredRooms.length}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => (
          <div 
            key={room.id}
            className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col"
          >
            <div className="p-8 space-y-6 flex-1">
              <div className="flex justify-between items-start">
                <div className={`p-4 rounded-2xl bg-opacity-10 ${room.status === 'FREE' ? 'bg-green-500 text-green-600' : 'bg-blue-500 text-blue-600'}`}>
                   <MapPin className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  room.status === 'FREE' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {room.status === 'FREE' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {room.status === 'FREE' ? 'Disponible' : 'Occupée'}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-gray-900 uppercase truncate">{room.name}</h3>
                <div className="flex items-center gap-4 mt-2">
                   <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <Layers className="w-3 h-3" /> Étage {room.floorNumber}
                   </span>
                   <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <Users className="w-3 h-3" /> {room.capacity} pers. max
                   </span>
                </div>
              </div>

              {room.status === 'FREE' && (
                <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                   <p className="text-[10px] font-black text-green-700 uppercase tracking-widest leading-none mb-1">Idéal pour</p>
                   <p className="text-xs font-bold text-green-600 italic">Réunion immédiate, travail collaboratif.</p>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate(`/monitoring/room/${room.id}`)}
              className="w-full py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-accent hover:text-white hover:border-accent transition-all group-hover:bg-gray-100"
            >
              Consulter les capteurs
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}

        {filteredRooms.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 space-y-4">
             <Building2 className="w-16 h-16 text-gray-200 mx-auto" />
             <div className="space-y-1">
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-sm">Aucune salle ne correspond</p>
                <p className="text-gray-300 text-xs font-medium italic">Essayez de modifier vos filtres ou de changer d'étage.</p>
             </div>
             <button 
              onClick={() => setFilters({minCapacity: '', floor: '', onlyAvailable: false})}
              className="text-accent font-black uppercase text-[10px] tracking-widest underline decoration-2 underline-offset-4"
             >
                Réinitialiser les filtres
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindRoom;
