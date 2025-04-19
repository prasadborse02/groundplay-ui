import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import GameCard from '../../components/GameCard';
import { useAuth } from '../../context/AuthContext';
import { gameService } from '../../api';

const MyEnrollmentsPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(false);
  const [error, setError] = useState('');

  // Fetch my enrollments on component mount
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchEnrollments = async () => {
      setIsLoadingEnrollments(true);
      try {
        const enrollments = await gameService.getMyEnrolledGames();
        console.log('API enrollments data:', enrollments);
        setMyEnrollments(enrollments || []);
        setError('');
      } catch (err) {
        console.error('Error fetching enrollments:', err);
        setError('Failed to load your enrollments.');
        setMyEnrollments([]);
      } finally {
        setIsLoadingEnrollments(false);
      }
    };
    
    fetchEnrollments();
  }, [currentUser]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pt-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Enrollments</h1>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div>
          <p className="text-gray-600 mb-6">Games you've joined as a player</p>
          
          {isLoadingEnrollments ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : myEnrollments.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEnrollments.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Users className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-xl font-medium text-gray-800 mb-2">No Enrollments Yet</h3>
              <p className="text-gray-600 mb-6">You haven't joined any games yet.</p>
              <Button
                onClick={() => window.location.href = '/games/nearby'}
                className="mx-auto"
              >
                Find Games to Join
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyEnrollmentsPage;