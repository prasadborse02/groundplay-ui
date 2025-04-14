import { Link } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="max-w-md mx-auto text-center py-12">
        <div className="mb-6">
          <AlertTriangle size={64} className="mx-auto text-yellow-500" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        
        <p className="text-gray-600 mb-8">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="flex items-center justify-center"
          >
            <ArrowLeft size={16} className="mr-1" /> Go Back
          </Button>
          
          <Link to="/" className="btn-primary inline-flex items-center justify-center">
            <Home size={16} className="mr-1" /> Go Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;