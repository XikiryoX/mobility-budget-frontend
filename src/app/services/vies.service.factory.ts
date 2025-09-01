import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ViesMockService } from './vies-mock.service';
import { ViesBackendService } from './vies-backend.service';
import { ViesFreeService } from './vies-free.service';

export interface ViesServiceInterface {
  lookupCompany(vatNumber: string): any;
  formatVatNumber(companyNumber: string): string;
  isCompanyValid(response: any): boolean;
  extractCompanyInfo(response: any): {
    name: string;
    address: string;
    vatNumber: string;
    isValid: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ViesServiceFactory {
  
  constructor(private http: HttpClient) {}
  
  /**
   * Get the appropriate VIES service based on environment
   * @returns ViesServiceInterface implementation
   */
  getViesService(): ViesServiceInterface {
    // Use backend proxy to avoid CORS issues
    return new ViesBackendService(this.http);
  }

  /**
   * Get service name for debugging
   * @returns Service name string
   */
  getServiceName(): string {
    return 'ViesBackendService (Backend Proxy)';
  }
}
