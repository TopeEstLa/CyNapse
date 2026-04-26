import React, {useEffect, useState} from 'react';
import {api} from '../../utils/api.js';
import {Loader2, Trash2, User} from 'lucide-react';

const AdminDeleteRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('PENDING');
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, [statusFilter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await api.get(`/api/admin/device-delete-request/list${statusFilter ? `?status=${statusFilter}` : ''}`);
            setRequests(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        setProcessingId(id);
        try {
            await api.post(`/api/admin/device-delete-request/${action}?id=${id}`);
            setRequests(requests.filter(r => r.id !== id));
        } catch (err) {
            alert(`Failed to ${action} request: ` + err.message);
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'APPROVED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'REJECTED':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Removal Requests</h1>
                    <p className="text-gray-500">Review and moderate device deletion requests.</p>
                </div>
                <nav className="flex bg-gray-100 p-1 rounded border">
                    {['PENDING', 'APPROVED', 'REJECTED', ''].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded text-xs font-bold transition-colors ${
                                statusFilter === s ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {s || 'All'}
                        </button>
                    ))}
                </nav>
            </header>

            <div className="bg-white border rounded overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase">
                    <tr>
                        <th className="px-6 py-3">Device</th>
                        <th className="px-6 py-3">Reason</th>
                        <th className="px-6 py-3">Requested By</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2"/>
                                <span>Loading requests...</span>
                            </td>
                        </tr>
                    ) : requests.length > 0 ? (
                        requests.map((r) => (
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Trash2 size={16} className="text-gray-400"/>
                                        <div>
                                            <div className="font-bold">{r.deviceType}</div>
                                            <div className="text-[10px] text-gray-400">ID: {r.deviceId}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm italic text-gray-600 max-w-xs truncate"
                                       title={r.reason}>"{r.reason}"</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <User size={14}/>
                                        User #{r.userId}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(r.requestedAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                    <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(r.status)}`}>
                      {r.status}
                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {r.status === 'PENDING' ? (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleAction(r.id, 'reject')}
                                                disabled={processingId !== null}
                                                className="px-3 py-1 border border-red-200 text-red-600 rounded text-xs hover:bg-red-50"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleAction(r.id, 'approve')}
                                                disabled={processingId !== null}
                                                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">Completed</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500 italic">No removal requests
                                found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDeleteRequests;
