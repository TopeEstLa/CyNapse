import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Calendar, Mail, Tag, Shield } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-accent/10 flex items-center px-8">
          <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center border-4 border-white translate-y-6">
            <User className="w-10 h-10 text-accent" />
          </div>
        </div>
        
        <div className="pt-12 px-8 pb-8">
          <h1 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
          <p className="text-gray-500">@{user.username}</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Email</p>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Birth Date</p>
                <p className="text-gray-900 font-medium">{user.birthDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <Tag className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Member Type</p>
                <p className="text-gray-900 font-medium">{user.memberType}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Gender</p>
                <p className="text-gray-900 font-medium">{user.gender}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
