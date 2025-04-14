import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">GroundPlay</h3>
            <p className="text-sm text-gray-600">
              A community-driven platform for finding, joining, and organizing local sports games.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/story" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Our Story
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Sports</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">Cricket</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">Football</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">Volleyball</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">Tennis</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">Badminton</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-4">
          <p className="text-sm text-center text-gray-500">
            &copy; {currentYear} GroundPlay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;