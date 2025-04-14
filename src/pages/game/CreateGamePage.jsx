import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Calendar, Clock, Users, Info, CheckCircle, Search } from 'lucide-react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import Map from '../../components/Map';
import { gameService } from '../../api';
import { SPORT_OPTIONS, getErrorMessage, formatDateForInput } from '../../utils/helpers';
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

  // Watch form values for validation
  const watchedValues = watch();

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
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      
      if (!response.ok) throw new Error('Failed to get location name');
      
      const data = await response.json();
      
      // Extract location name from response
      let name = data.display_name || '';
      
      // Try to get a shorter name if possible
      if (data.name) {
        name = data.name;
      } else if (data.address) {
        // Build a more readable name from address components
        const components = [];
        
        if (data.address.road) components.push(data.address.road);
        if (data.address.suburb) components.push(data.address.suburb);
        if (data.address.city) components.push(data.address.city);
        if (data.address.state) components.push(data.address.state);
        if (data.address.country) components.push(data.address.country);
        
        if (components.length > 0) {
          name = components.slice(0, 3).join(', ');
        }
      }
      
      return name;
    } catch (err) {
      console.error('Error reverse geocoding:', err);
      return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    } finally {
      setIsGeocodingLocation(false);
    }
  };

  // Handle location selection from map
  const handleLocationSelect = async (coords) => {
    setSelectedLocation(coords);
    setValue('coordinates', coords, { shouldValidate: true });
    
    // Get location name from coordinates
    try {
      const name = await reverseGeocode(coords.lat, coords.lon);
      setLocationName(name);
      setValue('location', name);
    } catch (err) {
      console.error('Error getting location name:', err);
      // Fallback to coordinates if geocoding fails
      const coordStr = `${coords.lat.toFixed(6)}, ${coords.lon.toFixed(6)}`;
      setLocationName(coordStr);
      setValue('location', coordStr);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError('');
      setSuccessMessage('');

      // Ensure seconds are appended to time strings
      const startTime = data.startTime.endsWith(':00') ? data.startTime : `${data.startTime}:00`;
      const endTime = data.endTime.endsWith(':00') ? data.endTime : `${data.endTime}:00`;

      // Prepare game data
      const gameData = {
        ...data,
        startTime,
        endTime,
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
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    id="location"
                    placeholder="Enter a location or select on the map"
                    className={`input-field pr-8 ${errors.location ? 'border-red-500' : ''}`}
                    {...register('location')}
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                  />
                  {isGeocodingLocation && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0 ml-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center"
                    onClick={() => {
                      // Try to get user's current location
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
                  >
                    <MapPin size={16} className="mr-1" /> Use My Location
                  </Button>
                </div>
              </div>
              
              {selectedLocation && (
                <div className="text-sm text-gray-600 flex items-center">
                  <MapPin size={14} className="mr-1 text-primary" />
                  Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lon.toFixed(6)}
                </div>
              )}
            </div>
            
            {errors.coordinates && (
              <p className="mt-1 text-sm text-red-500">
                {errors.coordinates.message}
              </p>
            )}
          </div>

          {/* Map for Location Selection */}
          <div className="border border-gray-200 rounded-xl overflow-hidden p-4 bg-gray-50">
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
              <input
                type="datetime-local"
                id="startTime"
                className={`input-field ${errors.startTime ? 'border-red-500' : ''}`}
                {...register('startTime', createGameValidationSchema.startTime)}
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-500">{errors.startTime.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="endTime"
                className={`input-field ${errors.endTime ? 'border-red-500' : ''}`}
                {...register('endTime', createGameValidationSchema.endTime)}
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-500">{errors.endTime.message}</p>
              )}
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

          {/* Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="status"
              className="h-4 w-4 text-primary focus:ring-primary rounded"
              {...register('status')}
            />
            <label htmlFor="status" className="ml-2 block text-sm text-gray-700">
              Game is active
            </label>
          </div>

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