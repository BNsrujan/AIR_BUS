"use client";

import { Property } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Square, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface PropertyCardProps {
  property: Property;
  isPopup?: boolean;
  onClick?: () => void;
}

export function PropertyCard({
  property,
  isPopup = false,
  onClick,
}: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const CardWrapper = isPopup ? "div" : motion.div;
  const cardProps = isPopup
    ? {}
    : {
        whileHover: { scale: 1.02 },
        transition: { duration: 0.2 },
      };

  const content = (
    <Card
      className={`overflow-hidden cursor-pointer ${
        isPopup ? "w-64" : "w-full"
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <Image
          src={property.photo || "/image.jpg"}
          alt={property.title || "Property"}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-white text-black">
          {property.type}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate">{property.title}</h3>
          <span className="font-bold text-green-600 text-lg">
            {formatPrice(property.price)}
          </span>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm truncate">{property.address}</span>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{property.bathrooms} bath</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            <span>{property.sqft} sqft</span>
          </div>
        </div>

        {!isPopup && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {property.description}
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (isPopup) {
    return <Link href={`/property/${property.id}`}>{content}</Link>;
  }

  return (
    <CardWrapper {...cardProps}>
      <Link href={`/property/${property.id}`}>{content}</Link>
    </CardWrapper>
  );
}
