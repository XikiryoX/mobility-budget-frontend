import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ViesCompanyData {
  uid: string;
  countryCode: string;
  vatNumber: string;
  valid: boolean;
  traderName: string;
  traderCompanyType: string;
  traderAddress: string;
  id: string;
  date: string;
  source: string;
}

export interface ViesError {
  code: number;
  description: string;
  details?: string;
}

export interface ViesResponse {
  uid: string;
  countryCode: string;
  vatNumber: string;
  valid: boolean;
  traderName: string;
  traderCompanyType: string;
  traderAddress: string;
  id: string;
  date: string;
  source: string;
}

@Injectable({
  providedIn: 'root'
})
export class ViesService {
  // This service is deprecated - use ViesFreeService instead
  constructor(private http: HttpClient) {}

  /**
   * Lookup company information using VAT number
   * @param vatNumber - The VAT number to lookup (e.g., 'BE1234567890')
   * @returns Observable with company data or error
   */
  lookupCompany(vatNumber: string): Observable<ViesResponse> {
    throw new Error('ViesService is deprecated. Use ViesFreeService instead.');
  }

  /**
   * Format VAT number for API call
   * @param companyNumber - The company number from form
   * @returns Formatted VAT number
   */
  formatVatNumber(companyNumber: string): string {
    // Remove spaces and convert to uppercase
    let cleanNumber = companyNumber.replace(/\s/g, '').toUpperCase();
    
    // If it doesn't start with BE, add it
    if (!cleanNumber.startsWith('BE')) {
      cleanNumber = 'BE' + cleanNumber;
    }
    
    return cleanNumber;
  }

  /**
   * Validate if the response indicates a valid company
   * @param response - The VIES API response
   * @returns boolean indicating if company is valid
   */
  isCompanyValid(response: ViesResponse): boolean {
    return response.valid === true;
  }

  /**
   * Extract company information from VIES response
   * @param response - The VIES API response
   * @returns Formatted company information
   */
  extractCompanyInfo(response: ViesResponse): {
    name: string;
    address: string;
    vatNumber: string;
    isValid: boolean;
  } {
    return {
      name: response.traderName || '',
      address: response.traderAddress || '',
      vatNumber: response.vatNumber || '',
      isValid: response.valid || false
    };
  }
}
