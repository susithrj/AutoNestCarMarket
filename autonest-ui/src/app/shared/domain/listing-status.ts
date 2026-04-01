import { BadgeVariant } from '../components/badge/badge.component';
import { ListingStatus } from '../../features/cars/cars.models';

export function listingStatusLabel(status: ListingStatus): string {
  switch (status) {
    case 'AVAILABLE':
      return 'Available';
    case 'RESERVED':
      return 'Reserved';
    case 'SOLD':
      return 'Sold';
    default:
      return status;
  }
}

export function listingStatusVariant(status: ListingStatus): BadgeVariant {
  switch (status) {
    case 'AVAILABLE':
      return 'available';
    case 'RESERVED':
      return 'reserved';
    case 'SOLD':
      return 'sold';
    default:
      return 'info';
  }
}

