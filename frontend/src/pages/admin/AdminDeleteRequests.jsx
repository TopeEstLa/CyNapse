import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api.js';
import { Loader2, Trash2, MessageSquare, User } from 'lucide-react';

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 bg-warning/10 text-warning rounded-lg text-[10px] font-black uppercase tracking-widest border border-warning/20">Pending</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-1 bg-secondary/10 text-secondary rounded-lg text-[10px] font-black uppercase tracking-widest border border-secondary/20">Approved</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 bg-danger/10 text-danger rounded-lg text-[10px] font-black uppercase tracking-widest border border-danger/20">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Device Removal Requests</h1>
          <p className="text-sm text-gray-500">Review and approve requests to delete devices from the system.</p>
        </div>
        <div className="flex items-center gap-2 bg-surface p-1 rounded-xl border border-gray-100 shadow-sm">
           {['PENDING', 'APPROVED', 'REJECTED', ''].map((s) => (
             <button
               key={s}
               onClick={() => setStatusFilter(s)}
               className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                 statusFilter === s ? 'bg-background-dark text-white shadow-md' : 'text-gray-400 hover:text-gray-600'
               }`}
             >
               {s || 'All'}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-surface rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-background-light border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Device Info</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading requests...</p>
                  </td>
                </tr>
              ) : requests.length > 0 ? (
                requests.map((r) => (
                  <tr key={r.id} className="hover:bg-background-light transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-background-light rounded-xl text-gray-400">
                          <Trash2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 uppercase tracking-tight">
                            {r.deviceType} #{r.deviceId}
                          </div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                             <User className="w-3 h-3" /> Requester ID: {r.userId || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 max-w-xs">
                         <MessageSquare className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                         <p className="text-sm text-gray-600 leading-relaxed italic">"{r.reason}"</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                         {new Date(r.requestedAt).toLocaleDateString()}
                      </div>
                      <div className="text-[9px] text-gray-400 font-medium">
                         {new Date(r.requestedAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(r.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {r.status === 'PENDING' ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleAction(r.id, 'reject')}
                            disabled={processingId !== null}
                            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-danger hover:bg-danger/10 rounded-xl transition-all border border-danger/20"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleAction(r.id, 'approve')}
                            disabled={processingId !== null}
                            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-background-dark hover:bg-black rounded-xl transition-all shadow-md shadow-slate-200"
                          >
                            Approve
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-300 uppercase italic">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium uppercase text-[10px] tracking-[0.2em]">
                    No requests found for this status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDeleteRequests;
