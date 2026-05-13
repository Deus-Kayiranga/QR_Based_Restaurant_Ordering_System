import React from 'react';
import { useSearchParams } from 'react-router-dom';
import MenuBrowserPage from './MenuBrowserPage';

const AddMoreItemsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  // Simply render the MenuBrowserPage. It already has a dark theme, 
  // sticky header, and back navigation.
  return (
    <div className="flex flex-col min-h-screen bg-[#111111]">
      <MenuBrowserPage />
      
      {/* Optional context overlay if adding to a specific order */}
      {orderId && (
        <div className="fixed top-20 right-4 z-40 animate-slideDown pointer-events-none">
          <div className="bg-primary/20 backdrop-blur-md border border-primary/30 px-3 py-1.5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest shadow-lg">
            Adding to Order #{orderId}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMoreItemsPage;
