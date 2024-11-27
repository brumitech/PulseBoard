import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      <p className="text-gray-400 text-sm">Loading screens...</p>
    </div>
  </div>
);

export default Loading;
