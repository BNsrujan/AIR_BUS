'use client';

import { Property, MapBounds } from '@/types/property';
import { PropertyCard } from '@/components/PropertyCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface PropertyListProps {
  properties: Property[];
  mapBounds: MapBounds | null;
  onPropertyClick: (property: Property) => void;
}

export function PropertyList({ properties, mapBounds, onPropertyClick }: PropertyListProps) {
  const visibleProperties = mapBounds 
    ? properties.filter(property => 
        property.lat >= mapBounds.south &&
        property.lat <= mapBounds.north &&
        property.lng >= mapBounds.west &&
        property.lng <= mapBounds.east
      )
    : properties;

  return (
    <Card className="h-full ">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Properties</CardTitle>
          <Badge variant="secondary">
            {visibleProperties.length} visible
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4 p-4">
            {visibleProperties.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No properties found in current view
              </div>
            ) : (
              visibleProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={() => onPropertyClick(property)}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}