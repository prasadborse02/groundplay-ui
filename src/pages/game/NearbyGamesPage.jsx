import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Filter, Calendar } from 'lucide-react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import Map from '../../components/Map';
import GameCard from '../../components/GameCard';
import { gameService } from '../../api';
import { SPORT_OPTIONS } from '../../utils/helpers';

const NearbyGamesPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // State for nearby games
  const [nearbyGames, setNearbyGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchRadius, setSearchRadius] = useState(10);
  const [selectedSports, setSelectedSports] = useState([]);
  const [startDate, setStartDate] = useState('');
  
  // Get current location on initial load and set it as currentLocation
  useEffect(() => {
    if (navigator.geolocation && !selectedLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({ lat: latitude, lon: longitude });
          fetchNearbyGames(latitude, longitude, searchRadius);
        },
        (err) => {
          console.error('Error getting location:', err);
        }
      );
    }
  }, [searchRadius, selectedLocation]);
  
  // Filter games when filters or games change
  useEffect(() => {
    if (nearbyGames.length > 0) {
      let filtered = [...nearbyGames];
      
      // Apply sports filter
      if (selectedSports.length > 0) {
        filtered = filtered.filter(game => selectedSports.includes(game.sport));
      }
      
      // Apply date filter (single date)
      if (startDate) {
        // Single date filter
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);
        
        filtered = filtered.filter(game => {
          const gameDate = new Date(game.startTime);
          return gameDate >= start && gameDate <= end;
        });
      }
      
      setFilteredGames(filtered);
    } else {
      setFilteredGames([]);
    }
  }, [selectedSports, startDate, nearbyGames]);
  
  // Fetch nearby games function
  const fetchNearbyGames = async (lat, lon, radius) => {
    try {
      setIsLoading(true);
      setError('');
      
      const games = await gameService.getNearbyGames(lat, lon, radius);
      setNearbyGames(games);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching nearby games:', err);
      setError('Failed to load nearby games. Please try again.');
      setIsLoading(false);
    }
  };


  // Handle location selection from map
  const handleLocationSelect = async (coords) => {
    setSelectedLocation(coords);
    
    // If we have coords, search for games
    fetchNearbyGames(coords.lat, coords.lon, searchRadius);
  };

  // Handle search radius change
  const handleRadiusChange = (e) => {
    let radius = Number(e.target.value);
    
    // Enforce min/max constraints (1-100 km)
    if (radius < 1) radius = 1;
    if (radius > 100) radius = 100;
    
    setSearchRadius(radius);
    if (selectedLocation) {
      fetchNearbyGames(selectedLocation.lat, selectedLocation.lon, radius);
    }
  };
  
  // Toggle sport selection
  const toggleSportSelection = (sportValue) => {
    setSelectedSports(prev => {
      if (prev.includes(sportValue)) {
        return prev.filter(sport => sport !== sportValue);
      } else {
        return [...prev, sportValue];
      }
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedSports([]);
    setStartDate('');
  };

  if (isLoading && !nearbyGames.length) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Find Nearby Games
        </h1>
        
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        
        <div className="mb-6">
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-600 mb-4">
              Select a location on the map to find games nearby.
            </p>
            
            <div className="mb-4">
              <Map 
                center={selectedLocation ? [selectedLocation.lat, selectedLocation.lon] : undefined}
                zoom={selectedLocation ? 12 : 5}
                selectable={true}
                selectedLocation={selectedLocation}
                onLocationSelect={handleLocationSelect}
                games={filteredGames}
                searchRadius={searchRadius}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex w-full sm:w-1/3">
                <div className="flex-grow mr-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search Radius (km)
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={searchRadius}
                      onChange={handleRadiusChange}
                      onBlur={(e) => {
                        // Ensure value is within range on blur
                        let value = Number(e.target.value);
                        if (value < 1 || isNaN(value)) value = 1;
                        if (value > 100) value = 100;
                        setSearchRadius(value);
                        
                        // Update search with validated value if needed
                        if (selectedLocation && value !== Number(e.target.value)) {
                          fetchNearbyGames(selectedLocation.lat, selectedLocation.lon, value);
                        }
                      }}
                      className="input-field rounded-r-none sm:rounded-r-md"
                    />
                    <Button 
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              const { latitude, longitude } = position.coords;
                              handleLocationSelect({ lat: latitude, lon: longitude });
                            },
                            (err) => {
                              console.error('Error getting location:', err);
                              setError('Failed to get your location. Please select it manually on the map.');
                            }
                          );
                        } else {
                          setError('Geolocation is not supported by your browser.');
                        }
                      }}
                      className="sm:hidden flex items-center justify-center p-2 rounded-l-none"
                      aria-label="Use my location"
                    >
                      <MapPin size={16} />
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const { latitude, longitude } = position.coords;
                        handleLocationSelect({ lat: latitude, lon: longitude });
                      },
                      (err) => {
                        console.error('Error getting location:', err);
                        setError('Failed to get your location. Please select it manually on the map.');
                      }
                    );
                  } else {
                    setError('Geolocation is not supported by your browser.');
                  }
                }}
                className="hidden sm:flex items-center"
                aria-label="Use my location"
              >
                <MapPin size={16} className="mr-1" /> 
                <span>Use My Location</span>
              </Button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Filter size={18} className="text-gray-500 mr-2" />
                <h3 className="text-lg font-medium">Filters</h3>
              </div>
              <button 
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primary-dark"
              >
                Clear All Filters
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sport filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Sports
                </label>
                <div className="flex flex-col space-y-2">
                  <select 
                    className="input-field w-full"
                    onChange={(e) => {
                      if (e.target.value) {
                        toggleSportSelection(e.target.value);
                      }
                    }}
                    value=""
                  >
                    <option value="">Add a sport</option>
                    {SPORT_OPTIONS.filter(sport => !selectedSports.includes(sport.value)).map(sport => (
                      <option key={sport.value} value={sport.value}>
                        {sport.label}
                      </option>
                    ))}
                  </select>
                  
                  {selectedSports.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 mb-2">Selected Sports:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSports.map(sportValue => {
                          const sport = SPORT_OPTIONS.find(s => s.value === sportValue);
                          return (
                            <div 
                              key={sportValue}
                              className="flex items-center bg-primary text-white px-3 py-1 rounded-full text-sm"
                            >
                              {sport ? sport.label : sportValue}
                              <button 
                                className="ml-2 hover:text-gray-200"
                                onClick={() => toggleSportSelection(sportValue)}
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Date filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Date
                </label>
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-col space-y-1">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="input-field w-full"
                    />
                  </div>
                  
                  {startDate && (
                    <div className="mt-2 flex">
                      <button
                        onClick={() => setStartDate('')}
                        className="text-sm text-primary hover:text-primary-dark"
                      >
                        Clear Date Filter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Games list */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {filteredGames.length > 0 ? `Found ${filteredGames.length} Games` : 'No Games Found'}
            </h3>
            
            {selectedSports.length > 0 && (
              <span className="text-sm bg-primary text-white px-2 py-0.5 rounded-full">
                {selectedSports.length} sports
              </span>
            )}
            
            {startDate && (
              <span className="text-sm bg-primary text-white px-2 py-0.5 rounded-full">
                Date: {new Date(startDate).toLocaleDateString()}
              </span>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
              
              {filteredGames.length === 0 && !isLoading && (
                <div className="md:col-span-2 lg:col-span-3 py-12 text-center">
                  <p className="text-gray-500 mb-4">No games found matching your criteria.</p>
                  <Button
                    onClick={() => navigate('/game/create')}
                    className="flex items-center mx-auto"
                  >
                    Create a New Game
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NearbyGamesPage;