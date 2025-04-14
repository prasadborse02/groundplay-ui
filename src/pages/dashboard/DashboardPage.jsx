import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, AlertTriangle, Filter, MapPin, Search } from 'lucide-react';
import Layout from '../../components/Layout';
import GameCard from '../../components/GameCard';
import Map from '../../components/Map';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { gameService } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { SPORT_OPTIONS } from '../../utils/helpers';

const DashboardTabs = {
  MY_GAMES: 'my-games',
  MY_ENROLLMENTS: 'my-enrollments',
  EXPLORE: 'explore',
  STORY: 'story',
};

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(DashboardTabs.MY_GAMES);
  const [myGames, setMyGames] = useState([]);
  const [enrolledGames, setEnrolledGames] = useState([]);
  const [nearbyGames, setNearbyGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedSport, setSelectedSport] = useState('');
  const [customLocation, setCustomLocation] = useState(null);
  const [showCustomLocationPicker, setShowCustomLocationPicker] = useState(false);
  const [searchRadius, setSearchRadius] = useState(10);

  useEffect(() => {
    const fetchMyGames = async () => {
      try {
        setIsLoading(true);
        setError('');
        const games = await gameService.getMyGames();
        setMyGames(games);
      } catch (err) {
        console.error('Error fetching my games:', err);
        setError('Failed to load your games. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchEnrolledGames = async () => {
      try {
        setIsLoading(true);
        setError('');
        const enrollments = await gameService.getMyEnrolledGames(true);
        // For each enrollment, fetch the game details
        const games = [];
        for (const enrollment of enrollments) {
          try {
            const gameDetails = await gameService.getGameDetails(enrollment.gameId);
            games.push(gameDetails);
          } catch (err) {
            console.error(`Error fetching game ${enrollment.gameId}:`, err);
          }
        }
        setEnrolledGames(games);
      } catch (err) {
        console.error('Error fetching enrolled games:', err);
        setError('Failed to load your enrollments. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchNearbyGames = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Get current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setCurrentLocation({ lat: latitude, lon: longitude });
              
              try {
                const games = await gameService.getNearbyGames(latitude, longitude, 10);
                setNearbyGames(games);
              } catch (err) {
                console.error('Error fetching nearby games:', err);
                setError('Failed to load nearby games. Please try again.');
              } finally {
                setIsLoading(false);
              }
            },
            (err) => {
              console.error('Error getting location:', err);
              setError('Failed to get your location. Please allow location access to see nearby games.');
              setIsLoading(false);
            }
          );
        } else {
          setError('Geolocation is not supported by your browser.');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error in location or nearby games:', err);
        setIsLoading(false);
      }
    };

    // Fetch data based on active tab
    if (activeTab === DashboardTabs.MY_GAMES) {
      fetchMyGames();
    } else if (activeTab === DashboardTabs.MY_ENROLLMENTS) {
      fetchEnrolledGames();
    } else if (activeTab === DashboardTabs.EXPLORE) {
      fetchNearbyGames();
    } else {
      setIsLoading(false);
    }
  }, [activeTab]);
  
  // Filter games when sport filter or games change
  useEffect(() => {
    if (nearbyGames.length > 0) {
      if (selectedSport) {
        const filtered = nearbyGames.filter(game => game.sport === selectedSport);
        setFilteredGames(filtered);
      } else {
        setFilteredGames(nearbyGames);
      }
    } else {
      setFilteredGames([]);
    }
  }, [selectedSport, nearbyGames]);
  
  // Function to search games in a custom location
  const searchGamesInCustomLocation = async () => {
    if (!customLocation) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      const games = await gameService.getNearbyGames(
        customLocation.lat, 
        customLocation.lon, 
        searchRadius
      );
      
      setNearbyGames(games);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching games at custom location:', err);
      setError('Failed to load games at the selected location. Please try again.');
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (error) {
      return <Alert type="error" message={error} />;
    }

    switch (activeTab) {
      case DashboardTabs.MY_GAMES:
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Games</h2>
              <Button 
                onClick={() => navigate('/game/create')}
                className="flex items-center"
              >
                <PlusCircle size={18} className="mr-1" /> Create Game
              </Button>
            </div>
            
            {myGames.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <div className="flex justify-center mb-4">
                  <AlertTriangle size={40} className="text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No games found</h3>
                <p className="text-gray-600 mb-6">You haven't created any games yet.</p>
                <Button onClick={() => navigate('/game/create')}>
                  Create Your First Game
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </div>
        );
      
      case DashboardTabs.MY_ENROLLMENTS:
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Enrollments</h2>
              <Button 
                onClick={() => setActiveTab(DashboardTabs.EXPLORE)}
                variant="secondary"
                className="flex items-center"
              >
                Find Games
              </Button>
            </div>
            
            {enrolledGames.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <div className="flex justify-center mb-4">
                  <AlertTriangle size={40} className="text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No enrollments found</h3>
                <p className="text-gray-600 mb-6">You haven't joined any games yet.</p>
                <Button onClick={() => setActiveTab(DashboardTabs.EXPLORE)}>
                  Explore Nearby Games
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </div>
        );
      
      case DashboardTabs.EXPLORE:
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Explore Nearby Games</h2>
              <Button 
                onClick={() => setShowCustomLocationPicker(!showCustomLocationPicker)}
                variant="secondary"
                className="flex items-center"
              >
                <MapPin size={18} className="mr-1" /> 
                {showCustomLocationPicker ? 'Hide Location Picker' : 'Choose Location'}
              </Button>
            </div>
            
            {/* Custom Location Picker */}
            {showCustomLocationPicker && (
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Choose Custom Location</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Drop a pin on the map to search for games in a different location.
                </p>
                
                <div className="mb-4">
                  <Map 
                    center={customLocation ? [customLocation.lat, customLocation.lon] : 
                           currentLocation ? [currentLocation.lat, currentLocation.lon] : undefined}
                    zoom={customLocation ? 12 : 5}
                    selectable={true}
                    selectedLocation={customLocation}
                    onLocationSelect={(coords) => setCustomLocation(coords)}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="w-full sm:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Search Radius (km)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={searchRadius}
                      onChange={(e) => setSearchRadius(Number(e.target.value))}
                      className="input-field"
                    />
                  </div>
                  
                  <Button 
                    onClick={searchGamesInCustomLocation}
                    disabled={!customLocation}
                    className="flex items-center"
                  >
                    <Search size={16} className="mr-1" /> Search This Area
                  </Button>
                </div>
              </div>
            )}
            
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center">
                <Filter size={18} className="text-gray-500 mr-2" />
                <h3 className="text-lg font-medium">Filters</h3>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm font-medium 
                    ${selectedSport === '' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setSelectedSport('')}
                >
                  All Sports
                </button>
                
                {SPORT_OPTIONS.map(sport => (
                  <button
                    key={sport.value}
                    className={`px-3 py-1 rounded-full text-sm font-medium 
                      ${selectedSport === sport.value ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => setSelectedSport(sport.value)}
                  >
                    {sport.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <Map 
                center={customLocation ? [customLocation.lat, customLocation.lon] : 
                       currentLocation ? [currentLocation.lat, currentLocation.lon] : undefined}
                zoom={12}
                games={filteredGames}
              />
            </div>
            
            {filteredGames.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <div className="flex justify-center mb-4">
                  <AlertTriangle size={40} className="text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No games found</h3>
                <p className="text-gray-600 mb-6">
                  {selectedSport ? 
                    `No ${SPORT_OPTIONS.find(s => s.value === selectedSport)?.label || selectedSport} games found in this area.` : 
                    'There are no games in this area. Why not create one?'}
                </p>
                <Button onClick={() => navigate('/game/create')}>
                  Create Game
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </div>
        );
      
      case DashboardTabs.STORY:
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            
            <div className="prose prose-lg max-w-none">
              <p>
                GroundPlay started from a simple idea: to make it easier for people to find and join local sports games.
              </p>
              
              <p>
                As an avid sports enthusiast, I often found it difficult to gather enough players for a casual cricket match on weekends. Group chats would get chaotic, plans would fall through, and we'd end up with either too few players or miscommunications about time and location.
              </p>
              
              <p>
                I realized there needed to be a better way to organize local games, discover new players in the area, and create a community around the sports we love. That's when the idea for GroundPlay was born.
              </p>
              
              <p>
                The platform aims to break down barriers to participation in sports by making it simple to:
              </p>
              
              <ul>
                <li>Create and organize games with clear details about location, time, and player requirements</li>
                <li>Discover games happening nearby based on your location</li>
                <li>Join games with just a few taps</li>
                <li>Meet new players who share your passion for sports</li>
              </ul>
              
              <p>
                Whether you're new to a city, looking to stay active, or just wanting to expand your social circle through sports, GroundPlay is designed to connect you with like-minded individuals who share your enthusiasm.
              </p>
              
              <p>
                This is just the beginning of our journey. We're constantly improving the platform based on feedback from our community. Future plans include features like team formations, skill levels, leaderboards, and more sophisticated discovery tools.
              </p>
              
              <p>
                Thank you for being part of this community, and we look forward to seeing you on the field!
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {currentUser?.name || 'Player'}
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your games and discover new ones to join
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            className={`pb-4 px-1 ${
              activeTab === DashboardTabs.MY_GAMES
                ? 'border-b-2 border-primary text-primary font-medium'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab(DashboardTabs.MY_GAMES)}
          >
            My Games
          </button>
          <button
            className={`pb-4 px-1 ${
              activeTab === DashboardTabs.MY_ENROLLMENTS
                ? 'border-b-2 border-primary text-primary font-medium'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab(DashboardTabs.MY_ENROLLMENTS)}
          >
            My Enrollments
          </button>
          <button
            className={`pb-4 px-1 ${
              activeTab === DashboardTabs.EXPLORE
                ? 'border-b-2 border-primary text-primary font-medium'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab(DashboardTabs.EXPLORE)}
          >
            Explore Nearby
          </button>
          <button
            className={`pb-4 px-1 ${
              activeTab === DashboardTabs.STORY
                ? 'border-b-2 border-primary text-primary font-medium'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab(DashboardTabs.STORY)}
          >
            Story
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </Layout>
  );
};

export default DashboardPage;