import React, { useState, useEffect } from 'react';
import { userApi } from '../utils/api';
import { Role } from '../utils/constants';

const ExpProgressBar = ({ user }) => {
  const [mapping, setMapping] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMapping = async () => {
      try {
        const rawMapping = await userApi.getExpMapping();
        // Invert mapping: from { "100": "ADVANCED" } to { "ADVANCED": 100 }
        const invertedMapping = Object.entries(rawMapping).reduce((acc, [exp, role]) => {
          acc[role] = parseInt(exp);
          return acc;
        }, {});
        setMapping(invertedMapping);
      } catch (err) {
        console.error('Failed to fetch XP mapping:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMapping();
  }, []);

  if (loading) return <div className="h-4 bg-gray-100 animate-pulse rounded w-full"></div>;
  if (!user || !mapping) return null;

  const rolesOrder = [Role.USER, Role.ADVANCED, Role.EXPERT, Role.ADMIN];
  const currentRole = user.role || Role.USER;
  const currentExp = user.exp || 0;

  const currentIndex = rolesOrder.indexOf(currentRole);
  const nextRole = rolesOrder[currentIndex + 1];

  if (!nextRole || mapping[nextRole] === undefined) {
    return (
      <div className="w-full">
        <div className="flex justify-between text-xs mb-1">
          <span className="font-bold text-gray-700">{currentRole} (Max Rank)</span>
          <span className="text-gray-500">{Math.floor(currentExp)} XP</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 w-full" />
        </div>
      </div>
    );
  }

  const minExp = mapping[currentRole] || 0;
  const targetExp = mapping[nextRole];
  const expInLevel = currentExp - minExp;
  const range = targetExp - minExp;
  
  // Calculate progress within the current level range
  const progress = range > 0 ? Math.min(100, Math.max(0, (expInLevel / range) * 100)) : 100;
  const expToNext = targetExp - currentExp;

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-gray-600">{currentRole}</span>
        <span className="text-blue-600">Next: {nextRole}</span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden border">
        <div 
          className="h-full bg-blue-600 transition-all duration-700 ease-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold">
        <span>{Math.floor(currentExp)} XP</span>
        <span>{Math.max(0, Math.floor(expToNext))} XP to go</span>
      </div>
    </div>
  );
};

export default ExpProgressBar;
