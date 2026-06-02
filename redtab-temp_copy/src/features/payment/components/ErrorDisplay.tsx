import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: { message?: string } | null;
  title?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  title = 'Failed to load payment data',
}) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4">
      <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
      <div>
        <h3 className="font-semibold text-red-900">{title}</h3>
        <p className="text-red-700 text-sm mt-1">
          {error?.message || 'Unable to fetch API data'}
        </p>
      </div>
    </div>
  );
};

export default ErrorDisplay;
