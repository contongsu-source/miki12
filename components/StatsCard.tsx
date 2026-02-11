import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  trend?: number; // percentage
  trendLabel?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'orange';
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, trendLabel, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center text-sm">
          {trend > 0 ? (
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
          ) : trend < 0 ? (
            <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
          ) : (
            <Minus className="w-4 h-4 text-slate-400 mr-1" />
          )}
          <span className={trend > 0 ? 'text-green-600 font-medium' : trend < 0 ? 'text-red-600 font-medium' : 'text-slate-500'}>
            {Math.abs(trend)}%
          </span>
          <span className="text-slate-400 ml-1">{trendLabel || 'dari bulan lalu'}</span>
        </div>
      )}
    </div>
  );
};