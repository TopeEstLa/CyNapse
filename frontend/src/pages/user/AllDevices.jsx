import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deviceApi, roomApi } from '../../utils/api';
import { Loader2, Search, Zap, Activity, Thermometer, Droplets, Wind, Lightbulb, Heater, Home } from 'lucide-react';

const AllDevices = () => {
  const [devices, setDevices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchBar] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterRoom, setFilterRoom] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sensors, actuators, roomsData] = await Promise.all([
          deviceApi.sensors(),
          deviceApi.actuators(),
          roomApi.list()
        ]);

        const mappedSensors = Array.isArray(sensors) ? sensors.map(s => ({ ...s, deviceCategory: 'SENSOR' })) : [];
        const mappedActuators = Array.isArray(actuators) ? actuators.map(a => ({ ...a, deviceCategory: 'ACTUATOR' })) : [];

        setDevices([...mappedSensors, ...mappedActuators]);
        setRooms(roomsData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'THERMOMETER': return <Thermometer className="text-orange-500" />;
      case 'HUMIDITY_SENSOR': return <Droplets className="text-blue-500" />;
      case 'CO2_SENSOR': return <Wind className="text-green-500" />;
      case 'SMART_LIGHT': return <Lightbulb className="text-yellow-500" />;
      case 'HEATER': return <Heater className="text-red-500" />;
      default: return <Activity className="text-gray-500" />;
    }
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || device.deviceCategory === filterType;
    const matchesRoom = filterRoom === 'ALL' || device.room?.id?.toString() === filterRoom;
    return matchesSearch && matchesType && matchesRoom;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-gray-500 font-medium text-lg">Loading your infrastructure...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 py-4 md:py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3">
          <Zap className="text-blue-600" fill="currentColor" size={28} md:size={32} /> All Devices
        </h1>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search device..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-48 lg:w-64"
              value={searchTerm}
              onChange={(e) => setSearchBar(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-1 sm:flex-initial">
            <select
              className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="SENSOR">Sensors</option>
              <option value="ACTUATOR">Actuators</option>
            </select>

            <select
              className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={filterRoom}
              onChange={(e) => setFilterRoom(e.target.value)}
            >
              <option value="ALL">All Rooms</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredDevices.map((device) => (
          <div
            key={`${device.deviceCategory}-${device.id}`}
            onClick={() => navigate(`/device/${device.deviceCategory.toLowerCase()}-${device.id}`)}
            className="group cursor-pointer bg-white border border-gray-200 rounded-2xl p-5 shadow-sm transition-all hover:shadow-xl hover:border-blue-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3">
              <div className={`w-3 h-3 rounded-full ${device.status === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'} shadow-sm animate-pulse`}></div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                {getDeviceIcon(device.type)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{device.name}</h3>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-tight flex items-center gap-1">
                  <Home size={10} /> {device.room?.name || 'Unassigned'}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center border border-gray-100 group-hover:bg-blue-50/50 transition-colors">
              <span className="text-xs text-gray-400 font-bold uppercase mb-1">
                {device.deviceCategory === 'SENSOR' ? 'Last Reading' : 'Current State'}
              </span>
              <span className="text-2xl font-black text-gray-800">
                {device.deviceCategory === 'SENSOR' 
                  ? (device.readings && device.readings.length > 0 ? `${device.readings[0].value}` : 'N/A')
                  : device.currentState || 'UNKNOWN'
                }
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-gray-400 font-medium italic">
              <span>{device.deviceCategory}</span>
              <span className="group-hover:text-blue-500 transition-colors font-bold not-italic">View details →</span>
            </div>
          </div>
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl py-20 text-center">
          <p className="text-gray-400 text-lg">No devices matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AllDevices;
