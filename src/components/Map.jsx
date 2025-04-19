import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getSportLabel } from '../utils/helpers';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Create custom markers for different sports
const createSportIcon = (sport) => {
  const sportColors = {
    CRICKET: '#10b981', // Green
    FOOTBALL: '#3b82f6', // Blue
    VOLLEYBALL: '#f59e0b', // Yellow
    TENNIS: '#ef4444', // Red
    BADMINTON: '#8b5cf6', // Purple
  };

  const color = sportColors[sport] || '#6b7280'; // Gray default

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Component to set map view when center changes
const ChangeMapView = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, map, zoom]);
  
  return null;
};

// Component to handle map interactions (clicks and draggable marker)
const MapInteractionHandler = ({ onLocationSelect, selectedLocation }) => {
  const map = useMap();
  const markerRef = useRef(null);
  
  // Initialize or update marker when selectedLocation changes
  useEffect(() => {
    // Safety check
    if (!map) return;
    
    // Clean up function to properly remove marker
    const cleanupMarker = () => {
      try {
        if (markerRef.current && map) {
          map.removeLayer(markerRef.current);
          markerRef.current = null;
        }
      } catch (error) {
        console.error('Error removing marker:', error);
        // Reset reference even if removal fails
        markerRef.current = null;
      }
    };
    
    try {
      // First, remove any existing marker
      cleanupMarker();
      
      // If we have a selected location, create a draggable marker
      if (selectedLocation && selectedLocation.lat && selectedLocation.lon) {
        // Create new marker with default icon (the original pin)
        const newMarker = L.marker([selectedLocation.lat, selectedLocation.lon], {
          draggable: true,
          zIndexOffset: 1000 // Make sure selection marker is above game markers
        }).addTo(map);
        
        // Handle marker drag end - update coordinates
        newMarker.on('dragend', () => {
          try {
            const position = newMarker.getLatLng();
            onLocationSelect({ lat: position.lat, lon: position.lng });
          } catch (error) {
            console.error('Error handling marker drag:', error);
          }
        });
        
        // Store marker in ref instead of state to avoid re-renders
        markerRef.current = newMarker;
      }
    } catch (error) {
      console.error('Error setting up marker:', error);
    }
    
    // Return cleanup function for when component unmounts or effect runs again
    return cleanupMarker;
  }, [map, selectedLocation, onLocationSelect]);
  
  // Set up map click handler to place marker
  useEffect(() => {
    if (!map) return;
    
    const handleMapClick = (e) => {
      try {
        const { lat, lng } = e.latlng;
        onLocationSelect({ lat, lon: lng });
      } catch (error) {
        console.error('Error handling map click:', error);
      }
    };
    
    try {
      map.on('click', handleMapClick);
      
      return () => {
        try {
          map.off('click', handleMapClick);
        } catch (error) {
          console.error('Error removing map click handler:', error);
        }
      };
    } catch (error) {
      console.error('Error setting up map click handler:', error);
      return () => {};
    }
  }, [map, onLocationSelect]);
  
  return null;
};

// Main Map component
const Map = ({ 
  center = [20.5937, 78.9629], // Default to center of India
  zoom = 5,
  games = [],
  selectable = false,
  onLocationSelect = () => {},
  selectedLocation = null
}) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Clean up on unmount
    return () => {
      map && map.remove();
    };
  }, [map]);

  // If user's location was provided, use it as center
  useEffect(() => {
    if (map && selectable && !selectedLocation) {
      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 15);
            onLocationSelect({ lat: latitude, lon: longitude });
          },
          (error) => {
            console.error("Error getting location:", error);
            // Keep default center of India
          }
        );
      }
    }
  }, [map, selectable, onLocationSelect, selectedLocation]);

  return (
    <div className="rounded-xl overflow-hidden shadow-md h-96" style={{ position: 'relative', zIndex: 10 }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        whenCreated={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Display games markers */}
        {games.map((game) => (
          <Marker
            key={game.id}
            position={[game.coordinates.lat, game.coordinates.lon]}
            icon={createSportIcon(game.sport)}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-semibold text-base mb-1">{getSportLabel(game.sport)}</h3>
                <p>{game.location}</p>
                <p>Team Size: {game.teamSize}</p>
                <p>Players: {game.enrolledPlayers} enrolled</p>
                <div className="mt-2">
                  <a 
                    href={`/game/${game.id}`} 
                    className="text-primary hover:underline"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <ChangeMapView center={center} zoom={zoom} />
        {selectable && <MapInteractionHandler 
          onLocationSelect={onLocationSelect}
          selectedLocation={selectedLocation}
        />}
      </MapContainer>
    </div>
  );
};

export default Map;