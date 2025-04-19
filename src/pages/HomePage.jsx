import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

// Mock data for featured games
const FEATURED_GAMES = [
  {
    id: 1,
    sport: 'CRICKET',
    location: 'Central Park, New Delhi',
    startTime: '2025-04-20T14:00:00',
    endTime: '2025-04-20T17:00:00',
    teamSize: 11,
    enrolledPlayers: 8,
  },
  {
    id: 2,
    sport: 'FOOTBALL',
    location: 'Sports Complex, Mumbai',
    startTime: '2025-04-18T18:00:00',
    endTime: '2025-04-18T20:00:00',
    teamSize: 10,
    enrolledPlayers: 6,
  },
  {
    id: 3,
    sport: 'BADMINTON',
    location: 'Indoor Stadium, Bangalore',
    startTime: '2025-04-19T10:00:00',
    endTime: '2025-04-19T12:00:00',
    teamSize: 4,
    enrolledPlayers: 2,
  },
];

const SPORTS = [
  { name: 'Cricket', icon: '🏏' },
  { name: 'Football', icon: '⚽' },
  { name: 'Volleyball', icon: '🏐' },
  { name: 'Tennis', icon: '🎾' },
  { name: 'Badminton', icon: '🏸' },
  { name: 'Basketball', icon: '🏀' },
  { name: 'Hockey', icon: '🏑' },
  { name: 'Kabaddi', icon: '🤼' },
  { name: 'Kho Kho', icon: '🏃‍♀️' },
];

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Find and Join Local Sports Games Near You
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-lg">
                GroundPlay makes it easy to discover, create, and join sports games in your area. Connect with local players and get in the game!
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/games/nearby" className="btn-primary">
                      Find Nearby Games
                    </Link>
                    <Link to="/game/create" className="btn-secondary">
                      Create Game
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary">
                      Login
                    </Link>
                    <Link to="/register" className="btn-primary">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary/80 to-accent/80 p-1">
                <img 
                  src="/src/assets/outdoor.png" 
                  alt="People playing sports"
                  className="rounded-xl w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section className="py-12 bg-gray-50 overflow-hidden relative">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Sports You Can Play
          </h2>
          
          {/* Animated sports cards container */}
          <div className="relative overflow-hidden mx-6 md:mx-12">
            {/* Left edge gradient overlay for vanishing effect - multi-layered for better blur */}
            <div className="absolute left-0 top-0 w-36 h-full z-10" style={{
              background: 'linear-gradient(to right, rgba(249, 249, 249, 1) 0%, rgba(249, 249, 249, 1) 15%, rgba(249, 249, 249, 0.95) 30%, rgba(249, 249, 249, 0.8) 45%, rgba(249, 249, 249, 0.6) 60%, rgba(249, 249, 249, 0.4) 75%, rgba(249, 249, 249, 0.2) 85%, rgba(249, 249, 249, 0) 100%)'
            }}></div>
            
            {/* Right edge gradient overlay for vanishing effect - multi-layered for better blur */}
            <div className="absolute right-0 top-0 w-36 h-full z-10" style={{
              background: 'linear-gradient(to left, rgba(249, 249, 249, 1) 0%, rgba(249, 249, 249, 1) 15%, rgba(249, 249, 249, 0.95) 30%, rgba(249, 249, 249, 0.8) 45%, rgba(249, 249, 249, 0.6) 60%, rgba(249, 249, 249, 0.4) 75%, rgba(249, 249, 249, 0.2) 85%, rgba(249, 249, 249, 0) 100%)'
            }}></div>
            
            {/* Continuous animated row of sports cards - automatically scrolls */}
            <div className="sports-carousel flex animate-sports-scroll">
              {/* Show the sports list twice to create a seamless loop */}
              {[...SPORTS, ...SPORTS, ...SPORTS].map((sport, index) => (
                <div 
                  key={`${sport.name}-${index}`} 
                  className="flex-shrink-0 w-48 mx-4 flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all"
                >
                  <span className="text-4xl mb-4">{sport.icon}</span>
                  <h3 className="text-lg font-semibold">{sport.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Custom style to pause animation on hover - we're using Tailwind for the animation */}
      <style jsx>{`
        .sports-carousel:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Featured Games Section - only shown to non-authenticated users */}
      {!isAuthenticated && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Example Games
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Here are some examples of the types of games you can create and join. Sign up to see real games in your area!
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURED_GAMES.map((game) => (
                <div key={game.id} className="card hover:translate-y-[-4px]">
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                      {game.sport.charAt(0) + game.sport.slice(1).toLowerCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin size={18} className="text-gray-500 mt-0.5 mr-2 shrink-0" />
                      <p className="text-gray-700">{game.location}</p>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar size={18} className="text-gray-500 mr-2 shrink-0" />
                      <p className="text-gray-700">
                        {new Date(game.startTime).toLocaleDateString()} • {new Date(game.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <Users size={18} className="text-gray-500 mr-2 shrink-0" />
                      <p className="text-gray-700">
                        {game.enrolledPlayers} / {game.teamSize} players
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <Link 
                      to="/login" 
                      className="flex items-center text-primary font-medium hover:underline"
                    >
                      Sign in to view <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link to="/register" className="btn-primary">
                Sign Up to Explore Games
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How GroundPlay Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up with your phone number and set up your player profile in minutes.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Games Nearby</h3>
              <p className="text-gray-600">
                Discover sports games happening in your area or create your own.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Join & Play</h3>
              <p className="text-gray-600">
                Enroll in games, meet other players, and enjoy your favorite sports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12 text-white shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              Ready to Get in the Game?
            </h2>
            <p className="text-xl md:text-center max-w-2xl mx-auto mb-8">
              Join GroundPlay today and start playing the sports you love with people in your community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {isAuthenticated ? (
                <Link to="/games/nearby" className="btn-primary bg-white text-primary hover:bg-gray-100">
                  Find Games Nearby
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary bg-white text-primary hover:bg-gray-100">
                    Sign Up Now
                  </Link>
                  <Link to="/login" className="btn-secondary border-white text-white hover:bg-white/10 bg-transparent">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;