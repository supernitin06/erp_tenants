// components/StatsCard.jsx
import React from 'react';
import { motion } from 'framer-motion'; // Optional: for animations

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  trend = null,
  trendValue = null,
  subtitle = null,
  isLoading = false,
  onClick = null,
}) => {
  // Color variants for different card styles
  const colorVariants = {
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-500',
      iconColor: 'text-white',
      border: 'border-blue-100',
      text: 'text-blue-900',
      trendUp: 'text-green-600',
      trendDown: 'text-red-600',
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-500',
      iconColor: 'text-white',
      border: 'border-green-100',
      text: 'text-green-900',
      trendUp: 'text-green-600',
      trendDown: 'text-red-600',
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-500',
      iconColor: 'text-white',
      border: 'border-purple-100',
      text: 'text-purple-900',
      trendUp: 'text-green-600',
      trendDown: 'text-red-600',
    },
    orange: {
      bg: 'bg-orange-50',
      iconBg: 'bg-orange-500',
      iconColor: 'text-white',
      border: 'border-orange-100',
      text: 'text-orange-900',
      trendUp: 'text-green-600',
      trendDown: 'text-red-600',
    },
    pink: {
      bg: 'bg-pink-50',
      iconBg: 'bg-pink-500',
      iconColor: 'text-white',
      border: 'border-pink-100',
      text: 'text-pink-900',
      trendUp: 'text-green-600',
      trendDown: 'text-red-600',
    },
  };

  const colors = colorVariants[color] || colorVariants.blue;

  if (isLoading) {
    return (
      <div className={`p-6 rounded-xl border ${colors.border} ${colors.bg} animate-pulse`}>
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-8 w-32 bg-gray-300 rounded"></div>
          </div>
          <div className={`p-3 rounded-lg ${colors.iconBg} bg-opacity-50`}>
            <div className="w-6 h-6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`
        relative p-6 rounded-xl border ${colors.border} ${colors.bg}
        ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}
      `}
      onClick={onClick}
    >
      {/* Main Content */}
      <div className="flex items-start justify-between">
        {/* Text Content */}
        <div className="space-y-2">
          <p className={`text-sm font-medium ${colors.text} opacity-80`}>
            {title}
          </p>
          
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-bold text-gray-900">
              {value}
            </h3>
            
            {/* Trend Indicator */}
            {trend && (
              <span className={`
                text-sm font-semibold flex items-center
                ${trend === 'up' ? colors.trendUp : colors.trendDown}
              `}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
            )}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>

        {/* Icon */}
        <div className={`p-3 rounded-lg ${colors.iconBg} shadow-lg`}>
          <Icon className={`w-6 h-6 ${colors.iconColor}`} />
        </div>
      </div>

      {/* Optional Progress Bar */}
      {trend && (
        <div className="mt-4 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '75%' }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`h-full ${colors.iconBg}`}
          />
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;