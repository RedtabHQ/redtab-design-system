// src/routes/NotFoundView.tsx
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundView = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center p-8 max-w-md">
      <div className="mb-6">
        <span className="text-8xl font-bold text-gray-200">404</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white btn text-sm font-bold hover:bg-black transition-colors"
        >
          <Home size={16} />
          Go to Dashboard
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 btn text-sm font-bold hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>
    </div>
  </div>
);
