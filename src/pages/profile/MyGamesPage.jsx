import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import GameCard from '../../components/GameCard';
import { useAuth } from '../../context/AuthContext';
import { gameService } from '../../api';

const MyGamesPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [myGames, setMyGames] = useState([]);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [error, setError] = useState('');

  // Fetch my games on component mount
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchGames = async () => {
      setIsLoadingGames(true);
      try {
        const games = await gameService.getMyGames();
        console.log('API games data:', games);
        setMyGames(games || []);
        setError('');
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Failed to load your games.');
        setMyGames([]);
      } finally {
        setIsLoadingGames(false);
      }
    };
    
    fetchGames();
  }, [currentUser]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pt-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Games</h1>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div>
          <p className="text-gray-600 mb-6">Games you've created and organized</p>
          
          {isLoadingGames ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : myGames.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-xl font-medium text-gray-800 mb-2">No Games Organized Yet</h3>
              <p className="text-gray-600 mb-6">You haven't created any games yet.</p>
              <Button
                onClick={() => window.location.href = '/game/create'}
                className="mx-auto"
              >
                Create Your First Game
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyGamesPage;