import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { properties } from '@/data/properties';
import { PropertyDetailPage } from '@/components/PropertyDetailPage';

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return properties.map((property) => ({
    id: property.id,
  }));
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = properties.find(p => p.id === id);

  if (!property) {
    return {
      title: 'Property Not Found',
    };
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return {
    title: `${property.title} - ${formatPrice(property.price)}`,
    description: property.description,
    openGraph: {
      title: property.title,
      description: property.description,
      images: [
        {
          url: property.photo,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      type: 'website',
      siteName: 'Property Map',
    },
    twitter: {
      card: 'summary_large_image',
      title: property.title,
      description: property.description,
      images: [property.photo],
    },
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const property = properties.find(p => p.id === id);

  if (!property) {
    notFound();
  }

  return <PropertyDetailPage property={property} />;
}