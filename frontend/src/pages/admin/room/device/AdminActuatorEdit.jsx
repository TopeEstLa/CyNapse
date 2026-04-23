import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../../../utils/api.js';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Cpu,
  Plus,
  Trash2,
  X,
  Settings,
  Zap,
  Clock,
  Activity,
  Shield,
  Thermometer,
  Wind,
  Users,
  Lightbulb,
  Droplets,
  Edit2,
  Flame
} from 'lucide-react';
import { DeviceType } from '../../../../utils/constants.js';

const AdminActuatorEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get('roomId');

  const [loading, setLoading] = useState(id !== 'new');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: DeviceType.SMART_LIGHT,
    status: 'ONLINE',
    currentState: 'OFF',
    roomId: roomId ? parseInt(roomId) : ''
  });
  const [rooms, setRooms] = useState([]);
  const [rules, setRules] = useState([]);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState(null);
  const [ruleFormData, setRuleFormData] = useState({
    targetState: 'ON',
    logicalOperator: 'AND',
    intervalSeconds: 60,
    enabled: true,
    conditions: []
  });

  useEffect(() => {
    fetchRooms();
    if (id !== 'new') {
      fetchActuator();
      fetchRules();
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

  const fetchActuator = async () => {
    try {
      const data = await api.get(`/api/admin/actuator/get?id=${id}`);
      setFormData({
        name: data.name,
        type: data.type,
        status: data.status,
        currentState: data.currentState,
        roomId: data.roomId
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRules = async () => {
    try {
      const data = await api.get(`/api/admin/automation/list?actuatorDeviceId=${id}`);
      setRules(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (id === 'new') {
        await api.post('/api/admin/actuator/create', formData);
      } else {
        await api.post('/api/admin/actuator/update', { ...formData, id: parseInt(id) });
      }
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert('Error saving actuator');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenRuleModal = (rule = null) => {
    if (rule) {
      setCurrentRule(rule);
      setRuleFormData({
        targetState: rule.targetState,
        logicalOperator: rule.logicalOperator,
        intervalSeconds: rule.intervalSeconds,
        enabled: rule.enabled,
        conditions: rule.conditions.map(c => ({
          type: c.type,
          sensorType: c.sensorType,
          comparisonOperator: c.comparisonOperator,
          thresholdValue: c.thresholdValue,
          startHourInclusive: c.startHourInclusive,
          endHourInclusive: c.endHourInclusive
        }))
      });
    } else {
      setCurrentRule(null);
      setRuleFormData({
        targetState: 'ON',
        logicalOperator: 'AND',
        intervalSeconds: 60,
        enabled: true,
        conditions: []
      });
    }
    setIsRuleModalOpen(true);
  };

  const handleAddCondition = () => {
    setRuleFormData({
      ...ruleFormData,
      conditions: [...ruleFormData.conditions, {
        type: 'SENSOR_VALUE',
        sensorType: DeviceType.THERMOMETER,
        comparisonOperator: 'GT',
        thresholdValue: 25,
        startHourInclusive: 0,
        endHourInclusive: 23
      }]
    });
  };

  const handleRemoveCondition = (index) => {
    const newConditions = [...ruleFormData.conditions];
    newConditions.splice(index, 1);
    setRuleFormData({ ...ruleFormData, conditions: newConditions });
  };

  const handleRuleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...ruleFormData,
        actuatorDeviceId: parseInt(id)
      };
      if (currentRule) {
        await api.post('/api/admin/automation/update', { ...payload, id: currentRule.id });
      } else {
        await api.post('/api/admin/automation/create', payload);
      }
      fetchRules();
      setIsRuleModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error saving rule');
    }
  };

  const handleDeleteRule = async (ruleId) => {
    if (window.confirm('Delete this rule?')) {
      try {
        await api.delete(`/api/admin/automation/delete?id=${ruleId}`);
        fetchRules();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEvaluateNow = async (ruleId) => {
    try {
      await api.post(`/api/admin/automation/evaluate-now?id=${ruleId}`);
      alert('Rule evaluated and applied if conditions met');
      fetchActuator();
    } catch (err) {
      console.error(err);
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case DeviceType.THERMOMETER: return <Thermometer className="w-5 h-5" />;
      case DeviceType.HEATER: return <Flame className="w-5 h-5" />;
      case DeviceType.HUMIDITY_SENSOR: return <Droplets className="w-5 h-5" />;
      case DeviceType.CO2_SENSOR: return <Wind className="w-5 h-5" />;
      case DeviceType.PEOPLE_COUNTER: return <Users className="w-5 h-5" />;
      case DeviceType.SMART_LIGHT: return <Lightbulb className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mt-20" />;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4 text-gray-900">
      <div className="flex flex-col gap-2">
        <button onClick={() => navigate(-1)} className="text-[10px] font-black text-gray-400 hover:text-primary flex items-center gap-1 uppercase tracking-widest transition-colors w-fit">
          <ArrowLeft className="w-3 h-3" /> Back
        </button>
        <h1 className="text-3xl font-black tracking-tight leading-tight uppercase">
          {id === 'new' ? 'New Actuator' : `Actuator Control: ${formData.name}`}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
           {/* Basic Config */}
           <div className="bg-surface p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <Settings className="w-5 h-5" />
                 </div>
                 <h2 className="text-lg font-black uppercase tracking-tight">Actuator Setup</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Device Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-background-light border border-transparent rounded-2xl focus:bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 bg-background-light border border-transparent rounded-2xl focus:bg-surface outline-none font-bold text-sm"
                    >
                      <option value={DeviceType.SMART_LIGHT}>Smart Light</option>
                      <option value={DeviceType.THERMOMETER}>Hvac/Air Cond.</option>
                      <option value={DeviceType.HEATER}>Heater</option>
                      <option value={DeviceType.CO2_SENSOR}>Ventilation</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 bg-background-light border border-transparent rounded-2xl focus:bg-surface outline-none font-bold text-sm"
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
                    className="w-full px-4 py-3 bg-background-light border border-transparent rounded-2xl focus:bg-surface outline-none font-bold text-sm"
                  >
                    <option value="">Select a room</option>
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>{room.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Initial/Current State</label>
                  <input
                    type="text"
                    value={formData.currentState}
                    onChange={(e) => setFormData({ ...formData, currentState: e.target.value })}
                    className="w-full px-4 py-3 bg-background-light border border-transparent rounded-2xl focus:bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold"
                    placeholder="ON/OFF or value"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-background-dark text-white rounded-2xl hover:bg-black transition-all font-black uppercase text-xs tracking-widest shadow-lg shadow-gray-200 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </form>
           </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
           <div className="bg-surface p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[500px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-warning/10 rounded-xl text-warning">
                       <Zap className="w-5 h-5" />
                    </div>
                    <div>
                       <h2 className="text-lg font-black uppercase tracking-tight">Automation Rules</h2>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Define behavior logic</p>
                    </div>
                 </div>
                 {id !== 'new' && (
                    <button
                      onClick={() => handleOpenRuleModal()}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-warning text-white rounded-xl hover:bg-warning/90 transition-all font-bold text-[10px] uppercase tracking-widest shadow-md shadow-warning/20"
                    >
                      <Plus className="w-4 h-4" />
                      New Rule
                    </button>
                 )}
              </div>

              {id === 'new' ? (
                <div className="py-20 text-center space-y-4 bg-background-light rounded-[2rem] border-2 border-dashed border-gray-100">
                  <Shield className="w-12 h-12 text-gray-200 mx-auto" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Create the actuator first to add rules</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rules.length === 0 ? (
                    <div className="py-20 text-center space-y-4">
                      <Clock className="w-12 h-12 text-gray-100 mx-auto" />
                      <p className="text-gray-300 font-bold uppercase tracking-widest text-[10px]">No rules defined for this device</p>
                    </div>
                  ) : (
                    rules.map((rule) => (
                      <div key={rule.id} className="p-6 bg-background-light rounded-3xl border border-transparent hover:border-warning/20 hover:bg-surface transition-all group">
                         <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                               <div className={`p-3 rounded-2xl ${rule.enabled ? 'bg-warning/10 text-warning' : 'bg-gray-200 text-gray-400'}`}>
                                  <Activity className="w-5 h-5" />
                               </div>
                               <div>
                                  <p className="text-sm font-black text-gray-900 uppercase">Set state to: <span className="text-warning">{rule.targetState}</span></p>
                                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                     Evaluation every {rule.intervalSeconds}s • {rule.logicalOperator} logic
                                  </p>
                               </div>
                            </div>
                            <div className="flex gap-2">
                               <button 
                                  onClick={() => handleEvaluateNow(rule.id)}
                                  className="px-3 py-1.5 bg-surface text-gray-600 border border-gray-100 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors"
                               >
                                  Run Now
                               </button>
                               <button 
                                  onClick={() => handleOpenRuleModal(rule)}
                                  className="p-2 text-gray-400 hover:text-warning hover:bg-warning/10 rounded-lg transition-all"
                               >
                                  <Edit2 className="w-4 h-4" />
                               </button>
                               <button 
                                  onClick={() => handleDeleteRule(rule.id)}
                                  className="p-2 text-gray-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                               >
                                  <Trash2 className="w-4 h-4" />
                               </button>
                            </div>
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {rule.conditions.map((cond, idx) => (
                               <div key={cond.id || idx} className="px-4 py-3 bg-surface rounded-2xl border border-gray-100 flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-xl bg-background-light flex items-center justify-center text-gray-400">
                                     {cond.type === 'SENSOR_VALUE' ? getDeviceIcon(cond.sensorType) : <Clock className="w-4 h-4" />}
                                  </div>
                                  <div className="text-[10px] font-bold">
                                     {cond.type === 'SENSOR_VALUE' ? (
                                        <p className="text-gray-900 uppercase leading-tight">
                                           {cond.sensorType.replace('_', ' ')} {cond.comparisonOperator} {cond.thresholdValue}
                                        </p>
                                     ) : (
                                        <p className="text-gray-900 uppercase leading-tight">
                                           Between {cond.startHourInclusive}h and {cond.endHourInclusive}h
                                        </p>
                                     )}
                                  </div>
                               </div>
                            ))}
                         </div>
                         
                         <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-[9px] font-black text-gray-300 uppercase">ID: {rule.id}</span>
                            {rule.lastEvaluationAt && (
                               <span className="text-[9px] font-bold text-gray-400 italic">Last check: {new Date(rule.lastEvaluationAt).toLocaleString()}</span>
                            )}
                         </div>
                      </div>
                    ))
                  )}
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Rule Modal */}
      {isRuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-surface rounded-[3rem] w-full max-w-2xl shadow-2xl my-auto">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{currentRule ? 'Edit Automation' : 'New Automation Rule'}</h2>
              <button onClick={() => setIsRuleModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleRuleSubmit} className="p-8 space-y-8">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Target State</label>
                    <input
                      type="text"
                      required
                      value={ruleFormData.targetState}
                      onChange={(e) => setRuleFormData({ ...ruleFormData, targetState: e.target.value })}
                      className="w-full px-5 py-3 bg-background-light border border-transparent rounded-2xl focus:bg-surface outline-none font-bold"
                      placeholder="ON / OFF / 22 ..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Interval (seconds)</label>
                    <input
                      type="number"
                      required
                      value={ruleFormData.intervalSeconds}
                      onChange={(e) => setRuleFormData({ ...ruleFormData, intervalSeconds: parseInt(e.target.value) })}
                      className="w-full px-5 py-3 bg-background-light border border-transparent rounded-2xl focus:bg-surface outline-none font-bold"
                    />
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Logic Operator</label>
                    <select
                      value={ruleFormData.logicalOperator}
                      onChange={(e) => setRuleFormData({ ...ruleFormData, logicalOperator: e.target.value })}
                      className="w-full px-5 py-3 bg-background-light border border-transparent rounded-2xl focus:bg-surface outline-none font-bold text-sm"
                    >
                      <option value="AND">AND (All conditions)</option>
                      <option value="OR">OR (Any condition)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                     <input 
                        type="checkbox"
                        id="rule-enabled"
                        checked={ruleFormData.enabled}
                        onChange={(e) => setRuleFormData({ ...ruleFormData, enabled: e.target.checked })}
                        className="w-5 h-5 rounded-lg border-gray-200 text-warning focus:ring-warning"
                     />
                     <label htmlFor="rule-enabled" className="text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer">Rule Enabled</label>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Conditions</h3>
                     <button 
                        type="button" 
                        onClick={handleAddCondition}
                        className="flex items-center gap-1 text-[10px] font-black text-warning hover:text-warning/80 uppercase tracking-widest"
                     >
                        <Plus className="w-3 h-3" /> Add Condition
                     </button>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                     {ruleFormData.conditions.map((cond, index) => (
                        <div key={index} className="p-5 bg-background-light rounded-[2rem] border border-gray-100 relative group/cond">
                           <button 
                              type="button"
                              onClick={() => handleRemoveCondition(index)}
                              className="absolute top-4 right-4 p-1.5 text-gray-300 hover:text-danger transition-colors"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>

                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                 <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Type</label>
                                 <select
                                    value={cond.type}
                                    onChange={(e) => {
                                       const newConds = [...ruleFormData.conditions];
                                       newConds[index].type = e.target.value;
                                       setRuleFormData({ ...ruleFormData, conditions: newConds });
                                    }}
                                    className="w-full px-4 py-2 bg-surface border border-gray-200 rounded-xl outline-none font-bold text-[11px]"
                                 >
                                    <option value="SENSOR_VALUE">Sensor Value</option>
                                    <option value="HOUR_RANGE">Hour Range</option>
                                 </select>
                              </div>

                              {cond.type === 'SENSOR_VALUE' ? (
                                 <>
                                    <div className="space-y-1.5">
                                       <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Sensor Type</label>
                                       <select
                                          value={cond.sensorType}
                                          onChange={(e) => {
                                             const newConds = [...ruleFormData.conditions];
                                             newConds[index].sensorType = e.target.value;
                                             setRuleFormData({ ...ruleFormData, conditions: newConds });
                                          }}
                                          className="w-full px-4 py-2 bg-surface border border-gray-200 rounded-xl outline-none font-bold text-[11px]"
                                       >
                                          {Object.values(DeviceType).map(type => (
                                            <option key={type} value={type}>{type.replace('_', ' ')}</option>
                                          ))}
                                       </select>
                                    </div>
                                    <div className="space-y-1.5">
                                       <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Operator</label>
                                       <select
                                          value={cond.comparisonOperator}
                                          onChange={(e) => {
                                             const newConds = [...ruleFormData.conditions];
                                             newConds[index].comparisonOperator = e.target.value;
                                             setRuleFormData({ ...ruleFormData, conditions: newConds });
                                          }}
                                          className="w-full px-4 py-2 bg-surface border border-gray-200 rounded-xl outline-none font-bold text-[11px]"
                                       >
                                          <option value="LT">Less than</option>
                                          <option value="LTE">Less or equal</option>
                                          <option value="GT">Greater than</option>
                                          <option value="GTE">Greater or equal</option>
                                          <option value="EQ">Equal</option>
                                          <option value="NEQ">Not equal</option>
                                       </select>
                                    </div>
                                    <div className="space-y-1.5">
                                       <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Value</label>
                                       <input
                                          type="number"
                                          step="0.1"
                                          value={cond.thresholdValue}
                                          onChange={(e) => {
                                             const newConds = [...ruleFormData.conditions];
                                             newConds[index].thresholdValue = parseFloat(e.target.value);
                                             setRuleFormData({ ...ruleFormData, conditions: newConds });
                                          }}
                                          className="w-full px-4 py-2 bg-surface border border-gray-200 rounded-xl outline-none font-bold text-[11px]"
                                       />
                                    </div>
                                 </>
                              ) : (
                                 <>
                                    <div className="space-y-1.5">
                                       <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Start Hour (0-23)</label>
                                       <input
                                          type="number"
                                          min="0"
                                          max="23"
                                          value={cond.startHourInclusive}
                                          onChange={(e) => {
                                             const newConds = [...ruleFormData.conditions];
                                             newConds[index].startHourInclusive = parseInt(e.target.value);
                                             setRuleFormData({ ...ruleFormData, conditions: newConds });
                                          }}
                                          className="w-full px-4 py-2 bg-surface border border-gray-200 rounded-xl outline-none font-bold text-[11px]"
                                       />
                                    </div>
                                    <div className="space-y-1.5">
                                       <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">End Hour (0-23)</label>
                                       <input
                                          type="number"
                                          min="0"
                                          max="23"
                                          value={cond.endHourInclusive}
                                          onChange={(e) => {
                                             const newConds = [...ruleFormData.conditions];
                                             newConds[index].endHourInclusive = parseInt(e.target.value);
                                             setRuleFormData({ ...ruleFormData, conditions: newConds });
                                          }}
                                          className="w-full px-4 py-2 bg-surface border border-gray-200 rounded-xl outline-none font-bold text-[11px]"
                                       />
                                    </div>
                                 </>
                              )}
                           </div>
                        </div>
                     ))}
                     
                     {ruleFormData.conditions.length === 0 && (
                        <p className="text-center py-6 text-gray-300 text-[10px] font-black uppercase tracking-widest italic border border-dashed border-gray-100 rounded-2xl">No conditions added</p>
                     )}
                  </div>
               </div>

               <div className="pt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsRuleModalOpen(false)}
                    className="flex-1 px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl hover:bg-gray-200 transition-colors font-black uppercase text-xs tracking-widest"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-warning text-white rounded-2xl hover:bg-warning/90 transition-all font-black uppercase text-xs tracking-widest shadow-lg shadow-warning/20"
                  >
                    Save Rule
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminActuatorEdit;
