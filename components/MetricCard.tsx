import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  trend?: number;
  color: 'blue' | 'green' | 'red' | 'purple' | 'emerald' | 'orange';
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    trend: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    trend: 'text-green-600'
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    trend: 'text-red-600'
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    trend: 'text-purple-600'
  },
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    trend: 'text-emerald-600'
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    trend: 'text-orange-600'
  }
};

export default function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color 
}: MetricCardProps) {
  const classes = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${classes.bg}`}>
          <Icon className={`w-6 h-6 ${classes.icon}`} />
        </div>
        {trend !== undefined && trend !== 0 && (
          <div className={`flex items-center ${classes.trend}`}>
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            <span className="text-sm font-medium">
              {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {title}
        </h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {value}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
}