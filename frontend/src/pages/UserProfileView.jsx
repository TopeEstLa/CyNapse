import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { User, Calendar, Tag, Shield, Loader2, ArrowLeft, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExpProgressBar = ({ exp }) => {
  const levels = [100, 200, 300];
  let currentLevel = 0;
  let nextLevelExp = levels[0];
  let prevLevelExp = 0;

  for (let i = 0; i < levels.length; i++) {
    if (exp >= levels[i]) {
      currentLevel = i + 1;
      prevLevelExp = levels[i];
      nextLevelExp = levels[i + 1] || levels[i] + 100;
    } else {
      nextLevelExp = levels[i];
      break;
    }
  }

  const progress = Math.min(100, Math.max(0, ((exp - prevLevelExp) / (nextLevelExp - prevLevelExp)) * 100));
  const roleRewards = ['USER', 'SUPERUSER', 'SUPERVISOR', 'ADMIN'];
  const currentRole = roleRewards[Math.min(currentLevel, roleRewards.length - 1)];

  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-xs font-bold text-accent uppercase tracking-wider">Level {currentLevel}</span>
          <h4 className="text-sm font-bold text-gray-900">{currentRole}</h4>
        </div>
        <span className="text-xs text-gray-500 font-medium">{Math.floor(exp)} / {nextLevelExp} XP</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const UserProfileView = () => {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get(`/api/user/get?id=${id}`);
        setUserProfile(data);
      } catch (err) {
        setError('User not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
    </div>
  );

  if (error || !userProfile) return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold text-gray-900">{error || 'User not found'}</h2>
      <Link to="/users" className="text-accent mt-4 inline-block">Back to users</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/users" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-accent/10 flex items-center px-8">
          <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center border-4 border-white translate-y-6">
            {userProfile.image ? (
                <img src={userProfile.image} alt="" className="w-full h-full object-cover rounded-xl" />
            ) : (
                <User className="w-10 h-10 text-accent" />
            )}
          </div>
        </div>
        
        <div className="pt-12 px-8 pb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{userProfile.username}</h1>
              <p className="text-gray-500">@{userProfile.username}</p>
            </div>
            <div className="w-64">
               <ExpProgressBar exp={userProfile.exp || 0} />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Birth Date</p>
                <p className="text-gray-900 font-medium">{userProfile.birthDate || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <Tag className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Member Type</p>
                <p className="text-gray-900 font-medium">{userProfile.memberType}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
             <button className="px-8 py-3 bg-accent text-white rounded-2xl font-semibold hover:bg-accent/90 transition-all shadow-md">
                Follow
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
