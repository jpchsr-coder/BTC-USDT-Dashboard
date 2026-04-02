import React from 'react';

const Sparkline = ({ data, width = 200, height = 60 }) => {
  if (!data || data.length < 2) {
    return (
      <div className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded" style={{ width, height }}>
        <span className="text-xs text-gray-500 dark:text-gray-400">No data</span>
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const lastValue = data[data.length - 1];
  const firstValue = data[0];
  const isPositive = lastValue >= firstValue;

  return (
    <div className="relative">
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? '#10b981' : '#ef4444'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={`${points} ${width},${height} 0,${height}`}
          fill={isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}
        />
      </svg>
    </div>
  );
};

export default Sparkline;
