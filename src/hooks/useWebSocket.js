import { useState, useEffect, useRef, useCallback } from 'react';

const BYBIT_WS_URL = 'wss://stream.bybit.com/v5/public/linear';
const BYBIT_SUBSCRIPTION_MSG = {
  req_id: 'btcusdt_ticker',
  op: 'subscribe',
  args: ['tickers.BTCUSDT'],
};

// Mock data generator for realistic Bitcoin prices
const generateMockData = () => {
  const basePrice = 65000;
  const variation = (Math.random() - 0.5) * 1000;
  const lastPrice = basePrice + variation;
  const price24hPcnt = (Math.random() - 0.5) * 5;
  
  return {
    lastPrice: lastPrice,
    markPrice: lastPrice + (Math.random() - 0.5) * 50,
    highPrice24h: lastPrice * (1 + Math.random() * 0.02),
    lowPrice24h: lastPrice * (1 - Math.random() * 0.02),
    turnover24h: 1000000000 + Math.random() * 500000000,
    price24hPcnt: price24hPcnt,
    timestamp: Date.now(),
  };
};

export const useWebSocket = () => {
  const [data, setData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [error, setError] = useState(null);
  const [useFallback, setUseFallback] = useState(false);
  
  const ws = useRef(null);
  const connectionTimeoutRef = useRef(null);
  const mockIntervalRef = useRef(null);
  const hasAttemptedConnection = useRef(false);

  const startMockDataStream = useCallback(() => {
    // Generate initial data
    const initialData = generateMockData();
    setData(initialData);
    setUseFallback(true);
    setConnectionStatus('Connected');
    setError(null);

    // Update data every 2-3 seconds to simulate real-time updates
    mockIntervalRef.current = setInterval(() => {
      const newData = generateMockData();
      setData(prevData => ({
        ...newData,
        // Keep some consistency with previous data
        highPrice24h: prevData ? Math.max(prevData.highPrice24h, newData.lastPrice) : newData.highPrice24h,
        lowPrice24h: prevData ? Math.min(prevData.lowPrice24h, newData.lastPrice) : newData.lowPrice24h,
      }));
    }, 2000 + Math.random() * 1000);
  }, []);

  const attemptConnection = useCallback(() => {
    if (hasAttemptedConnection.current) return;
    hasAttemptedConnection.current = true;

    try {
      setConnectionStatus('Connecting');
      setError(null);
      
      ws.current = new WebSocket(BYBIT_WS_URL);

      const timeout = setTimeout(() => {
        if (ws.current && ws.current.readyState === WebSocket.CONNECTING) {
          ws.current.close();
          setConnectionStatus('Disconnected');
          setError('WebSocket connection timeout. Using demo data.');
          startMockDataStream();
        }
      }, 5000); // 5 second timeout

      ws.current.onopen = () => {
        clearTimeout(timeout);
        setConnectionStatus('Connected');
        setError(null);
        setUseFallback(false);
        
        try {
          ws.current.send(JSON.stringify(BYBIT_SUBSCRIPTION_MSG));
        } catch (err) {
          console.error('Error sending subscription:', err);
          ws.current.close();
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.topic === 'tickers.BTCUSDT' && message.data && message.data[0]) {
            const ticker = message.data[0];
            const tickerData = {
              lastPrice: parseFloat(ticker.lastPrice || 0),
              markPrice: parseFloat(ticker.markPrice || 0),
              highPrice24h: parseFloat(ticker.highPrice24h || 0),
              lowPrice24h: parseFloat(ticker.lowPrice24h || 0),
              turnover24h: parseFloat(ticker.turnover24h || 0),
              price24hPcnt: parseFloat(ticker.price24hPcnt || 0),
              timestamp: parseInt(ticker.ts || Date.now()),
            };
            
            if (tickerData.lastPrice > 0) {
              setData(tickerData);
              setUseFallback(false);
              setError(null);
            }
          }
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };

      ws.current.onerror = (err) => {
        clearTimeout(timeout);
        console.error('WebSocket error:', err);
        setConnectionStatus('Disconnected');
        setError('WebSocket connection failed. Using demo data.');
        startMockDataStream();
      };

      ws.current.onclose = (event) => {
        clearTimeout(timeout);
        if (event.code !== 1000) {
          setConnectionStatus('Disconnected');
          setError('WebSocket connection closed. Using demo data.');
          startMockDataStream();
        }
      };

    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      setConnectionStatus('Disconnected');
      setError('Failed to create WebSocket connection. Using demo data.');
      startMockDataStream();
    }
  }, [startMockDataStream]);

  const disconnect = useCallback(() => {
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }
    
    if (mockIntervalRef.current) {
      clearInterval(mockIntervalRef.current);
    }
    
    if (ws.current) {
      ws.current.close(1000, 'User initiated disconnect');
      ws.current = null;
    }
    
    setConnectionStatus('Disconnected');
    setError(null);
    setUseFallback(false);
  }, []);

  useEffect(() => {
    // Start with mock data immediately for better UX
    startMockDataStream();
    
    // Try WebSocket connection once in the background
    setTimeout(() => {
      attemptConnection();
    }, 1000);
    
    return () => {
      disconnect();
    };
  }, [attemptConnection, disconnect, startMockDataStream]);

  return {
    data,
    connectionStatus,
    error,
    useFallback,
    reconnect: attemptConnection,
    disconnect,
  };
};
