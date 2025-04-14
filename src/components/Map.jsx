import { useEffect, useState } from 'react';
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

  // Handle map click for location selection
  const handleMapClick = (e) => {
    if (selectable && map) {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lon: lng });
    }
  };

  useEffect(() => {
    // Clean up on unmount
    return () => {
      map && map.remove();
    };
  }, [map]);

  return (
    <div className="rounded-xl overflow-hidden shadow-md h-96">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        whenCreated={setMap}
        onClick={handleMapClick}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Display selected location if selectable */}
        {selectable && selectedLocation && (
          <Marker 
            position={[selectedLocation.lat, selectedLocation.lon]}
            icon={L.divIcon({
              className: 'selected-marker',
              html: '<div class="w-6 h-6 bg-primary rounded-full border-2 border-white shadow-md"></div>',
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })}
          >
            <Popup>Selected Location</Popup>
          </Marker>
        )}

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
      </MapContainer>
    </div>
  );
};

export default Map;