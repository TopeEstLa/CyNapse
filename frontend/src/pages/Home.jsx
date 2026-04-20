import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2 } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
      <div className="p-4 bg-accent/10 rounded-3xl mb-6">
        <Building2 className="w-16 h-16 text-accent" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to CyNapse
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl">
        The ultimate platform for connecting minds and building the future.
      </p>
      {user ? (
        <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-lg font-medium text-gray-800">
            Hello, <span className="text-accent">{user.username}</span>!
          </p>
          <p className="text-sm text-gray-500 mt-1">Ready to explore?</p>
        </div>
      ) : (
        <div className="mt-8 flex gap-4">
          <a href="/login" className="px-6 py-3 bg-accent text-white font-semibold rounded-xl shadow-md hover:bg-accent/90 transition-all">
            Get Started
          </a>
          <a href="/register" className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
            Learn More
          </a>
        </div>
      )}
    </div>
  );
};

export default Home;
