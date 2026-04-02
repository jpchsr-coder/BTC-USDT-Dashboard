import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  previousValue, 
  change, 
  changePercent, 
  isLoading = false,
  format = 'number',
  icon: Icon
}) => {
  const formatValue = (val) => {
    if (val === null || val === undefined) return '--';
    
    switch (format) {
      case 'price':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(val);
      case 'percent':
        return `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;
      case 'volume':
        if (val >= 1000000) {
          return `${(val / 1000000).toFixed(2)}M`;
        } else if (val >= 1000) {
          return `${(val / 1000).toFixed(2)}K`;
        }
        return val.toFixed(2);
      case 'text':
        return val;
      default:
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(val);
    }
  };

  const isPositive = change !== undefined ? change > 0 : changePercent > 0;
  const isNegative = change !== undefined ? change < 0 : changePercent < 0;

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
        <div className="space-y-3">
          <div className="skeleton h-4 w-24"></div>
          <div className="skeleton h-8 w-32"></div>
          <div className="skeleton h-4 w-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        {Icon && <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {formatValue(value)}
        </div>
        
        {(change !== undefined || changePercent !== undefined) && (
          <div className={`flex items-center text-sm ${
            isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {isPositive && (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
            {isNegative && (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            {change !== undefined && formatValue(change)}
            {changePercent !== undefined && formatValue(changePercent)}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
