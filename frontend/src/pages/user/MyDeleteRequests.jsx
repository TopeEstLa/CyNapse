import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { Loader2, Trash2, Clock, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../utils/constants';

const MyDeleteRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && ![Role.EXPERT, Role.ADMIN].includes(user.role)) {
      navigate('/');
      return;
    }
    fetchRequests();
  }, [user, navigate]);

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
    <main className="max-w-4xl mx-auto space-y-8 text-gray-900">
      <header className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">Deletion Requests</h1>
          <p className="text-sm text-gray-500 font-medium">Track status of device removal requests.</p>
        </div>
        <Link 
          to="/monitoring" 
          className="p-2 bg-white border border-gray-300 rounded-lg text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
          aria-label="Back to Monitoring"
        >
           <ArrowLeft className="w-5 h-5" />
        </Link>
      </header>

      <section className="space-y-4">
        {requests.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
            <Trash2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold uppercase text-xs tracking-widest">No active requests</p>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-gray-400 border border-gray-100">
                   <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 uppercase tracking-tight">
                    {req.deviceType} <span className="text-blue-600">#{req.deviceId}</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                    Requested on {new Date(req.requestedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {req.reviewedAt && (
                   <div className="text-right hidden md:block">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reviewed on</p>
                      <p className="text-xs font-semibold text-gray-600">{new Date(req.reviewedAt).toLocaleDateString()}</p>
                   </div>
                )}
                <div className="min-w-[120px] flex justify-end">
                  {getStatusBadge(req.status)}
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default MyDeleteRequests;
