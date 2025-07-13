import { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import CalendarView from '@/components/CalendarView';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage('isAuthenticated', false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking authentication state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading HealthCare Calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {!isAuthenticated ? (
        <LoginForm onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <CalendarView onLogout={() => setIsAuthenticated(false)} />
      )}
    </div>
  );
};

export default Index;
