'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Property, PropertyFilters, MapBounds } from '@/types/property';
import { PropertyCard } from './PropertyCard';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface PropertyMapProps {
  properties: Property[];
  filters: PropertyFilters;
  onBoundsChange: (bounds: MapBounds) => void;
  selectedProperty: Property | null;
  onPropertySelect: (property: Property | null) => void;
}

function MapEventHandler({ onBoundsChange }: { onBoundsChange: (bounds: MapBounds) => void }) {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      onBoundsChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    },
  });

  return null;
}

export function PropertyMap({ 
  properties, 
  filters, 
  onBoundsChange, 
  selectedProperty, 
  onPropertySelect 
}: PropertyMapProps) {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);

  useEffect(() => {
    const filtered = properties.filter(property => {
      const priceInRange = property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1];
      const typeMatch = filters.propertyTypes.length === 0 || filters.propertyTypes.includes(property.type);
      return priceInRange && typeMatch;
    });
    setFilteredProperties(filtered);
  }, [properties, filters]);

  const createCustomIcon = (property: Property) => {
    const isSelected = selectedProperty?.id === property.id;
    return L.divIcon({
      html: `
        <div class="relative">
          <div class="w-8 h-8 rounded-full ${isSelected ? 'bg-blue-600' : 'bg-red-500'} border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold transform ${isSelected ? 'scale-125' : 'hover:scale-110'} transition-transform">
            $${Math.round(property.price / 1000)}k
          </div>
        </div>
      `,
      className: 'custom-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  return (
    <MapContainer
      center={[40.7589, -73.9851]}
      zoom={13}
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEventHandler onBoundsChange={onBoundsChange} />
      {filteredProperties.map((property) => (
        <Marker
          key={property.id}
          position={[property.lat, property.lng]}
          icon={createCustomIcon(property)}
          eventHandlers={{
            click: () => onPropertySelect(property),
          }}
        >
          <Popup>
            <PropertyCard property={property} isPopup />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}