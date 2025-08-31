'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Resource } from '@/lib/types';
import ResourcePopup from './ResourcePopup';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  resources: Resource[];
  searchLocation?: { lat: number; lng: number; name: string } | null;
}

const getMarkerIcon = (type: string) => {
  const colors = {
    Food: '#10B981',
    Shelter: '#3B82F6', 
    Health: '#EF4444',
    Blood: '#8B5CF6'
  };

  const color = colors[type as keyof typeof colors] || '#6B7280';
  
  return new L.DivIcon({
    html: `<div style="
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: ${color};
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    "></div>`,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

function MapUpdater({ resources, searchLocation }: { resources: Resource[]; searchLocation?: { lat: number; lng: number; name: string } | null }) {
  const map = useMap();

  useEffect(() => {
    if (searchLocation) {
      // Center map on searched location
      map.setView([searchLocation.lat, searchLocation.lng], 13);
    } else if (resources.length > 0 && resources.length <= 50) {
      // Fit bounds to all resources if no specific location is searched
      const group = new L.FeatureGroup(
        resources.map(resource => 
          L.marker([resource.latitude, resource.longitude])
        )
      );
      map.fitBounds(group.getBounds(), { padding: [20, 20] });
    }
  }, [resources, searchLocation, map]);

  return null;
}

export default function Map({ resources, searchLocation }: MapProps) {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>([40.7128, -74.006]); // NYC default
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Get user's location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  // Use search location or user location as initial center
  const mapCenter = searchLocation ? [searchLocation.lat, searchLocation.lng] as [number, number] : userLocation;

  return (
    <div className="relative w-full h-full">
      {/* Loading indicator when map is not loaded */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      
      <MapContainer
        center={mapCenter}
        zoom={searchLocation ? 13 : 11}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        whenReady={() => setMapLoaded(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Tiles &copy; <a href="https://locationiq.com/">LocationIQ</a>'
          url={`https://tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN}`}
          eventHandlers={{
            loading: () => setMapLoaded(false),
            load: () => setMapLoaded(true),
          }}
        />
        
        <MapUpdater resources={resources} searchLocation={searchLocation} />
        
        {/* Add a marker for searched location - only show when map is loaded */}
        {mapLoaded && searchLocation && (
          <Marker
            position={[searchLocation.lat, searchLocation.lng]}
            icon={new L.DivIcon({
              html: `<div style="
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: #EF4444;
                border: 4px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <div style="
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  background-color: white;
                "></div>
              </div>`,
              className: 'search-location-marker',
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            })}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm">{searchLocation.name}</h3>
                <p className="text-xs text-gray-600">Searched Location</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Only show resource markers when map is loaded */}
        {mapLoaded && resources.map((resource) => (
          <Marker
            key={resource.id}
            position={[resource.latitude, resource.longitude]}
            icon={getMarkerIcon(resource.type)}
            eventHandlers={{
              click: () => setSelectedResource(resource),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm">{resource.name}</h3>
                <p className="text-xs text-gray-600 mb-1">{resource.type}</p>
                <p className="text-xs">{resource.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {selectedResource && (
        <ResourcePopup
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-10">
        <h3 className="text-sm font-semibold mb-2">Resource Types</h3>
        <div className="space-y-2 text-xs">
          {[
            { type: 'Food', color: '#10B981' },
            { type: 'Shelter', color: '#3B82F6' },
            { type: 'Health', color: '#EF4444' },
            { type: 'Blood', color: '#8B5CF6' },
          ].map(({ type, color }) => (
            <div key={type} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full border border-white"
                style={{ backgroundColor: color }}
              />
              <span>{type}</span>
            </div>
          ))}
        </div>
        {!mapLoaded && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">Resources loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}