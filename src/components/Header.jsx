import { FaBook, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Header = ({ currentView, setCurrentView }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const isAdmin = user?.is_staff || user?.is_superuser;

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <FaBook className="text-primary-500 text-2xl" />
            <h1 className="text-2xl font-bold text-gray-900">BookLend</h1>
          </div>
          
          <nav className="flex space-x-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentView === 'dashboard'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('browse')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentView === 'browse'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Browse Books
            </button>
            <button
              onClick={() => setCurrentView('borrowed')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentView === 'borrowed'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Books
            </button>
            {isAdmin && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 ${
                  currentView === 'admin'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaCog />
                <span>Admin</span>
              </button>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaUser className="text-gray-400" />
              <span className="text-sm text-gray-700">{user?.first_name || user?.username}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;