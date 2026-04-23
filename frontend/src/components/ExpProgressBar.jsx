import React, { useState, useEffect } from 'react';
import { userApi } from '../utils/api';
import { Role } from '../utils/constants';

const ExpProgressBar = ({ user, isCurrentUser = true }) => {
  const [nextRoleData, setNextRoleData] = useState(null);
  const [neededExp, setNeededExp] = useState(null);
  const [mapping, setMapping] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpData = async () => {
      try {
        const roleMapping = await userApi.getExpMapping();
        setMapping(roleMapping);
        const sortedRoles = Object.entries(roleMapping).sort((a, b) => a[1] - b[1]);
        const currentExp = user.exp || 0;

        const currentRoleIndex = [...sortedRoles].reverse().findIndex(([_, roleExp]) => currentExp >= roleExp);
        const actualCurrentRoleIndex = currentRoleIndex !== -1 ? (sortedRoles.length - 1 - currentRoleIndex) : 0;
        
        const nextRoleEntry = sortedRoles[actualCurrentRoleIndex + 1];

        if (nextRoleEntry) {
          setNextRoleData(nextRoleEntry[0]);
          setNeededExp(nextRoleEntry[1]);
        } else {
          setNextRoleData(null);
          setNeededExp(null);
        }
      } catch (err) {
        console.error('Failed to fetch XP data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchExpData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="w-full animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-2 bg-gray-200 rounded-full w-full"></div>
      </div>
    );
  }

  const currentExp = user.exp || 0;
  let currentRole = user.role || Role.USER;
  
  if (mapping) {
      const sortedRoles = Object.entries(mapping).sort((a, b) => a[1] - b[1]);
      const roleFound = [...sortedRoles].reverse().find(([_, roleExp]) => currentExp >= roleExp);
      if (roleFound) currentRole = roleFound[0];
  }

  if (!nextRoleData) {
      return (
        <div className="space-y-2 w-full text-left">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] font-black text-primary uppercase tracking-wider">Maximum Level</span>
              <h4 className="text-sm font-bold text-gray-900">{currentRole}</h4>
            </div>
            <span className="text-xs text-gray-500 font-medium">{Math.floor(currentExp)} XP</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-full" />
          </div>
        </div>
      );
  }

  const totalNextExp = neededExp;
  
  let prevLevelExp = 0;
  if (mapping) {
      const sortedRoles = Object.entries(mapping).sort((a, b) => a[1] - b[1]);
      const currentIndex = sortedRoles.findIndex(([role]) => role === currentRole);
      if (currentIndex !== -1) {
          prevLevelExp = sortedRoles[currentIndex][1];
      }
  }

  const expRange = totalNextExp - prevLevelExp;
  const progress = expRange > 0 
    ? Math.min(100, Math.max(0, ((currentExp - prevLevelExp) / expRange) * 100))
    : 100;

  return (
    <div className="space-y-2 w-full text-left">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-black text-primary uppercase tracking-wider">Rank: {currentRole}</span>
          <h4 className="text-sm font-bold text-gray-900">Next: {nextRoleData}</h4>
        </div>
        <span className="text-xs text-gray-500 font-medium">{Math.floor(currentExp)} / {Math.floor(totalNextExp)} XP</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ExpProgressBar;
