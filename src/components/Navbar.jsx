import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">Ground<span className="text-accent">Play</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
                  Home
                </Link>
                <Link to="/game/create" className="text-gray-700 hover:text-primary transition-colors">
                  Create Game
                </Link>
                <Link to="/games/nearby" className="text-gray-700 hover:text-primary transition-colors">
                  Nearby Games
                </Link>
                <Link to="/story" className="text-gray-700 hover:text-primary transition-colors">
                  Story
                </Link>
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-primary transition-colors">
                    <span className="mr-1">{currentUser?.name || 'Profile'}</span>
                    <User size={18} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Profile
                    </Link>
                    <Link to="/profile/games" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Games
                    </Link>
                    <Link to="/profile/enrollments" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Enrollments
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" /> 
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2">
            <div className="flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/" 
                    className="text-gray-700 hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/game/create" 
                    className="text-gray-700 hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Game
                  </Link>
                  <Link 
                    to="/games/nearby" 
                    className="text-gray-700 hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Nearby Games
                  </Link>
                  <Link 
                    to="/story" 
                    className="text-gray-700 hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Story
                  </Link>
                  <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/profile/games" 
                    className="text-gray-700 hover:text-primary transition-colors py-2 pl-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Games
                  </Link>
                  <Link 
                    to="/profile/enrollments" 
                    className="text-gray-700 hover:text-primary transition-colors py-2 pl-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Enrollments
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center text-gray-700 hover:text-primary transition-colors py-2"
                  >
                    <LogOut size={16} className="mr-2" /> 
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn-primary text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;