import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Search, XCircle } from 'lucide-react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import Map from '../../components/Map';
import { gameService } from '../../api';
import { SPORT_OPTIONS, getErrorMessage, formatDateForInput, calculateEndTime } from '../../utils/helpers';
import { createGameValidationSchema } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';

const CreateGamePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [isGeocodingLocation, setIsGeocodingLocation] = useState(false);
  const [selfEnroll, setSelfEnroll] = useState(true);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isSearchingLocations, setIsSearchingLocations] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  const [duration, setDuration] = useState({ hours: '', minutes: '' });
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      sport: 'CRICKET',
      location: '',
      startTime: '',
      endTime: '',
      description: '',
      teamSize: 2,
      status: true,
      coordinates: null,
    }
  });

  // Watch all form values
  const formValues = watch();
  
  // Calculate endTime based on startTime and duration
  useEffect(() => {
    const startTimeValue = formValues.startTime;
    
    if (startTimeValue) {
      const endTimeValue = calculateEndTime(startTimeValue, duration.hours || '1', duration.minutes || '0');
      
      if (endTimeValue) {
        setValue('endTime', endTimeValue);
      }
    }
  }, [formValues.startTime, duration, setValue]);

  // Fetch game details if in edit mode
  useEffect(() => {
    const fetchGameDetails = async () => {
      if (id) {
        try {
          setIsLoading(true);
          setIsEdit(true);
          const gameDetails = await gameService.getGameDetails(id);
          
          // Format dates for input fields
          const startTime = formatDateForInput(gameDetails.startTime);
          const endTime = formatDateForInput(gameDetails.endTime);
          
          // Calculate duration from start and end times
          if (gameDetails.startTime && gameDetails.endTime) {
            const startDate = new Date(gameDetails.startTime);
            const endDate = new Date(gameDetails.endTime);
            const diffMs = endDate - startDate;
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            
            // Update duration state (rounded to nearest 5 minutes)
            setDuration({
              hours: diffHours,
              minutes: diffMinutes
            });
          }
          
          // Set form values
          reset({
            sport: gameDetails.sport,
            location: gameDetails.location || '',
            startTime,
            endTime,
            description: gameDetails.description || '',
            teamSize: gameDetails.teamSize,
            status: gameDetails.status,
            coordinates: gameDetails.coordinates,
          });
          
          // Set selected location for map
          setSelectedLocation(gameDetails.coordinates);
          
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching game details:', error);
          setError('Failed to load game details. Please try again.');
          setIsLoading(false);
        }
      }
    };

    fetchGameDetails();
  }, [id, reset]);

  // Reverse geocode coordinates to get location name
  const reverseGeocode = async (lat, lon) => {
    try {
      setIsGeocodingLocation(true);
      // Using OpenStreetMap's Nominatim service for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      );
      
      if (!response.ok) throw new Error('Failed to get location name');
      
      const data = await response.json();
      console.log('Reverse geocode data:', data);
      
      // Extract location name from response
      let name = '';
      
      if (data.address) {
        // Build a more readable name from address components
        const components = [];
        
        // Create a more precise and accurate location string
        if (data.address.amenity) components.push(data.address.amenity);
        if (data.address.building) components.push(data.address.building);
        if (data.address.house_number) components.push(data.address.house_number);
        if (data.address.road) components.push(data.address.road);
        if (data.address.neighbourhood) components.push(data.address.neighbourhood);
        if (data.address.suburb) components.push(data.address.suburb);
        if (data.address.city_district) components.push(data.address.city_district);
        if (data.address.city) components.push(data.address.city);
        if (data.address.county) components.push(data.address.county);
        if (data.address.state) components.push(data.address.state);
        if (data.address.country) components.push(data.address.country);
        
        // Filter out duplicates and empty values
        const uniqueComponents = [...new Set(components.filter(Boolean))];
        
        if (uniqueComponents.length > 0) {
          // For nearby places, we want more detail (first 3-4 components)
          // For distant places, we want less detail (just city, state, country)
          if (uniqueComponents.length <= 4) {
            name = uniqueComponents.join(', ');
          } else {
            // If we have many components, take the most significant ones
            // Usually the first component is the most specific (building/road)
            // and then we want the city, state, country
            const specificComponent = uniqueComponents[0];
            const generalComponents = [];
            
            if (data.address.city) generalComponents.push(data.address.city);
            else if (data.address.county) generalComponents.push(data.address.county);
            
            if (data.address.state) generalComponents.push(data.address.state);
            if (data.address.country) generalComponents.push(data.address.country);
            
            name = [specificComponent, ...generalComponents].join(', ');
          }
        } else {
          // Fallback to display_name if we couldn't extract components
          name = data.display_name || `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
        }
      } else {
        // Fallback to display_name if no address
        name = data.display_name || `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
      }
      
      return name;
    } catch (err) {
      console.error('Error reverse geocoding:', err);
      return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    } finally {
      setIsGeocodingLocation(false);
    }
  };
  
  // Search for locations by query (forward geocoding)
  const searchLocations = async (query) => {
    if (!query || query.length < 3) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    try {
      setIsSearchingLocations(true);
      // Using OpenStreetMap's Nominatim service for forward geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      
      if (!response.ok) throw new Error('Failed to search locations');
      
      const data = await response.json();
      console.log('Search locations data:', data);
      
      // Format suggestions
      const suggestions = data.map(item => {
        // Create a more readable name
        let displayName = item.display_name;
        
        // Try to extract just the main parts
        const parts = item.display_name.split(', ');
        if (parts.length > 3) {
          // For places, take the first part (specific location) and the last two parts (city/state/country)
          displayName = [parts[0], parts[parts.length-2], parts[parts.length-1]].join(', ');
        }
        
        return {
          name: displayName,
          fullName: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        };
      });
      
      setLocationSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } catch (err) {
      console.error('Error searching locations:', err);
      setLocationSuggestions([]);
    } finally {
      setIsSearchingLocations(false);
    }
  };
  
  // Handle location search input changes with debounce
  const handleLocationSearchChange = (e) => {
    const query = e.target.value;
    setLocationSearchQuery(query);
    setLocationName(query);
    
    // Debounce search requests to avoid too many API calls
    clearTimeout(window.locationSearchTimeout);
    window.locationSearchTimeout = setTimeout(() => {
      searchLocations(query);
    }, 500);
  };
  
  // Handle location suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    setSelectedLocation({ lat: suggestion.lat, lon: suggestion.lon });
    setLocationName(suggestion.name);
    setLocationSearchQuery(suggestion.name);
    setValue('location', suggestion.name);
    setValue('coordinates', { lat: suggestion.lat, lon: suggestion.lon }, { shouldValidate: true });
    setShowSuggestions(false);
  };
  

  // Handle location selection from map
  const handleLocationSelect = async (coords) => {
    // Ensure we have correct {lat, lon} format
    const validCoords = {
      lat: coords.lat,
      lon: coords.lon
    };
    
    setSelectedLocation(validCoords);
    setValue('coordinates', validCoords, { shouldValidate: true });
    
    // Get location name from coordinates
    try {
      const name = await reverseGeocode(validCoords.lat, validCoords.lon);
      setLocationName(name);
      setLocationSearchQuery(name);
      setValue('location', name);
    } catch (err) {
      console.error('Error getting location name:', err);
      // Fallback to coordinates if geocoding fails
      const coordStr = `${validCoords.lat.toFixed(6)}, ${validCoords.lon.toFixed(6)}`;
      setLocationName(coordStr);
      setLocationSearchQuery(coordStr);
      setValue('location', coordStr);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError('');
      setSuccessMessage('');

      // Make sure we have a valid end time
      let startTimeValue = data.startTime;
      let endTimeValue = data.endTime;
      
      // Force recalculation of end time to ensure validity
      console.log("Calculating end time from duration");
      
      // Use default duration of 1 hour if hours is not set
      const hoursValue = duration.hours || '1';
      const minutesValue = duration.minutes || '0';
      
      // Use our helper to calculate a valid end time
      const recalculatedEndTime = calculateEndTime(
        startTimeValue, 
        hoursValue,
        minutesValue
      );
      
      // If still empty after recalculation, show error
      if (!recalculatedEndTime) {
        setError('Unable to calculate end time. Please check start time and duration.');
        setIsSubmitting(false);
        return;
      }
      
      // Use the recalculated time
      endTimeValue = recalculatedEndTime;
      data.endTime = endTimeValue;

      // Format dates for server
      const formatForServer = (dateStr) => {
        try {
          const date = new Date(dateStr);
          return date.toISOString().split('.')[0]; // Format as ISO without milliseconds
        } catch (e) {
          console.warn("Date format error:", e);
          return dateStr; // If parsing fails, return original
        }
      };
      
      // Prepare game data with properly formatted dates
      const gameData = {
        ...data,
        startTime: formatForServer(startTimeValue),
        endTime: formatForServer(endTimeValue),
        organizer: currentUser.id,
        enrolledPlayers: 0, // This will be updated by the server
      };

      let gameId;
      if (isEdit) {
        // Update existing game
        await gameService.updateGame(id, gameData);
        gameId = id;
        setSuccessMessage('Game updated successfully!');
      } else {
        // Create new game
        const newGame = await gameService.createGame(gameData);
        gameId = newGame.id;
        
        // Enroll the current user if checkbox is checked
        if (selfEnroll) {
          await gameService.enrollInGame(gameId);
        }
        
        setSuccessMessage('Game created successfully!');
      }

      // Redirect to game details page after short delay
      setTimeout(() => {
        navigate(`/game/${gameId}`);
      }, 1500);
    } catch (err) {
      console.error('Error saving game:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
          {isEdit ? 'Edit Game' : 'Create New Game'}
        </h1>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {successMessage && <Alert type="success" message={successMessage} />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sport Selection */}
            <div>
              <label htmlFor="sport" className="block text-sm font-medium text-gray-700 mb-1">
                Sport <span className="text-red-500">*</span>
              </label>
              <select
                id="sport"
                className={`input-field ${errors.sport ? 'border-red-500' : ''}`}
                {...register('sport', createGameValidationSchema.sport)}
              >
                {SPORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.sport && (
                <p className="mt-1 text-sm text-red-500">{errors.sport.message}</p>
              )}
            </div>

            {/* Team Size */}
            <div>
              <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-1">
                Team Size <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="teamSize"
                min="2"
                max="100"
                className={`input-field ${errors.teamSize ? 'border-red-500' : ''}`}
                {...register('teamSize', createGameValidationSchema.teamSize)}
              />
              {errors.teamSize && (
                <p className="mt-1 text-sm text-red-500">{errors.teamSize.message}</p>
              )}
            </div>
          </div>

          {/* Location Field */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative" ref={suggestionsRef} style={{ position: "relative", zIndex: 9999 }}>
                  <div className="relative">
                    <input
                      type="text"
                      id="location"
                      placeholder="Search or select location on map"
                      className={`input-field pl-8 pr-8 ${errors.location ? 'border-red-500' : ''}`}
                      value={locationSearchQuery}
                      onChange={handleLocationSearchChange}
                      onFocus={() => setShowSuggestions(locationSuggestions.length > 0)}
                      onBlur={() => {
                        // Delay hiding suggestions to allow clicking them
                        setTimeout(() => setShowSuggestions(false), 200);
                      }}
                    />
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    
                    {/* Show either loading spinner or clear button */}
                    {isSearchingLocations || isGeocodingLocation ? (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    ) : locationSearchQuery ? (
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => {
                          setLocationSearchQuery('');
                          setLocationName('');
                          setLocationSuggestions([]);
                        }}
                      >
                        <XCircle size={16} />
                      </button>
                    ) : null}
                  </div>
                  
                  {/* Location suggestions dropdown */}
                  {showSuggestions && (
                    <div className="absolute z-[9999] mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm" style={{ position: "absolute", zIndex: 9999 }}>
                      {locationSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="cursor-pointer hover:bg-gray-100 py-2 px-3"
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          <div className="font-medium">{suggestion.name}</div>
                          {suggestion.fullName && (
                            <div className="text-xs text-gray-500 truncate">{suggestion.fullName}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Hidden input for form submission */}
                  <input
                    type="hidden"
                    {...register('location')}
                    value={locationName}
                  />
                </div>
                <div className="flex-shrink-0 ml-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center"
                    title="Use my current location"
                    onClick={() => {
                      // Try to get user's current location
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            const { latitude, longitude } = position.coords;
                            // Ensure consistent format with lat and lon properties
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
                  >
                    <MapPin size={16} className="md:mr-1" /> 
                    <span className="hidden md:inline">Use My Location</span>
                  </Button>
                </div>
              </div>
            </div>
            
            {errors.coordinates && (
              <p className="mt-1 text-sm text-red-500">
                {errors.coordinates.message}
              </p>
            )}
          </div>

          {/* Map for Location Selection */}
          <div className="border border-gray-200 rounded-xl overflow-hidden p-4 bg-gray-50" style={{ position: 'relative', zIndex: 10 }}>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Select Location on Map
            </h3>
            <Map 
              selectable={true}
              onLocationSelect={handleLocationSelect}
              selectedLocation={selectedLocation}
              center={selectedLocation ? [selectedLocation.lat, selectedLocation.lon] : undefined}
              zoom={selectedLocation ? 15 : 5}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Start Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  id="startTime"
                  className={`input-field ${errors.startTime ? 'border-red-500' : ''}`}
                  {...register('startTime', createGameValidationSchema.startTime)}
                />
              </div>
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-500">{errors.startTime.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration <span className="text-red-500">*</span>
              </label>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Hours selection */}
                  <div>
                    <input 
                      type="number"
                      id="duration-hours"
                      className="input-field" 
                      placeholder="Hours"
                      min="0"
                      max="24"
                      value={duration.hours}
                      onChange={(e) => {
                        const newValue = e.target.value === '' ? '' : parseInt(e.target.value);
                        if (newValue === '' || !isNaN(newValue)) {
                          // If it's a valid number, constrain to range
                          const validValue = newValue === '' ? '' : Math.min(Math.max(newValue, 0), 24);
                          
                          // Check if we're at max hours (24) - if so, minutes must be 0
                          const newMinutes = validValue === 24 ? 0 : duration.minutes;
                          
                          setDuration({
                            hours: validValue,
                            minutes: newMinutes
                          });
                          
                          // The endTime will be updated by the useEffect
                        }
                      }}
                      onBlur={() => {
                        // When field loses focus, convert empty string to 0
                        if (duration.hours === '') {
                          setDuration(prev => ({
                            ...prev,
                            hours: 0
                          }));
                          // The endTime will be updated by the useEffect
                        }
                      }}
                    />
                  </div>
                  
                  {/* Minutes selection */}
                  <div>
                    <input 
                      type="number"
                      id="duration-minutes"
                      className="input-field" 
                      placeholder="Minutes"
                      min="0"
                      max={duration.hours === 24 ? 0 : 59}
                      disabled={duration.hours === 24}
                      value={duration.minutes}
                      onChange={(e) => {
                        const newValue = e.target.value === '' ? '' : parseInt(e.target.value);
                        if (newValue === '' || !isNaN(newValue)) {
                          if (newValue === '') {
                            setDuration(prev => ({
                              ...prev,
                              minutes: ''
                            }));
                          } else {
                            // Constrain to valid range
                            const validValue = Math.min(Math.max(newValue, 0), duration.hours === 24 ? 0 : 59);
                            
                            setDuration(prev => ({
                              ...prev,
                              minutes: validValue
                            }));
                            
                            // The endTime will be updated by the useEffect
                          }
                        }
                      }}
                      onBlur={() => {
                        // When field loses focus, convert empty string to 0
                        if (duration.minutes === '') {
                          setDuration(prev => ({
                            ...prev,
                            minutes: 0
                          }));
                          // The endTime will be updated by the useEffect
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              placeholder="Add details like specific rules, equipment to bring, skill level, etc."
              className="input-field"
              {...register('description')}
            ></textarea>
          </div>

          {/* Status - hidden field, always set to true */}
          <input
            type="hidden"
            id="status"
            value="true"
            {...register('status')}
          />

          {/* Self Enrollment (only for new games) */}
          {!isEdit && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="selfEnroll"
                className="h-4 w-4 text-primary focus:ring-primary rounded"
                checked={selfEnroll}
                onChange={(e) => setSelfEnroll(e.target.checked)}
              />
              <label htmlFor="selfEnroll" className="ml-2 block text-sm text-gray-700">
                Enroll yourself in this game
              </label>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isEdit ? 'Update Game' : 'Create Game'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateGamePage;