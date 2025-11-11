export interface Property {
  id: string;
  lat: number;
  lng: number;
  price: number;
  photo: string;
  type: 'apartment' | 'house' ;
  title: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  description: string;
}

export interface PropertyFilters {
  priceRange: [number, number];
  propertyTypes: string[];
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}