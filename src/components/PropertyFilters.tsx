'use client';

import { useState } from 'react';
import { PropertyFilters as PropertyFiltersType } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PropertyFiltersProps {
  filters: PropertyFiltersType;
  onFiltersChange: (filters: PropertyFiltersType) => void;
  minPrice: number;
  maxPrice: number;
}

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
];

export function PropertyFilters({ 
  filters, 
  onFiltersChange, 
  minPrice, 
  maxPrice 
}: PropertyFiltersProps) {
  const [localPriceRange, setLocalPriceRange] = useState(filters.priceRange);

  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange([value[0], value[1]]);
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]]
    });
  };

  const togglePropertyType = (type: string) => {
    const newTypes = filters.propertyTypes.includes(type)
      ? filters.propertyTypes.filter(t => t !== type)
      : [...filters.propertyTypes, type];
    
    onFiltersChange({
      ...filters,
      propertyTypes: newTypes
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      priceRange: [minPrice, maxPrice],
      propertyTypes: []
    });
    setLocalPriceRange([minPrice, maxPrice]);
  };


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Filters</CardTitle>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Price Range</h4>
          <div className="px-2">
            <Slider
              value={localPriceRange}
              onValueChange={handlePriceChange}
              max={maxPrice}
              min={minPrice}
              step={10000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{formatPrice(localPriceRange[0])}</span>
              <span>{formatPrice(localPriceRange[1])}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Property Type</h4>
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map((type) => (
              <Badge
                key={type.value}
                variant={filters.propertyTypes.includes(type.value) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => togglePropertyType(type.value)}
              >
                {type.label}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}