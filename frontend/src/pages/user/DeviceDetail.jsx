import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { deviceApi, BASE_URL } from '../../utils/api';
import { 
  ArrowLeft, 
  Thermometer, 
  Users, 
  Wind, 
  Clock, 
  Loader2, 
  RefreshCcw, 
  Cpu, 
  History as HistoryIcon,
  ShieldCheck,
  Activity,
  Droplets,
  Lightbulb,
  Signal,
  BarChart3,
  Flame,
  Zap,
  FileText,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DeviceType, Role } from '../../utils/constants';

const DeviceDetail = () => {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Robust ID parsing
  const isSensor = deviceId?.startsWith('sensor-');
  const isActuator = deviceId?.startsWith('actuator-');
  const trueId = deviceId?.split('-')[1];

  const [device, setDevice] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [manualValue, setManualValue] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const canDownloadReport = user && [Role.ADVANCED, Role.EXPERT, Role.ADMIN].includes(user.role);
  const canControl = user && [Role.EXPERT, Role.ADMIN].includes(user.role);
  const canViewHistory = user && [Role.ADVANCED, Role.EXPERT, Role.ADMIN].includes(user.role);

  useEffect(() => {
    if (!deviceId || (!isSensor && !isActuator) || !trueId) {
      setError("Invalid device ID format");
      setLoading(false);
      return;
    }
    
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [deviceId]);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      let deviceData;

      if (isSensor) {
        deviceData = await deviceApi.sensorDetails(trueId);
        setDevice(deviceData);

        const sortedReadings = (deviceData.readings || []).sort((a, b) =>
          new Date(b.capturedAt) - new Date(a.capturedAt)
        );
        setHistory(sortedReadings);
      } else if (isActuator) {
        deviceData = await deviceApi.actuatorDetails(trueId);
        setDevice(deviceData);

        const sortedHistory = (deviceData.history || []).sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setHistory(sortedHistory);
        setManualValue(deviceData.currentState || '');
      }
      setLastRefresh(new Date());

    } catch (err) {
      console.error("Error fetching device details:", err);
      setError(err.message || "Failed to load device data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
      const endpoint = isSensor ? `${BASE_URL}/api/reports/sensors/${trueId}` : `${BASE_URL}/api/reports/actuators/${trueId}`;
      const response = await fetch(endpoint, {
        method: 'GET',
      });
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${isSensor ? 'sensor' : 'actuator'}-${device?.name || trueId}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert('Failed to download report');
    } finally {
      setDownloading(false);
    }
  };

  const handleManualControl = async () => {
    try {
      setRefreshing(true);
      await deviceApi.updateActuatorState(trueId, manualValue);
      alert('State updated successfully');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to update state');
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE': return 'text-secondary bg-secondary/10';
      case 'OFFLINE': return 'text-danger bg-danger/10';
      case 'MAINTENANCE': return 'text-warning bg-warning/10';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case DeviceType.THERMOMETER: return <Thermometer className="w-8 h-8" />;
      case DeviceType.HEATER: return <Flame className="w-8 h-8" />;
      case DeviceType.HUMIDITY_SENSOR: return <Droplets className="w-8 h-8" />;
      case DeviceType.CO2_SENSOR: return <Wind className="w-8 h-8" />;
      case DeviceType.PEOPLE_COUNTER: return <Users className="w-8 h-8" />;
      case DeviceType.SMART_LIGHT: return <Lightbulb className="w-8 h-8" />;
      default: return <Cpu className="w-8 h-8" />;
    }
  };

  const getDeviceUnit = (type) => {
    switch (type) {
      case DeviceType.THERMOMETER: return '°C';
      case DeviceType.HUMIDITY_SENSOR: return '%';
      case DeviceType.CO2_SENSOR: return 'ppm';
      case DeviceType.PEOPLE_COUNTER: return 'ppl.';
      default: return '';
    }
  };

  const formatValue = (val, type) => {
    if (val === null || val === undefined) return '--';
    if (type === DeviceType.SMART_LIGHT) return val === '1' || val === 1 || val === 'ON' ? 'On' : 'Off';
    const numVal = parseFloat(val);
    return isNaN(numVal) ? val : numVal.toFixed(1);
  };

  const renderSimpleChart = () => {
    if (history.length < 2) return null;

    const numericData = history
      .map(h => ({ 
         value: parseFloat(isSensor ? h.value : h.value), 
         time: new Date(isSensor ? h.capturedAt : h.createdAt) 
      }))
      .filter(h => !isNaN(h.value))
      .slice(0, 20)
      .reverse();

    if (numericData.length < 2) return (
        <div className="h-40 flex items-center justify-center text-gray-300 font-bold uppercase text-[10px] tracking-widest border border-dashed border-gray-100 rounded-3xl">
           Insufficient numeric data for graphing
        </div>
    );

    const min = Math.min(...numericData.map(d => d.value)) * 0.9;
    const max = Math.max(...numericData.map(d => d.value)) * 1.1;
    const range = max - min || 1;

    const width = 600;
    const height = 150;
    const padding = 20;

    const points = numericData.map((d, i) => {
      const x = (i / (numericData.length - 1)) * (width - padding * 2) + padding;
      const y = height - ((d.value - min) / range) * (height - padding * 2) - padding;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="bg-gray-50 p-6 overflow-visible relative">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Trend (Last 20 readings)</p>
        <div className="relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40 overflow-visible">
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={points}
            />
            {numericData.map((d, i) => {
               const x = (i / (numericData.length - 1)) * (width - padding * 2) + padding;
               const y = height - ((d.value - min) / range) * (height - padding * 2) - padding;
               const isHovered = hoveredPoint?.time === d.time;
               return (
                 <g 
                    key={i}
                    onMouseEnter={() => setHoveredPoint({ ...d, x, y })}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="cursor-pointer"
                 >
                    <circle cx={x} cy={y} r="10" fill="transparent" />
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isHovered ? "5" : "3"} 
                      fill={isHovered ? "#3b82f6" : "white"} 
                      stroke="#3b82f6" 
                      strokeWidth="2"
                      className="transition-all duration-200"
                    />
                 </g>
               );
            })}
          </svg>

          {hoveredPoint && (
             <div 
                className="absolute z-20 bg-white border border-gray-200 p-2 rounded shadow-sm text-[10px] pointer-events-none -translate-x-1/2 -translate-y-full mb-2"
                style={{ 
                   left: `${(hoveredPoint.x / width) * 100}%`, 
                   top: `${(hoveredPoint.y / height) * 100}%` 
                }}
             >
                <p className="font-bold text-gray-900">{hoveredPoint.value.toFixed(1)}{getDeviceUnit(device.type)}</p>
                <p className="text-gray-500 whitespace-nowrap">{hoveredPoint.time.toLocaleTimeString()}</p>
             </div>
          )}
        </div>
      </div>
    );
  };

  if (loading && !device) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center px-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Analyzing data...</p>
    </div>
  );

  if (!device || error) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center uppercase font-black">
      <h2 className="text-2xl mb-2">Device not found</h2>
      <p className="text-red-500 text-xs mb-6 lowercase font-medium">{error || "The requested device could not be located in our infrastructure."}</p>
      <button onClick={() => navigate('/monitoring')} className="text-blue-600 flex items-center gap-2 mx-auto hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Monitoring
      </button>
    </div>
  );

  const lastValue = isSensor 
    ? (history.length > 0 ? history[0].value : null)
    : device.currentState;

  return (
    <main className="max-w-7xl mx-auto px-4 py-4 md:py-8 space-y-6 md:space-y-8 text-gray-900">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b pb-6">
        <div className="space-y-4 text-center md:text-left">
          <button 
            onClick={() => navigate('/monitoring')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Monitoring
          </button>
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight uppercase leading-tight">{device.name}</h1>
            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getStatusColor(device.status)}`}>
              {device.status}
            </span>
          </div>
          <p className="text-xs md:text-sm text-gray-500 font-medium flex flex-wrap justify-center md:justify-start gap-x-3 gap-y-1">
            <span>Type: <span className="text-gray-900 font-bold uppercase">{device.type.replace('_', ' ')}</span></span> 
            <span>ID: <span className="text-gray-900 font-bold">{trueId}</span></span>
            <span>Category: <span className="text-blue-600 font-bold uppercase">{isSensor ? 'Sensor' : 'Actuator'}</span></span>
          </p>
          {device.room && (
            <p className="text-xs md:text-sm text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
              <MapPin size={14} className="text-blue-500" />
              Room: <Link to={`/monitoring/room/${device.room.id}`} className="text-blue-600 font-bold hover:underline">{device.room.name}</Link>
            </p>
          )}
        </div>
        
        <div className="flex flex-col xs:flex-row gap-4 items-center justify-center">
          <div className="text-center md:text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Last update</p>
            <p className="text-xs font-bold text-gray-600">{lastRefresh.toLocaleTimeString()}</p>
          </div>
          <div className="flex gap-2 w-full xs:w-auto">
            <button 
              onClick={fetchData} 
              disabled={refreshing}
              className="flex-1 xs:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 uppercase tracking-wider"
            >
              <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Sync
            </button>
            {canDownloadReport && (
              <a 
                href={isSensor ? `${BASE_URL}/api/reports/sensors/${trueId}` : `${BASE_URL}/api/reports/actuators/${trueId}`}
                target="_blank"
                rel="noopener noreferrer"
                download={`report-${isSensor ? 'sensor' : 'actuator'}-${device?.name || trueId}.txt`}
                className="flex-1 xs:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg shadow-sm text-xs font-bold hover:bg-black transition-colors uppercase tracking-wider"
              >
                <FileText className={`w-4 h-4 text-blue-400`} />
                Report
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-8">
          {!isSensor && canControl && (
             <div className="bg-white p-6 md:p-8 rounded-xl border-l-4 border-l-blue-600 shadow-sm border-t border-r border-b border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                         <Zap className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="text-lg font-bold text-gray-900 uppercase">Manual Override</h3>
                         <p className="text-xs text-gray-500 font-medium">Bypass automated control rules</p>
                      </div>
                   </div>
                   <div className="flex gap-2 w-full sm:w-auto">
                      <input 
                         type="text"
                         value={manualValue}
                         onChange={(e) => setManualValue(e.target.value)}
                         className="flex-1 sm:w-32 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-bold text-sm"
                         placeholder="State..."
                      />
                      <button 
                         onClick={handleManualControl}
                         disabled={refreshing}
                         className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold uppercase text-xs tracking-wider hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50"
                      >
                         Apply
                      </button>
                   </div>
                </div>
             </div>
          )}

          <div className="bg-white p-6 md:p-10 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
               <div className={`p-6 rounded-lg ${getStatusColor(device.status)}`}>
                  {getDeviceIcon(device.type)}
               </div>
               <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    {isSensor ? 'Real-time Reading' : 'Current Operating State'}
                  </p>
                  <p className="text-5xl md:text-6xl font-bold text-gray-900">
                    {formatValue(lastValue, device.type)}
                    <span className="text-2xl ml-2 text-gray-400 font-medium uppercase">
                      {getDeviceUnit(device.type)}
                    </span>
                  </p>
               </div>
            </div>

            {!isActuator && canViewHistory && (
              <div className="border border-gray-100 rounded-lg overflow-hidden">
                 {renderSimpleChart()}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8 border-t border-gray-100 text-xs uppercase font-semibold">
               <div>
                  <p className="text-[10px] text-gray-400 mb-1">Status</p>
                  <p className="text-gray-900">{device.status}</p>
               </div>
               <div>
                  <p className="text-[10px] text-gray-400 mb-1">Last Update</p>
                  <p className="text-gray-900">
                     {device.lastSeenAt || device.history?.[0]?.createdAt ? new Date(device.lastSeenAt || device.history?.[0]?.createdAt).toLocaleTimeString() : 'N/A'}
                  </p>
               </div>
               <div>
                  <p className="text-[10px] text-gray-400 mb-1">Frequency</p>
                  <p className="text-gray-900">Real-time sync</p>
               </div>
            </div>
          </div>

          {canViewHistory && (
            <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm">
              <header className="flex items-center justify-between mb-8 border-b pb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 uppercase tracking-tight">
                  <HistoryIcon className="w-5 h-5 text-blue-600" />
                  Historical Logs
                </h3>
                <BarChart3 className="w-4 h-4 text-gray-300" />
              </header>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
                      <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Label</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="py-20 text-center text-gray-400 font-semibold uppercase text-xs tracking-widest">No historical data found</td>
                      </tr>
                    ) : (
                      history.slice(0, 50).map((h, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 text-xs font-medium text-gray-600">
                            {new Date(isSensor ? h.capturedAt : h.createdAt).toLocaleString()}
                          </td>
                          <td className="px-4 py-4 font-bold text-gray-900">
                            {formatValue(h.value, device.type)} {getDeviceUnit(device.type)}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold uppercase text-gray-500 border border-gray-200">
                               {i === 0 ? 'Current' : 'Log'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-6">
           <div className="bg-gray-900 p-6 md:p-8 rounded-xl shadow-lg text-white space-y-6 lg:sticky lg:top-24">
              <h3 className="text-xl font-bold flex items-center gap-3 border-b border-gray-800 pb-4">
                <Signal className="w-5 h-5 text-blue-500" />
                System Information
              </h3>
              
              <div className="space-y-4">
                 <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Device Hardware ID</p>
                    <p className="text-xs font-mono text-gray-300">{isSensor ? `SN-` : `AC-`}{trueId.padStart(6, '0')}</p>
                 </div>
                 <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Security Protocol</p>
                    <div className="flex items-center gap-2 text-green-400">
                       <ShieldCheck className="w-3.5 h-3.5" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted</span>
                    </div>
                 </div>
                 {device.electricityConsumption !== undefined && device.electricityConsumption !== null && (
                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 space-y-2">
                       <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-500/70">Energy Usage</p>
                       <div className="flex items-center gap-2 text-yellow-500">
                          <Zap className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold uppercase tracking-wider">{device.electricityConsumption} Watts</span>
                       </div>
                    </div>
                 )}
              </div>
           </div>

        </aside>
      </div>
    </main>
  );
};

export default DeviceDetail;
