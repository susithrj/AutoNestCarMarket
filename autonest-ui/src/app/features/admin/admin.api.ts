import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CarDetail, CarListItem } from '../cars/cars.models';

export interface CarRequest {
  title: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  basePrice: number;
  additionalCharges: number;
  discountAmount: number;
  negotiable: boolean;
  location: string;
  contactPhone: string;
  contactEmail: string;
  description?: string | null;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class AdminApi {
  private readonly http = inject(HttpClient);

  async listAll(): Promise<CarListItem[]> {
    return await firstValueFrom(this.http.get<CarListItem[]>('/api/admin/cars'));
  }

  async get(id: number): Promise<CarDetail> {
    return await firstValueFrom(this.http.get<CarDetail>(`/api/admin/cars/${id}`));
  }

  async create(req: CarRequest): Promise<CarDetail> {
    return await firstValueFrom(this.http.post<CarDetail>('/api/admin/cars', req));
  }

  async update(id: number, req: CarRequest): Promise<CarDetail> {
    return await firstValueFrom(this.http.put<CarDetail>(`/api/admin/cars/${id}`, req));
  }

  async softDelete(id: number): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`/api/admin/cars/${id}`));
  }

  async restore(id: number): Promise<void> {
    await firstValueFrom(this.http.post<void>(`/api/admin/cars/${id}/restore`, {}));
  }

  async addImageUrls(carId: number, urls: string[]): Promise<any> {
    return await firstValueFrom(this.http.post(`/api/admin/cars/${carId}/images/urls`, { urls }));
  }

  async deleteImage(carId: number, imageId: number): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`/api/admin/cars/${carId}/images/${imageId}`));
  }
}

