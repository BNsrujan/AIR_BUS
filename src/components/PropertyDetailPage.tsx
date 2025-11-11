'use client';

import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bed, Bath, Square, MapPin, Heart, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useViewedProperties } from '@/hooks/useViewedProperties';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('@/components/PropertyMap').then(mod => ({ default: mod.PropertyMap })), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-100 animate-pulse rounded-lg" />
});

interface PropertyDetailPageProps {
  property: Property;
}

export function PropertyDetailPage({ property }: PropertyDetailPageProps) {
  const { addViewedProperty } = useViewedProperties();

  useEffect(() => {
    addViewedProperty(property.id);
  }, [property.id, addViewedProperty]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Map
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative h-96 rounded-lg overflow-hidden"
            >
              <Image
                src={property.photo}
                alt={property.title}
                fill
                className="object-cover"
                priority
              />
              <Badge className="absolute top-4 right-4 bg-white text-black">
                {property.type}
              </Badge>
            </motion.div>

            {/* Property Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {property.title}
                      </h1>
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span className="text-lg">{property.address}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">
                        {formatPrice(property.price)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 py-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Bed className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="text-2xl font-semibold">{property.bedrooms}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Bath className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="text-2xl font-semibold">{property.bathrooms}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Square className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="text-2xl font-semibold">{property.sqft}</div>
                      <div className="text-sm text-gray-600">Sq Ft</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {property.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Agent</h3>
                  <div className="space-y-3">
                    <Button className="w-full">Schedule Tour</Button>
                    <Button variant="outline" className="w-full">
                      Request Info
                    </Button>
                    <Button variant="outline" className="w-full">
                      Call Agent
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Location</h3>
                  <div className="h-64 rounded-lg overflow-hidden">
                    <PropertyMap
                      properties={[property]}
                      filters={{ priceRange: [0, 10000000], propertyTypes: [] }}
                      onBoundsChange={() => {}}
                      selectedProperty={property}
                      onPropertySelect={() => {}}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}