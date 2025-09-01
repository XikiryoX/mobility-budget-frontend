import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {
  private apiUrl = environment.backendUrl;

  constructor(private http: HttpClient) {}

  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/vehicles/brands`);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/vehicles/stats`);
  }

  getTcoDistribution(yearlyKm?: number, duration?: number, brands?: string[], fuelTypes?: string[], minTco?: number, maxTco?: number): Observable<any[]> {
    const params: any = {};
    if (yearlyKm) params.yearlyKm = yearlyKm.toString();
    if (duration) params.duration = duration.toString();
    if (brands && brands.length > 0) params.brands = brands.join(',');
    if (fuelTypes && fuelTypes.length > 0) params.fuelTypes = fuelTypes.join(',');
    if (minTco) params.minTco = minTco.toString();
    if (maxTco) params.maxTco = maxTco.toString();
    return this.http.get<any[]>(`${this.apiUrl}/vehicles/tco-distribution`, { params });
  }

  getAvailableFilters(yearlyKm?: number, duration?: number, brands?: string[], fuelTypes?: string[]): Observable<any> {
    const params: any = {};
    if (yearlyKm) params.yearlyKm = yearlyKm.toString();
    if (duration) params.duration = duration.toString();
    if (brands && brands.length > 0) params.brands = brands.join(',');
    if (fuelTypes && fuelTypes.length > 0) params.fuelTypes = fuelTypes.join(',');
    return this.http.get<any>(`${this.apiUrl}/vehicles/available-filters`, { params });
  }

  getReferenceCars(page: number = 1, limit: number = 10, filters?: any): Observable<any> {
    const params: any = {
      page: page.toString(),
      limit: limit.toString()
    };
    
    if (filters?.yearlyKm) params.yearlyKm = filters.yearlyKm.toString();
    if (filters?.duration) params.duration = filters.duration.toString();
    if (filters?.brands && filters.brands.length > 0) params.brands = filters.brands.join(',');
    if (filters?.fuelTypes && filters.fuelTypes.length > 0) params.fuelTypes = filters.fuelTypes.join(',');
    if (filters?.minTco !== undefined) params.minTco = filters.minTco.toString();
    if (filters?.maxTco !== undefined) params.maxTco = filters.maxTco.toString();
    
    return this.http.get<any>(`${this.apiUrl}/vehicles/reference-cars`, { params });
  }

  calculateVehicleTCO(data: {
    vehicleId: number;
    yearlyKm: number;
    duration: number;
    additionalCosts?: any[];
    monthlyAdjustments?: any[];
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/vehicles/calculate-tco`, data);
  }
}
