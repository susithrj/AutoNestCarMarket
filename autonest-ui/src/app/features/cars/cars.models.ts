export type FuelType = 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
export type Transmission = 'MANUAL' | 'AUTOMATIC';
export type ListingStatus = 'AVAILABLE' | 'SOLD' | 'RESERVED';

export interface CarImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
}

export interface CarListItem {
  id: number;
  title: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: FuelType;
  transmission: Transmission;
  location: string;
  negotiable: boolean;
  status: ListingStatus;
  finalPrice: number;
  primaryImageUrl?: string | null;
  deletedAt?: string | null;
}

export interface CarDetail extends CarListItem {
  description?: string | null;
  basePrice: number;
  additionalCharges: number;
  discountAmount: number;
  images: CarImage[];
  contactPhone?: string | null;
  contactEmail?: string | null;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // 0-indexed
  size: number;
}

