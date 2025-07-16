import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import BrowseBooks from './components/BrowseBooks';
import BorrowedBooks from './components/BorrowedBooks';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import { loadUserFromStorage } from './store/authSlice';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  const handleLogin = () => {
    // Login is handled by Redux
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'browse':
        return <BrowseBooks />;
      case 'borrowed':
        return <BorrowedBooks />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
      />
      {renderCurrentView()}
    </div>
  );
}

export default App;