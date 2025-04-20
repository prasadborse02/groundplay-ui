import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Users, Share2, Edit, X,
  Check, AlertTriangle, ChevronLeft, CheckCircle 
} from 'lucide-react';
import Layout from '../../components/Layout';
import Map from '../../components/Map';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { gameService } from '../../api';
import { 
  formatTime, formatDate, getErrorMessage,
  getSportLabel, getShareableGameUrl, copyToClipboard 
} from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const GameDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrollLoading, setIsEnrollLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isCurrentPlayerEnrolled, setIsCurrentPlayerEnrolled] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  // Fetch game details and players
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Fetch game details
        const gameDetails = await gameService.getGameDetails(id);
        setGame(gameDetails);
        
        // Fetch players in the game
        const gamePlayers = await gameService.getPlayersInGame(id, 'active');
        setPlayers(gamePlayers);
        
        // Check if current player is enrolled
        const isEnrolled = gamePlayers.some(player => player.id === currentUser.id);
        setIsCurrentPlayerEnrolled(isEnrolled);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching game data:', err);
        setError('Failed to load game details. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchGameData();
  }, [id, currentUser.id]);

  // Handle enrollment
  const handleEnrollment = async () => {
    try {
      setIsEnrollLoading(true);
      setError('');
      setSuccessMessage('');
      
      if (isCurrentPlayerEnrolled) {
        // Unenroll
        await gameService.unenrollFromGame(id);
        setIsCurrentPlayerEnrolled(false);
        setSuccessMessage('You have been unenrolled from this game');
        
        // Remove player from the list
        setPlayers(players.filter(player => player.id !== currentUser.id));
      } else {
        // Enroll
        await gameService.enrollInGame(id);
        setIsCurrentPlayerEnrolled(true);
        setSuccessMessage('You have been enrolled in this game');
        
        // Add current player to the list
        setPlayers([...players, currentUser]);
      }
      
      // Refresh game details to get updated enrolledPlayers count
      const updatedGame = await gameService.getGameDetails(id);
      setGame(updatedGame);
    } catch (err) {
      console.error('Error handling enrollment:', err);
      setError(getErrorMessage(err));
      
      // If the error was due to game being full, refresh the game data to show correct count
      if (err.response?.data?.code === 'GAME_FULL') {
        try {
          const updatedGame = await gameService.getGameDetails(id);
          setGame(updatedGame);
        } catch (refreshErr) {
          console.error('Error refreshing game data:', refreshErr);
        }
      }
    } finally {
      setIsEnrollLoading(false);
    }
  };

  // Share game
  const handleShareGame = async () => {
    const url = getShareableGameUrl(id);
    const success = await copyToClipboard(url);
    
    if (success) {
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 3000);
    } else {
      setError('Failed to copy link. Please try again.');
    }
  };
  
  // Cancel game
  const [isCancellingGame, setIsCancellingGame] = useState(false);
  const [isRestartingGame, setIsRestartingGame] = useState(false);
  
  const handleCancelGame = async () => {
    if (!window.confirm('Are you sure you want to cancel this game? All players will be unenrolled and need to re-enroll if the game is restarted.')) {
      return;
    }
    
    try {
      setIsCancellingGame(true);
      setError('');
      setSuccessMessage('');
      
      // If the current user is enrolled, unenroll them first
      if (isCurrentPlayerEnrolled) {
        await gameService.unenrollFromGame(id);
        setIsCurrentPlayerEnrolled(false);
        // Remove player from the list
        setPlayers(players.filter(player => player.id !== currentUser.id));
      }
      
      // Use updateGame to set status to false
      await gameService.updateGame(id, { ...game, status: false });
      
      // Update local state
      setGame({ ...game, status: false });
      setSuccessMessage('Game has been cancelled successfully. If you restart the game, players will need to re-enroll.');
    } catch (err) {
      console.error('Error cancelling game:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsCancellingGame(false);
    }
  };
  
  // Restart game
  const handleRestartGame = async () => {
    if (!window.confirm('Are you sure you want to restart this game? Players will need to re-enroll to join.')) {
      return;
    }
    
    try {
      setIsRestartingGame(true);
      setError('');
      setSuccessMessage('');
      
      // Use updateGame to set status to true
      await gameService.updateGame(id, { ...game, status: true });
      
      // Update local state
      setGame({ ...game, status: true });
      
      // Clear the players list as all players need to re-enroll
      setPlayers([]);
      
      // Update success message to indicate players need to re-enroll
      setSuccessMessage('Game has been restarted successfully. All players will need to re-enroll to join.');
    } catch (err) {
      console.error('Error restarting game:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsRestartingGame(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (!game) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 rounded-xl p-8 text-center mb-8">
            <div className="flex justify-center mb-4">
              <AlertTriangle size={40} className="text-red-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Game Not Found</h2>
            <p className="text-gray-600 mb-6">
              The game you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex justify-center">
              <Button onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const isOrganizer = game.organizer === currentUser.id;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation and Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" /> Back
          </button>
          
          <div className="flex space-x-2">
            {isOrganizer && game.status && (
              <Link to={`/game/edit/${id}`}>
                <Button variant="outline" className="flex items-center">
                  <Edit size={16} className="md:mr-1" /> <span className="hidden md:inline">Edit</span>
                </Button>
              </Link>
            )}
            
            <div className="relative">
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={handleShareGame}
              >
                <Share2 size={16} className="md:mr-1" /> <span className="hidden md:inline">Share</span>
              </Button>
              
              {/* Share tooltip */}
              {showShareTooltip && (
                <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-gray-800 text-white text-sm rounded shadow-lg whitespace-nowrap">
                  <div className="flex items-center">
                    <CheckCircle size={14} className="mr-1 text-green-400" /> Link copied!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {successMessage && (
          <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
        )}

        {/* Game Header */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium mr-3 ${
              game.sport === 'CRICKET' ? 'bg-green-100 text-green-600' :
              game.sport === 'FOOTBALL' ? 'bg-blue-100 text-blue-600' :
              game.sport === 'VOLLEYBALL' ? 'bg-yellow-100 text-yellow-600' :
              game.sport === 'TENNIS' ? 'bg-red-100 text-red-600' :
              game.sport === 'BADMINTON' ? 'bg-purple-100 text-purple-600' :
              'bg-gray-100 text-gray-600'
            }`}>
              {getSportLabel(game.sport)}
            </span>
            
            {!game.status && (
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                Cancelled
              </span>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {getSportLabel(game.sport)} Game
          </h1>
          
          {game.location && (
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin size={18} className="mr-2" />
              <span>{game.location}</span>
            </div>
          )}
        </div>

        {/* Game Details & Map */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2 space-y-6">
            {/* Date & Time */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar size={18} className="mr-2 text-primary" /> Date & Time
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Date</p>
                  <p className="font-medium">{formatDate(game.startTime)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Time</p>
                  <p className="font-medium">
                    {formatTime(game.startTime)} - {formatTime(game.endTime)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Team Information */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users size={18} className="mr-2 text-primary" /> Team Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Team Size</p>
                  <p className="font-medium">{game.teamSize} players</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Current Enrollment</p>
                  <p className="font-medium">{game.enrolledPlayers} / {game.teamSize} players</p>
                </div>
              </div>
              
              {/* Enrollment Progress Bar */}
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${(game.enrolledPlayers / game.teamSize) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Description */}
            {game.description && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{game.description}</p>
              </div>
            )}
            
            {/* Enrollment Action */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">
                    {isCurrentPlayerEnrolled ? 'You are enrolled in this game' : 'Join this game?'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {isCurrentPlayerEnrolled 
                      ? 'You can unenroll if you can no longer attend'
                      : game.status 
                        ? game.enrolledPlayers < game.teamSize 
                          ? 'There are still spots available' 
                          : 'This game is already full'
                        : 'This game has been cancelled'
                    }
                  </p>
                </div>
                <Button
                  onClick={handleEnrollment}
                  variant={isCurrentPlayerEnrolled ? 'danger' : 'primary'}
                  disabled={!game.status || (game.enrolledPlayers >= game.teamSize && !isCurrentPlayerEnrolled) || isEnrollLoading}
                  loading={isEnrollLoading}
                  className="flex items-center"
                >
                  {isCurrentPlayerEnrolled ? (
                    <>
                      <X size={16} className="mr-1" /> Unenroll
                    </>
                  ) : (
                    <>
                      <Check size={16} className="mr-1" /> Enroll
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Map & Location */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md h-full">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin size={18} className="mr-2 text-primary" /> Location
              </h3>
              <div className="h-64 mb-6">
                <Map 
                  center={[game.coordinates.lat, game.coordinates.lon]}
                  zoom={15}
                  games={[game]}
                />
              </div>
              <div className="space-y-3">
                <p className="text-gray-700">
                  {game.location || 'Location details not provided'}
                </p>
                
                <div className="text-sm text-gray-600 flex items-center">
                  <MapPin size={14} className="mr-1 text-primary" />
                  {game.coordinates.lat.toFixed(6)}, {game.coordinates.lon.toFixed(6)}
                </div>
                
                {/* Coordinates display */}
                <div className="mt-20 sm:mt-16 pt-4 border-t border-gray-100">
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${game.coordinates.lat},${game.coordinates.lon}&travelmode=driving`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block text-center py-3 px-4 bg-white text-primary border border-primary rounded-full hover:bg-blue-50 transition-colors mt-8 font-medium shadow-sm"
                  >
                    <span className="flex items-center justify-center">
                      <MapPin size={18} className="mr-2" /> Get Directions
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Players List */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users size={18} className="mr-2 text-primary" /> Enrolled Players
          </h3>
          
          {players.length === 0 ? (
            <p className="text-gray-600 italic">No players have enrolled yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {players.map((player) => (
                <div key={player.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{player.name}</p>
                    {player.id === game.organizer && (
                      <p className="text-xs text-gray-500">Organizer</p>
                    )}
                    {/* Show phone number only to the organizer */}
                    {isOrganizer && player.phoneNumber && (
                      <p className="text-xs text-gray-500">
                        {player.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Game Action Buttons at the bottom */}
        {isOrganizer && (
          <div className="mb-8 text-left flex flex-wrap gap-4">
            {game.status ? (
              <Button 
                variant="danger" 
                className="inline-flex items-center justify-center px-6"
                onClick={handleCancelGame}
                loading={isCancellingGame}
                disabled={isCancellingGame}
              >
                <X size={16} className="mr-2" /> Cancel Game
              </Button>
            ) : (
              <Button 
                variant="primary" 
                className="inline-flex items-center justify-center px-6"
                onClick={handleRestartGame}
                loading={isRestartingGame}
                disabled={isRestartingGame}
              >
                <Check size={16} className="mr-2" /> Restart Game
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GameDetailsPage;