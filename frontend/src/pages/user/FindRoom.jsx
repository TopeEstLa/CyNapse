import React, {useEffect, useState} from 'react';
import {roomApi} from '../../utils/api';
import {ArrowRight, Building2, CheckCircle2, Filter, Layers, Loader2, MapPin, Users, XCircle} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {RoomStatus} from '../../utils/constants';

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
            setRooms(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredRooms = Array.isArray(rooms) ? rooms.filter(room => {
        const matchCapacity = filters.minCapacity === '' || room.capacity >= parseInt(filters.minCapacity);
        const matchFloor = filters.floor === '' || room.floorNumber === parseInt(filters.floor);
        const matchAvailability = !filters.onlyAvailable || room.status === RoomStatus.FREE;
        return matchCapacity && matchFloor && matchAvailability;
    }) : [];

    const floors = Array.isArray(rooms) ? [...new Set(rooms.map(r => r.floorNumber))].sort((a, b) => a - b) : [];

    if (loading && rooms.length === 0) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary"/>
            <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Initializing map...</p>
        </div>
    );

    return (
        <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-8 md:space-y-10 text-gray-900">
            <header className="space-y-2 border-b pb-4 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">Find a Room</h1>
                <p className="text-gray-500 font-medium text-sm md:text-base">Locate available spaces for meetings or
                    activities.</p>
            </header>

            <section className="bg-white p-4 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-2 border-b border-gray-50 pb-4">
                    <Filter className="w-5 h-5 text-blue-600"/>
                    <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Filter Results</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                    <div className="space-y-2">
                        <label
                            className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                            <Users className="w-3 h-3 text-blue-500"/> Min. Capacity
                        </label>
                        <input
                            type="number"
                            placeholder="Ex: 5"
                            value={filters.minCapacity}
                            onChange={(e) => setFilters({...filters, minCapacity: e.target.value})}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-sm transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                            <Layers className="w-3 h-3 text-blue-500"/> Floor
                        </label>
                        <select
                            value={filters.floor}
                            onChange={(e) => setFilters({...filters, floor: e.target.value})}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-sm transition-all appearance-none"
                        >
                            <option value="">All Floors</option>
                            {floors.map(f => (
                                <option key={f} value={f}>Floor {f}</option>
                            ))}
                        </select>
                    </div>

                    <div
                        className="flex items-center justify-between sm:justify-start gap-4 py-2 px-2 bg-gray-50 sm:bg-transparent rounded-xl sm:rounded-none p-3 sm:p-0">
                        <span
                            className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Available only</span>
                        <button
                            onClick={() => setFilters({...filters, onlyAvailable: !filters.onlyAvailable})}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ring-2 ring-offset-2 ring-transparent ${filters.onlyAvailable ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${filters.onlyAvailable ? 'translate-x-6' : 'translate-x-1'}`}/>
                        </button>
                    </div>

                    <div className="hidden lg:flex justify-end">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rooms
                                found</p>
                            <p className="text-3xl font-black text-blue-600 tracking-tighter">{filteredRooms.length}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredRooms.map(room => (
                    <div
                        key={room.id}
                        className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all overflow-hidden flex flex-col"
                    >
                        <div className="p-6 space-y-4 flex-1">
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-lg bg-gray-100 text-gray-600">
                                    <MapPin className="w-5 h-5"/>
                                </div>
                                <div
                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        room.status === RoomStatus.FREE ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                                    }`}>
                                    {room.status === RoomStatus.FREE ? <CheckCircle2 className="w-3 h-3"/> :
                                        <XCircle className="w-3 h-3"/>}
                                    {room.status === RoomStatus.FREE ? 'Available' : 'Occupied'}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 uppercase truncate">{room.name}</h3>
                                <div className="flex items-center gap-4 mt-2">
                   <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                      <Layers className="w-3 h-3"/> Floor {room.floorNumber}
                   </span>
                                    <span
                                        className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                      <Users className="w-3 h-3"/> {room.capacity} Capacity
                   </span>
                                </div>
                            </div>

                            {room.status === RoomStatus.FREE && (
                                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                    <p className="text-[10px] font-bold text-green-600 uppercase mb-0.5">Quick
                                        access</p>
                                    <p className="text-xs font-medium text-green-700 italic">Suitable for immediate
                                        use.</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => navigate(`/monitoring/room/${room.id}`)}
                            className="w-full py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                        >
                            Check Sensors
                            <ArrowRight className="w-4 h-4"/>
                        </button>
                    </div>
                ))}

                {filteredRooms.length === 0 && (
                    <div
                        className="col-span-full py-20 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 space-y-4">
                        <Building2 className="w-12 h-12 text-gray-300 mx-auto"/>
                        <div>
                            <p className="text-gray-500 font-bold uppercase text-sm">No matching rooms</p>
                            <p className="text-gray-400 text-xs font-medium">Try adjusting your filters or checking
                                other floors.</p>
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
