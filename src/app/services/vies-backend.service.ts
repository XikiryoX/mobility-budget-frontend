import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ViesResponse } from './vies.service';

@Injectable({
  providedIn: 'root'
})
export class ViesBackendService {
  private readonly apiUrl = environment.backendUrl;

  constructor(private http: HttpClient) {}

  /**
   * Lookup company information using VAT number via backend proxy
   * @param vatNumber - The VAT number to lookup (e.g., 'BE1234567890')
   * @returns Observable with company data or error
   */
  lookupCompany(vatNumber: string): Observable<ViesResponse> {
    const url = `${this.apiUrl}/vies/lookup?vatNumber=${encodeURIComponent(vatNumber)}`;
    
    return this.http.get<{ success: boolean; data: ViesResponse }>(url).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error('Invalid response from backend');
        }
      }),
      catchError(error => {
        console.error('Backend VIES API error:', error);
        
        if (error.status === 400) {
          // Backend validation error
          return throwError(() => new Error('Invalid VAT number format'));
        } else if (error.status === 500) {
          // Backend server error
          return throwError(() => new Error('Backend service unavailable'));
        } else {
          // Network or other error
          return throwError(() => new Error('Failed to connect to backend'));
        }
      })
    );
  }

  /**
   * Format VAT number for API call
   * @param companyNumber - The company number from form
   * @returns Formatted VAT number
   */
  formatVatNumber(companyNumber: string): string {
    let cleanNumber = companyNumber.replace(/\s/g, '').toUpperCase();
    
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
