'use client';

import { useState } from 'react';

import { properties } from '@/data/properties';
import {  PropertyFilters } from '@/types/property';
import { PropertyFilters as PropertyFiltersComponent } from '@/components/PropertyFilters';



export default function Home() {
  const [filters, setFilters] = useState<PropertyFilters>({
    priceRange: [0, 2000000],
    propertyTypes: []
  });

  const minPrice = Math.min(...properties.map(p => p.price));
  const maxPrice = Math.max(...properties.map(p => p.price));
  



  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Property Map</h1>
          <p className="text-gray-600">Find your perfect property</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar - responsive */}
        <div className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col max-h-96 lg:max-h-none">
          <div className="p-4 border-b border-gray-200">
            <PropertyFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
          </div>

        </div>

       
      </div>
    </div>
  );
}