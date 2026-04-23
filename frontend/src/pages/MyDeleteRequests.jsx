import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Loader2, Trash2, Clock, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyDeleteRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await api.get('/api/device-delete-request/my-list');
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-warning/10 text-warning rounded-full text-[10px] font-black uppercase tracking-widest border border-warning/20">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case 'APPROVED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-widest border border-secondary/20">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-danger/10 text-danger rounded-full text-[10px] font-black uppercase tracking-widest border border-danger/20">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">My Delete Requests</h1>
          <p className="text-sm text-gray-500">Track the status of your device removal requests.</p>
        </div>
        <Link to="/monitoring" className="p-2.5 bg-surface border border-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
           <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="bg-surface rounded-[2rem] p-12 text-center border border-gray-100 shadow-sm">
            <Trash2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">You haven't made any deletion requests yet.</p>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="bg-surface rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-background-light rounded-2xl text-gray-400">
                   <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 uppercase tracking-tight">
                    {req.deviceType} #{req.deviceId}
                  </h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                    Requested on {new Date(req.requestedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {req.reviewedAt && (
                   <div className="text-right hidden md:block">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Reviewed on</p>
                      <p className="text-xs font-bold text-gray-600">{new Date(req.reviewedAt).toLocaleDateString()}</p>
                   </div>
                )}
                {getStatusBadge(req.status)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyDeleteRequests;
