import { Link } from 'react-router-dom';
import { MapPin, Clock, Users, CalendarDays } from 'lucide-react';
import { formatDate, formatTime, getSportLabel } from '../utils/helpers';

const GameCard = ({ game }) => {
  const sportIconBg = {
    CRICKET: 'bg-green-100 text-green-600',
    FOOTBALL: 'bg-blue-100 text-blue-600',
    VOLLEYBALL: 'bg-yellow-100 text-yellow-600',
    TENNIS: 'bg-red-100 text-red-600',
    BADMINTON: 'bg-purple-100 text-purple-600',
    HOCKEY: 'bg-orange-100 text-orange-600',
    KABADDI: 'bg-pink-100 text-pink-600',
    KHO_KHO: 'bg-indigo-100 text-indigo-600',
    BASKETBALL: 'bg-amber-100 text-amber-600',
  };

  return (
    <div className="card hover:translate-y-[-4px]">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${sportIconBg[game.sport] || 'bg-gray-100 text-gray-600'}`}>
          {getSportLabel(game.sport)}
        </span>
        {!game.status && (
          <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
            Cancelled
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        {game.location && (
          <div className="flex items-start">
            <MapPin size={18} className="text-gray-500 mt-0.5 mr-2 shrink-0" />
            <p className="text-gray-700 text-sm">{game.location}</p>
          </div>
        )}
        
        <div className="flex items-center">
          <CalendarDays size={18} className="text-gray-500 mr-2 shrink-0" />
          <p className="text-gray-700 text-sm">{formatDate(game.startTime)}</p>
        </div>
        
        <div className="flex items-center">
          <Clock size={18} className="text-gray-500 mr-2 shrink-0" />
          <p className="text-gray-700 text-sm">
            {formatTime(game.startTime)} - {formatTime(game.endTime)}
          </p>
        </div>
        
        <div className="flex items-center">
          <Users size={18} className="text-gray-500 mr-2 shrink-0" />
          <p className="text-gray-700 text-sm">
            {game.enrolledPlayers} / {game.teamSize} players
          </p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link 
          to={`/groundplay/game/${game.id}`} 
          className="btn-primary w-full text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default GameCard;