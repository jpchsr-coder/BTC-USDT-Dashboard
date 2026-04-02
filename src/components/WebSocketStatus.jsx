import React from 'react';

const WebSocketStatus = ({ status, error }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Connected':
        return 'bg-green-500';
      case 'Connecting':
        return 'bg-yellow-500';
      case 'Disconnected':
        return 'bg-red-500';
      case 'Error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'Connected':
        return 'Connected';
      case 'Connecting':
        return 'Connecting...';
      case 'Disconnected':
        return 'Disconnected';
      case 'Error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()} ${
          status === 'Connecting' ? 'animate-pulse' : ''
        }`}></div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{getStatusText()}</span>
      </div>
      
      {error && (
        <div className="text-xs text-red-500 max-w-xs truncate" title={error}>
          {error}
        </div>
      )}
    </div>
  );
};

export default WebSocketStatus;
