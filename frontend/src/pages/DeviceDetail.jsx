import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { deviceApi } from '../utils/api';
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
  FileText
} from 'lucide-react';
import { DeviceType } from '../utils/constants';

const DeviceDetail = () => {
  const { roomId, deviceId } = useParams();
  const navigate = useNavigate();
  
  const isSensor = deviceId.startsWith('sensor-');
  const trueId = deviceId.split('-')[1];

  const [device, setDevice] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [manualValue, setManualValue] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [roomId, deviceId]);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      
      let deviceData;

      if (isSensor) {
        deviceData = await deviceApi.sensorDetails(trueId);
        setDevice(deviceData);
        setHistory(deviceData.readings || []);
      } else {
        deviceData = await deviceApi.actuatorDetails(trueId);
        setDevice(deviceData);
        setHistory(deviceData.history || []);
        setManualValue(deviceData.currentState || '');
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
      const endpoint = isSensor ? `/api/reports/sensors/${trueId}` : `/api/reports/actuators/${trueId}`;
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
      // Update endpoint for actuator
      await fetch('/api/admin/actuator/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...device,
            currentState: manualValue
        })
      });
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
      .slice(-20)
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
      <div className="bg-background-light rounded-[2rem] p-6 overflow-visible relative">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Trend (Last 20 readings)</p>
        <div className="relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40 overflow-visible">
            <polyline
              fill="none"
              stroke="var(--color-primary-light, #3b82f6)"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={points}
              className="drop-shadow-lg"
            />
            {numericData.map((d, i) => {
               const x = (i / (numericData.length - 1)) * (width - padding * 2) + padding;
               const y = height - ((d.value - min) / range) * (height - padding * 2) - padding;
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
                      r="4" 
                      fill={hoveredPoint?.time === d.time ? 'var(--color-primary-light, #3b82f6)' : 'white'} 
                      stroke="var(--color-primary-light, #3b82f6)" 
                      strokeWidth="2" 
                    />
                 </g>
               );
            })}
          </svg>

          {hoveredPoint && (
             <div 
                className="absolute z-20 bg-background-dark text-white p-3 rounded-xl text-[10px] font-bold shadow-2xl pointer-events-none -translate-x-1/2 -translate-y-full mb-4"
                style={{ 
                   left: `${(hoveredPoint.x / width) * 100}%`, 
                   top: `${(hoveredPoint.y / height) * 100}%` 
                }}
             >
                <p className="text-primary-light uppercase mb-1">{hoveredPoint.value.toFixed(1)}{getDeviceUnit(device.type)}</p>
                <p className="opacity-50 whitespace-nowrap">{hoveredPoint.time.toLocaleString()}</p>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-background-dark"></div>
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

  if (!device) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs uppercase font-black">
      <h2 className="text-2xl mb-4">Device not found</h2>
      <button onClick={() => navigate(`/monitoring/room/${roomId}`)} className="text-primary">
        <ArrowLeft className="w-4 h-4 inline mr-2" /> Back
      </button>
    </div>
  );

  const lastValue = isSensor 
    ? (history.length > 0 ? history[history.length - 1].value : null)
    : device.currentState;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 text-center md:text-left">
          <button 
            onClick={() => navigate(`/monitoring/room/${roomId}`)}
            className="inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest mx-auto md:mx-0"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to room
          </button>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase leading-tight">{device.name}</h1>
            <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${getStatusColor(device.status)}`}>
              {device.status}
            </span>
          </div>
          <p className="text-gray-500 font-medium italic">
            Type: <span className="text-gray-900 font-bold uppercase">{device.type.replace('_', ' ')}</span> | 
            ID: <span className="text-gray-900 font-bold">{trueId}</span> |
            Category: <span className="text-primary font-bold uppercase">{isSensor ? 'Sensor' : 'Actuator'}</span>
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={fetchData} 
            disabled={refreshing}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-surface border border-gray-100 rounded-2xl shadow-sm text-xs font-black text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 uppercase tracking-widest"
          >
            <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Sync
          </button>
          <button 
            onClick={handleDownloadReport} 
            disabled={downloading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-background-dark text-white border border-slate-800 rounded-2xl shadow-sm text-xs font-black hover:bg-black transition-colors disabled:opacity-50 uppercase tracking-widest"
          >
            {downloading ? <Loader2 className={`w-4 h-4 animate-spin`} /> : <FileText className={`w-4 h-4 text-primary`} />}
            Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {!isSensor && (
             <div className="bg-surface p-6 md:p-8 rounded-3xl border border-primary/10 shadow-sm border-l-8 border-l-primary">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                         <Zap className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="text-lg font-black text-gray-900 uppercase">Manual Override</h3>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bypass automation rules</p>
                      </div>
                   </div>
                   <div className="flex gap-2 w-full sm:w-auto">
                      <input 
                         type="text"
                         value={manualValue}
                         onChange={(e) => setManualValue(e.target.value)}
                         className="flex-1 sm:w-32 px-4 py-3 bg-background border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm"
                         placeholder="New state..."
                      />
                      <button 
                         onClick={handleManualControl}
                         disabled={refreshing}
                         className="px-6 py-3 bg-primary text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                      >
                         Apply
                      </button>
                   </div>
                </div>
             </div>
          )}

          <div className="bg-surface p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              {getDeviceIcon(device.type)}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 text-center sm:text-left">
               <div className={`p-5 rounded-[2rem] ${getStatusColor(device.status)} bg-opacity-10`}>
                  <div className={getStatusColor(device.status).split(' ')[0]}>
                    {getDeviceIcon(device.type)}
                  </div>
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {isSensor ? 'Real-time Value' : 'Current State'}
                  </p>
                  <p className="text-5xl md:text-6xl font-black text-gray-900">
                    {formatValue(lastValue, device.type)}
                    <span className="text-xl ml-2 text-gray-400 font-bold uppercase">
                      {getDeviceUnit(device.type)}
                    </span>
                  </p>
               </div>
            </div>

            {renderSimpleChart()}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8 border-t border-gray-50 text-center md:text-left text-xs uppercase tracking-tighter">
               <div>
                  <p className="text-[9px] font-black text-gray-400 mb-1">Status</p>
                  <p className="font-bold text-gray-900">{device.status}</p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-gray-400 mb-1">Activity</p>
                  <p className="font-bold text-gray-900">
                     {device.lastSeenAt || device.history?.[0]?.createdAt ? new Date(device.lastSeenAt || device.history?.[0]?.createdAt).toLocaleTimeString() : 'N/A'}
                  </p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-gray-400 mb-1">Update frequency</p>
                  <p className="font-bold text-gray-900">Real-time</p>
               </div>
            </div>
          </div>

          <div className="bg-surface p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 uppercase tracking-tight">
                <HistoryIcon className="w-5 h-5 text-primary" />
                Data Logs
              </h3>
              <BarChart3 className="w-4 h-4 text-gray-200" />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-4 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                    <th className="px-4 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Value</th>
                    <th className="px-4 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Label</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-20 text-center text-gray-300 font-bold uppercase text-[10px] tracking-widest">No logs available</td>
                    </tr>
                  ) : (
                    history.slice(0, 50).map((h, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 text-[10px] font-bold text-gray-500 uppercase">
                          {new Date(isSensor ? h.capturedAt : h.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 font-black text-gray-900">
                          {formatValue(h.value, device.type)} {getDeviceUnit(device.type)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="px-2 py-0.5 bg-background rounded text-[8px] font-black uppercase text-gray-400">
                             {i === 0 ? 'Latest' : 'Historical'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
           <div className="bg-background-dark p-6 md:p-8 rounded-3xl shadow-2xl text-white space-y-6">
              <h3 className="text-xl font-black flex items-center gap-3 uppercase tracking-tight">
                <Signal className="w-5 h-5 text-primary" />
                System Info
              </h3>
              
              <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Network ID</p>
                    <p className="text-xs font-bold text-white/90 font-mono">{isSensor ? `SN-` : `AC-`}{trueId.padStart(6, '0')}</p>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Security</p>
                    <div className="flex items-center gap-2 text-secondary">
                       <ShieldCheck className="w-3.5 h-3.5" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Encrypted</span>
                    </div>
                 </div>
                 {device.electricityConsumption !== undefined && device.electricityConsumption !== null && (
                    <div className="p-4 rounded-2xl bg-warning/10 border border-warning/20 space-y-2">
                       <p className="text-[9px] font-black uppercase tracking-widest text-warning opacity-60">Power Usage</p>
                       <div className="flex items-center gap-2 text-warning">
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs font-black uppercase tracking-widest">{device.electricityConsumption} Watts</span>
                       </div>
                    </div>
                 )}
              </div>
           </div>

           <div className="bg-primary p-6 md:p-8 rounded-3xl text-white space-y-4 shadow-xl shadow-primary/20">
              <Activity className="w-8 h-8 opacity-40" />
              <h4 className="text-lg font-black leading-tight uppercase tracking-tight">Analytics</h4>
              <p className="text-xs font-bold opacity-80 leading-relaxed italic">Data being synchronized with global building management system.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetail;
