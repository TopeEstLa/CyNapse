import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {api} from '../../../utils/api.js';
import {ArrowLeft, Edit2, Loader2, Plus, Save, Settings, Trash2, X, Zap} from 'lucide-react';
import {ACTUATOR_TYPES, DeviceType, SENSOR_TYPES} from '../../../utils/constants.js';

const AdminActuatorEdit = () => {
    const {id} = useParams();
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
                roomId: data.roomId || data.room?.id || (roomId ? parseInt(roomId) : '')
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
                await api.post('/api/admin/actuator/update', {...formData, id: parseInt(id)});
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
        setRuleFormData({...ruleFormData, conditions: newConditions});
    };

    const handleRuleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {...ruleFormData, actuatorDeviceId: parseInt(id)};
            if (currentRule) {
                await api.post('/api/admin/automation/update', {...payload, id: currentRule.id});
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
            alert('Rule evaluated successfully');
            fetchActuator();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading actuator details...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 py-6">
            <header className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 border rounded hover:bg-gray-50">
                    <ArrowLeft size={20}/>
                </button>
                <h1 className="text-2xl font-bold">
                    {id === 'new' ? 'New Actuator' : `Control: ${formData.name}`}
                </h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Basic Configuration */}
                <section className="bg-white p-6 border rounded shadow-sm h-fit space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
                        <Settings size={20} className="text-gray-600"/>
                        General Setup
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Device Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    className="w-full p-2 border rounded bg-white"
                                >
                                    {ACTUATOR_TYPES.map(type => (
                                        <option key={type} value={type}>{type.replace('_', ' ')}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    className="w-full p-2 border rounded bg-white"
                                >
                                    <option value="ONLINE">Online</option>
                                    <option value="OFFLINE">Offline</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Current State</label>
                            <input
                                type="text"
                                value={formData.currentState}
                                onChange={(e) => setFormData({...formData, currentState: e.target.value})}
                                className="w-full p-2 border rounded"
                                placeholder="ON/OFF or value"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Assign to Room</label>
                            <select
                                required
                                value={formData.roomId}
                                onChange={(e) => setFormData({...formData, roomId: parseInt(e.target.value)})}
                                className="w-full p-2 border rounded bg-white"
                            >
                                <option value="">Select a room...</option>
                                {rooms.map(room => (
                                    <option key={room.id}
                                            value={room.id}>{room.name} (Floor {room.floorNumber})</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>}
                            Save Changes
                        </button>
                    </form>
                </section>

                {/* Automation Rules */}
                <section className="md:col-span-2 bg-white p-6 border rounded shadow-sm space-y-6">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Zap size={20} className="text-yellow-600"/> Automation Rules
                        </h2>
                        {id !== 'new' && (
                            <button
                                onClick={() => handleOpenRuleModal()}
                                className="text-sm bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1 rounded hover:bg-yellow-100 flex items-center gap-1"
                            >
                                <Plus size={14}/> New Rule
                            </button>
                        )}
                    </div>

                    {id === 'new' ? (
                        <div className="p-12 text-center text-gray-400 italic border-2 border-dashed rounded">
                            Save the actuator to enable automation rules.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {rules.length === 0 ? (
                                <div className="p-12 text-center text-gray-400 border rounded">No rules defined.</div>
                            ) : (
                                rules.map((rule) => (
                                    <div key={rule.id}
                                         className="p-4 border rounded hover:border-blue-300 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="font-bold">Target State: <span
                                                    className="text-blue-600">{rule.targetState}</span></p>
                                                <p className="text-xs text-gray-500">Every {rule.intervalSeconds}s
                                                    • {rule.logicalOperator} Logic
                                                    • {rule.enabled ? 'Enabled' : 'Disabled'}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <button onClick={() => handleEvaluateNow(rule.id)}
                                                        className="text-[10px] bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 uppercase">Run
                                                </button>
                                                <button onClick={() => handleOpenRuleModal(rule)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2
                                                    size={14}/></button>
                                                <button onClick={() => handleDeleteRule(rule.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2
                                                    size={14}/></button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {rule.conditions.map((cond, idx) => (
                                                <div key={idx} className="text-[11px] bg-gray-50 p-2 border rounded">
                                                    {cond.type === 'SENSOR_VALUE' ? (
                                                        <span>{cond.sensorType.replace('_', ' ')} {cond.comparisonOperator} {cond.thresholdValue}</span>
                                                    ) : (
                                                        <span>Hours {cond.startHourInclusive}-{cond.endHourInclusive}</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </section>
            </div>

            {isRuleModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/10 p-4">
                    <div className="bg-white rounded shadow-lg w-full max-w-xl">
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <h2 className="text-lg font-bold">{currentRule ? 'Edit Rule' : 'Add Rule'}</h2>
                            <button onClick={() => setIsRuleModalOpen(false)}><X size={20}/></button>
                        </div>
                        <form onSubmit={handleRuleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Target State</label>
                                    <input
                                        type="text"
                                        required
                                        value={ruleFormData.targetState}
                                        onChange={(e) => setRuleFormData({
                                            ...ruleFormData,
                                            targetState: e.target.value
                                        })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Interval (sec)</label>
                                    <input
                                        type="number"
                                        required
                                        value={ruleFormData.intervalSeconds}
                                        onChange={(e) => setRuleFormData({
                                            ...ruleFormData,
                                            intervalSeconds: parseInt(e.target.value)
                                        })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Logic Operator</label>
                                    <select
                                        value={ruleFormData.logicalOperator}
                                        onChange={(e) => setRuleFormData({
                                            ...ruleFormData,
                                            logicalOperator: e.target.value
                                        })}
                                        className="w-full p-2 border rounded bg-white"
                                    >
                                        <option value="AND">AND (All conditions)</option>
                                        <option value="OR">OR (Any condition)</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 pt-6">
                                    <input type="checkbox" id="re" checked={ruleFormData.enabled}
                                           onChange={(e) => setRuleFormData({
                                               ...ruleFormData,
                                               enabled: e.target.checked
                                           })}/>
                                    <label htmlFor="re" className="text-sm font-medium">Enabled</label>
                                </div>
                            </div>

                            <div className="space-y-4 border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-sm uppercase text-gray-500">Conditions</h3>
                                    <button type="button" onClick={handleAddCondition}
                                            className="text-blue-600 text-xs font-bold">+ Add Condition
                                    </button>
                                </div>
                                {ruleFormData.conditions.map((cond, index) => (
                                    <div key={index} className="p-4 bg-gray-50 border rounded relative">
                                        <button type="button" onClick={() => handleRemoveCondition(index)}
                                                className="absolute top-2 right-2 text-red-500"><Trash2 size={16}/>
                                        </button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label
                                                    className="block text-[10px] uppercase font-bold text-gray-400">Type</label>
                                                <select
                                                    value={cond.type}
                                                    onChange={(e) => {
                                                        const nc = [...ruleFormData.conditions];
                                                        nc[index].type = e.target.value;
                                                        setRuleFormData({...ruleFormData, conditions: nc});
                                                    }}
                                                    className="w-full p-1 border rounded text-xs bg-white"
                                                >
                                                    <option value="SENSOR_VALUE">Sensor</option>
                                                    <option value="HOUR_RANGE">Time</option>
                                                </select>
                                            </div>
                                            {cond.type === 'SENSOR_VALUE' ? (
                                                <>
                                                    <div>
                                                        <label
                                                            className="block text-[10px] uppercase font-bold text-gray-400">Sensor</label>
                                                        <select
                                                            value={cond.sensorType}
                                                            onChange={(e) => {
                                                                const nc = [...ruleFormData.conditions];
                                                                nc[index].sensorType = e.target.value;
                                                                setRuleFormData({...ruleFormData, conditions: nc});
                                                            }}
                                                            className="w-full p-1 border rounded text-xs bg-white"
                                                        >
                                                            {SENSOR_TYPES.map(t => <option key={t}
                                                                                           value={t}>{t.replace('_', ' ')}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label
                                                            className="block text-[10px] uppercase font-bold text-gray-400">Operator</label>
                                                        <select
                                                            value={cond.comparisonOperator}
                                                            onChange={(e) => {
                                                                const nc = [...ruleFormData.conditions];
                                                                nc[index].comparisonOperator = e.target.value;
                                                                setRuleFormData({...ruleFormData, conditions: nc});
                                                            }}
                                                            className="w-full p-1 border rounded text-xs bg-white"
                                                        >
                                                            <option value="GT">Greater than (&gt;)</option>
                                                            <option value="GTE">Greater or equal (&gt;=)</option>
                                                            <option value="LT">Less than (&lt;)</option>
                                                            <option value="LTE">Less or equal (&lt;=)</option>
                                                            <option value="EQ">Equal (=)</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label
                                                            className="block text-[10px] uppercase font-bold text-gray-400">Threshold
                                                            Value</label>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            value={cond.thresholdValue}
                                                            onChange={(e) => {
                                                                const nc = [...ruleFormData.conditions];
                                                                nc[index].thresholdValue = parseFloat(e.target.value);
                                                                setRuleFormData({...ruleFormData, conditions: nc});
                                                            }}
                                                            className="w-full p-1 border rounded text-xs"
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <div>
                                                    <label
                                                        className="block text-[10px] uppercase font-bold text-gray-400">Hours
                                                        (0-23)</label>
                                                    <div className="flex gap-2">
                                                        <input type="number" value={cond.startHourInclusive}
                                                               onChange={(e) => {
                                                                   const nc = [...ruleFormData.conditions];
                                                                   nc[index].startHourInclusive = parseInt(e.target.value);
                                                                   setRuleFormData({...ruleFormData, conditions: nc});
                                                               }} className="w-1/2 p-1 border rounded text-xs"/>
                                                        <input type="number" value={cond.endHourInclusive}
                                                               onChange={(e) => {
                                                                   const nc = [...ruleFormData.conditions];
                                                                   nc[index].endHourInclusive = parseInt(e.target.value);
                                                                   setRuleFormData({...ruleFormData, conditions: nc});
                                                               }} className="w-1/2 p-1 border rounded text-xs"/>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsRuleModalOpen(false)}
                                        className="flex-1 px-4 py-2 border rounded hover:bg-gray-50">Cancel
                                </button>
                                <button type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">Save
                                    Rule
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
