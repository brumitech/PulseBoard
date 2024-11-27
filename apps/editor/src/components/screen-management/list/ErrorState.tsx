import React from 'react';
import { RefreshCw } from 'lucide-react';
import { ErrorStateProps } from './types';

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
    <div className="flex flex-col items-center space-y-4 max-w-md text-center">
      <div className="p-3 bg-red-500/10 rounded-full">
        <RefreshCw className="h-8 w-8 text-red-400" />
      </div>
      <p className="text-red-400">Error loading screens: {error.message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-gray-200 flex items-center space-x-2"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Retry</span>
      </button>
    </div>
  </div>
);

export default ErrorState;
