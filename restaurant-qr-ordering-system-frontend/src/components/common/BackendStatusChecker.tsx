import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { XCircle, RefreshCw } from 'lucide-react';

export function BackendStatusChecker({ children }: { children: React.ReactNode }) {
  const [isBackendUp, setIsBackendUp] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const checkBackend = async () => {
    setIsChecking(true);
    try {
      await axiosInstance.get('/menu/categories');
      setIsBackendUp(true);
    } catch {
      setIsBackendUp(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (isChecking && isBackendUp === null) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#8B4513] animate-spin mx-auto mb-4" />
          <p className="text-[#8B7355] font-medium">Checking server connection...</p>
        </div>
      </div>
    );
  }

  if (isBackendUp === false) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-[#2C1810] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Server Not Running
          </h2>
          <p className="text-[#8B7355] mb-6">
            The backend server is not accessible. Please start the Spring Boot application.
          </p>
          <div className="bg-[#FFF8F0] rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-[#2C1810] mb-2">To start the backend:</p>
            <code className="text-xs text-[#8B4513] bg-white rounded-lg p-3 block">
              cd qr-ordering-system<br/>
              ./mvnw spring-boot:run
            </code>
          </div>
          <button
            onClick={checkBackend}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-[#8B4513] text-white rounded-xl font-semibold hover:bg-[#6B3410] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
