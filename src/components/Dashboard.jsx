import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useTheme } from '../hooks/useTheme';
import StatsCard from './StatsCard';
import ThemeToggle from './ThemeToggle';
import WebSocketStatus from './WebSocketStatus';
import TradingViewChart from './TradingViewChart';
import Sparkline from './Sparkline';

const Dashboard = () => {
  const { theme, toggleTheme } = useTheme();
  const { data, connectionStatus, error, useFallback } = useWebSocket();
  const [previousData, setPreviousData] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [priceChangeClass, setPriceChangeClass] = useState('');
  const priceHistoryRef = useRef([]);

  useEffect(() => {
    if (data) {
      // Update previous data for comparison
      setPreviousData(prev => {
        if (!prev || prev.lastPrice !== data.lastPrice) {
          // Trigger price change animation
          if (prev && prev.lastPrice !== data.lastPrice) {
            const changeClass = data.lastPrice > prev.lastPrice ? 'price-up' : 'price-down';
            setPriceChangeClass(changeClass);
            setTimeout(() => setPriceChangeClass(''), 500);
          }
          return data;
        }
        return prev;
      });

      // Update price history for sparkline (keep last 60 data points)
      priceHistoryRef.current = [...priceHistoryRef.current.slice(-59), data.lastPrice];
      setPriceHistory([...priceHistoryRef.current]);
    }
  }, [data]);

  const formatLargeNumber = (num) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toFixed(2);
  };

  const isLoading = !data && connectionStatus === 'Connecting';

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${priceChangeClass}`}>
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                BTC/USDT Dashboard
              </h1>
              <WebSocketStatus 
                status={connectionStatus} 
                error={error}
              />
              {useFallback && (
                <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                  Demo Mode
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Price Ticker Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bitcoin Price</div>
                <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  {data ? (
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(data.lastPrice)
                  ) : (
                    <div className="skeleton h-10 w-48"></div>
                  )}
                </div>
                {data && (
                  <div className={`text-lg font-medium mt-2 ${
                    data.price24hPcnt >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {data.price24hPcnt >= 0 ? '+' : ''}{data.price24hPcnt.toFixed(2)}%
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Last 60 seconds</div>
                <Sparkline data={priceHistory} width={300} height={80} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Mark Price"
            value={data?.markPrice}
            isLoading={isLoading}
            format="price"
          />
          
          <StatsCard
            title="24h High"
            value={data?.highPrice24h}
            isLoading={isLoading}
            format="price"
          />
          
          <StatsCard
            title="24h Low"
            value={data?.lowPrice24h}
            isLoading={isLoading}
            format="price"
          />
          
          <StatsCard
            title="24h Volume"
            value={data?.turnover24h}
            isLoading={isLoading}
            format="volume"
          />
        </div>

        {/* TradingView Chart */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Price Chart</h2>
          <TradingViewChart theme={theme} />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            title="24h Change"
            value={data?.lastPrice}
            previousValue={previousData?.lastPrice}
            changePercent={data?.price24hPcnt}
            isLoading={isLoading}
            format="price"
          />
          
          <StatsCard
            title="Last Update"
            value={data ? new Date(data.timestamp).toLocaleTimeString() : null}
            isLoading={isLoading}
            format="text"
          />
        </div>

        {/* Status Message */}
        {error && (
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm text-yellow-800 dark:text-yellow-200">{error}</span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 mt-12">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            {useFallback ? 'Demo Mode - Showing simulated data' : 'Real-time data from ByBit API • Powered by WebSocket'}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
