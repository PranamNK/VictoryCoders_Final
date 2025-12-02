                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      import { useEffect, useState, useCallback, useMemo } from 'react';
import { Locate } from 'lucide-react';
import { Temple } from '@/data/temples';
import { Button } from './ui/button';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './MapView.module.css';

interface MapViewProps {
  temples: Temple[];
  selectedTemple: Temple | null;
  onTempleSelect: (temple: Temple) => void;
}

// Custom hook to fly to a location
function FlyToLocation({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo({ lat: coords[1], lng: coords[0] }, 13, { duration: 1 });
  }, [coords, map]);
  return null;
}

const MapView = ({ temples, selectedTemple, onTempleSelect }: MapViewProps) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Generate marker coordinates from temple location - memoized
  const getTempleCoords = useCallback((temple: Temple): [number, number] => {
    const baseCoords: Record<string, [number, number]> = {
      Mangalore: [74.856, 12.9141],
      Udupi: [74.7421, 13.3409],
      Kundapura: [74.6897, 13.6281],
    };

    const base = baseCoords[temple.region] || [74.856, 13.0827];
    const offset = (parseInt(temple.id.slice(-2), 36) / 1000);
    return [base[0] + (offset - 0.05), base[1] + (offset - 0.05)];
  }, []);

  // Custom marker icon - memoized
  const getMarkerIcon = useCallback((isSelected: boolean) => {
    return L.divIcon({
      className: styles.customMarker,
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${
          isSelected ? "hsl(31 92% 45%)" : "hsl(27 96% 61%)"
        }" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: scale(${isSelected ? 1.25 : 1}); transition: transform 0.2s;">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  }, []);

  const handleLocateMe = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={[13.0827, 74.856]}
        zoom={9}
        className={styles.map}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />
        
        {temples.map((temple) => {
          const coords = getTempleCoords(temple);
          const isSelected = selectedTemple?.id === temple.id;
          return (
            <Marker
              key={temple.id}
              position={[coords[1], coords[0]]}
              icon={getMarkerIcon(isSelected)}
              eventHandlers={{
                click: () => onTempleSelect(temple),
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold text-foreground">{temple.name}</p>
                  <p className="text-xs text-muted-foreground">{temple.location}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: styles.userLocation,
              html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" style="animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>',
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            })}
          />
        )}

        {selectedTemple && (
          <FlyToLocation coords={getTempleCoords(selectedTemple)} />
        )}
      </MapContainer>

      <Button
        onClick={handleLocateMe}
        className="absolute bottom-4 left-4 z-[1000] bg-card text-foreground hover:bg-card/90 shadow-lg"
        size="icon"
        aria-label="Locate me"
      >
        <Locate className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MapView;
