'use client';

import { useSessionStorage } from './useSessionStorage';
import { Property } from '@/types/property';

export function useViewedProperties() {
  const [viewedProperties, setViewedProperties] = useSessionStorage<string[]>('viewedProperties', []);

  const addViewedProperty = (propertyId: string) => {
    setViewedProperties(prev => {
      const filtered = prev.filter(id => id !== propertyId);
      return [propertyId, ...filtered].slice(0, 10); // Keep only last 10 viewed
    });
  };

  const getViewedProperties = (allProperties: Property[]) => {
    return viewedProperties
      .map(id => allProperties.find(p => p.id === id))
      .filter(Boolean) as Property[];
  };

  return {
    viewedProperties,
    addViewedProperty,
    getViewedProperties
  };
}