export interface CarsBrowseState {
  q: string;
  brand: string;
  model: string;
  price: string;
  year: string;
  fuelType: string;
  transmission: string;
  maxMileage: string;
  location: string;
  sort: string;
  page: number; // 0-indexed
  size: number;
}

