import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 animate-bounce">
        <AlertCircle size={48} className="text-primary" />
      </div>
      
      <h1 className="text-6xl font-black text-textPrimary mb-4" style={{ fontFamily: 'Playfair Display' }}>404</h1>
      <h2 className="text-2xl font-bold text-textPrimary mb-2">Oops! Page Not Found</h2>
      <p className="text-textSecondary mb-10 max-w-xs mx-auto">
        The page you are looking for doesn't exist or has been moved to another location.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-sm">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-border rounded-2xl font-bold text-textPrimary hover:bg-bg transition-colors"
        >
          <ArrowLeft size={20} /> Go Back
        </button>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Home size={20} /> Home Page
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
