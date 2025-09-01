import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ViesResponse } from './vies.service';

// Re-export the ViesResponse interface for components to use
export type { ViesResponse } from './vies.service';

@Injectable({
  providedIn: 'root'
})
export class ViesMockService {
  
  // Mock company database for testing
  private mockCompanies: { [key: string]: ViesResponse } = {
    'BE0123456789': {
      uid: 'test-uid-1',
      countryCode: 'BE',
      vatNumber: 'BE0123456789',
      valid: true,
      traderName: 'Monizze NV',
      traderCompanyType: 'LIMITED_LIABILITY_COMPANY',
      traderAddress: 'Rue de la Loi 200, 1040 Brussels, Belgium',
      id: 'test-consultation-1',
      date: new Date().toISOString(),
      source: 'http://ec.europa.eu'
    },
    'BE1234567890': {
      uid: 'test-uid-2',
      countryCode: 'BE',
      vatNumber: 'BE1234567890',
      valid: true,
      traderName: 'Test Company BVBA',
      traderCompanyType: 'LIMITED_LIABILITY_COMPANY',
      traderAddress: 'Avenue Louise 500, 1050 Brussels, Belgium',
      id: 'test-consultation-2',
      date: new Date().toISOString(),
      source: 'http://ec.europa.eu'
    },
    'BE9876543210': {
      uid: 'test-uid-3',
      countryCode: 'BE',
      vatNumber: 'BE9876543210',
      valid: true,
      traderName: 'Sample Enterprise SA',
      traderCompanyType: 'JOINT_STOCK_COMPANY',
      traderAddress: 'Boulevard du Souverain 100, 1170 Brussels, Belgium',
      id: 'test-consultation-3',
      date: new Date().toISOString(),
      source: 'http://ec.europa.eu'
    }
  };

  /**
   * Mock company lookup - simulates API call with delay
   * @param vatNumber - The VAT number to lookup
   * @returns Observable with mock company data
   */
  lookupCompany(vatNumber: string): Observable<ViesResponse> {
    // Simulate network delay
    return of(this.getMockCompany(vatNumber)).pipe(delay(1000));
  }

  /**
   * Get mock company data
   * @param vatNumber - The VAT number
   * @returns Mock company data or invalid response
   */
  private getMockCompany(vatNumber: string): ViesResponse {
    const cleanVatNumber = vatNumber.toUpperCase();
    
    if (this.mockCompanies[cleanVatNumber]) {
      return this.mockCompanies[cleanVatNumber];
    }
    
    // Special handling for BE0649528331 - this is for production testing
    if (cleanVatNumber === 'BE0649528331') {
      return {
        uid: 'test-uid-production',
        countryCode: 'BE',
        vatNumber: cleanVatNumber,
        valid: false,
        traderName: 'Production Test - Use Real VIES API',
        traderCompanyType: 'PRODUCTION_TEST',
        traderAddress: 'This VAT number is reserved for production testing with real EU VIES API',
        id: 'test-consultation-production',
        date: new Date().toISOString(),
        source: 'http://ec.europa.eu'
      };
    }
    
    // Return invalid company for unknown VAT numbers
    return {
      uid: 'test-uid-invalid',
      countryCode: 'BE',
      vatNumber: cleanVatNumber,
      valid: false,
      traderName: '',
      traderCompanyType: '',
      traderAddress: '',
      id: 'test-consultation-invalid',
      date: new Date().toISOString(),
      source: 'http://ec.europa.eu'
    };
  }

  /**
   * Format VAT number for consistency
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
   * @param response - The mock response
   * @returns boolean indicating if company is valid
   */
  isCompanyValid(response: ViesResponse): boolean {
    return response.valid === true;
  }

  /**
   * Extract company information from mock response
   * @param response - The mock response
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
