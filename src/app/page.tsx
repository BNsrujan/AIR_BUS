'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { properties } from '@/data/properties';
import { Property, PropertyFilters, MapBounds } from '@/types/property';
import { PropertyFilters as PropertyFiltersComponent } from '@/components/PropertyFilters';
import { PropertyList } from '@/components/PropertyList';
import { useViewedProperties } from '@/hooks/useViewedProperties';

// Dynamically import the map to avoid SSR issues
const PropertyMap = dynamic(() => import('@/components/PropertyMap').then(mod => ({ default: mod.PropertyMap })), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg" />
});

export default function Home() {
  const [filters, setFilters] = useState<PropertyFilters>({
    priceRange: [0, 2000000],
    propertyTypes: []
  });
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { addViewedProperty, getViewedProperties } = useViewedProperties();

  const minPrice = Math.min(...properties.map(p => p.price));
  const maxPrice = Math.max(...properties.map(p => p.price));

  // Initialize filters with min/max price range
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (!isInitialized && minPrice !== Infinity && maxPrice !== -Infinity) {
      setFilters(prev => ({
        ...prev,
        priceRange: [minPrice, maxPrice]
      }));
      setIsInitialized(true);
    }
  }, [minPrice, maxPrice, isInitialized]);

  const filteredProperties = properties.filter(property => {
    const priceInRange = property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1];
    const typeMatch = filters.propertyTypes.length === 0 || filters.propertyTypes.includes(property.type);
    return priceInRange && typeMatch;
  });

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    addViewedProperty(property.id);
  };

  const viewedProperties = getViewedProperties(properties);

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-9xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Property Map</h1>
          <p className="text-gray-600">Find your perfect property</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar - responsive */}
        <div className="w-full lg:w-[450px] bg-white border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col max-h-96 lg:max-h-none ">
          <div className="p-4 border-b border-gray-200">
            <PropertyFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
          </div>
          
          <div className="flex-1 overflow-hidden">
            <PropertyList
              properties={filteredProperties}
              mapBounds={mapBounds}
              onPropertyClick={handlePropertyClick}
            />
          </div>

          {viewedProperties.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <h3 className="font-medium text-sm text-gray-700 mb-2">Recently Viewed</h3>
              <div className="flex gap-2 overflow-x-auto">
                {viewedProperties.slice(0, 3).map(property => (
                  <div
                    key={property.id}
                    className="shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handlePropertyClick(property)}
                  >
                    <Image
                      src={property.photo}
                      alt={property.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="flex-1 min-h-96 lg:min-h-0">
          <PropertyMap
            properties={filteredProperties}
            filters={filters}
            onBoundsChange={setMapBounds}
            selectedProperty={selectedProperty}
            onPropertySelect={setSelectedProperty}
          />
        </div>
      </div>
    </div>
  );
}