import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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

export interface ViesXmlResponse {
  'soap:Envelope': {
    'soap:Body': [{
      'checkVatResponse': [{
        countryCode: [string];
        vatNumber: [string];
        requestDate: [string];
        valid: [string];
        traderName?: [string];
        traderAddress?: [string];
        traderCompanyType?: [string];
        requestIdentifier?: [string];
      }];
    }];
  };
}

@Injectable({
  providedIn: 'root'
})
export class ViesFreeService {
  private readonly viesUrl = 'https://ec.europa.eu/taxation_customs/vies/services/checkVatService';

  constructor(private http: HttpClient) {}

  /**
   * Lookup company information using the free EU VIES API
   * @param vatNumber - The VAT number to lookup (e.g., 'BE1234567890')
   * @returns Observable with company data
   */
  lookupCompany(vatNumber: string): Observable<ViesResponse> {
    const countryCode = vatNumber.substring(0, 2);
    const number = vatNumber.substring(2);
    
    console.log('VIES API call:', { countryCode, number, fullVatNumber: vatNumber });
    
    const soapEnvelope = this.createSoapEnvelope(countryCode, number);
    
    return this.http.post(this.viesUrl, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': ''
      },
      responseType: 'text'
    }).pipe(
      map(response => {
        console.log('VIES API raw response:', response);
        return this.parseViesResponse(response as string, vatNumber);
      }),
      catchError(error => {
        console.error('VIES API error details:', error);
        console.error('VIES API error status:', error.status);
        console.error('VIES API error message:', error.message);
        return throwError(() => new Error(`VIES API error: ${error.message || 'Unknown error'}`));
      })
    );
  }

  /**
   * Create SOAP envelope for VIES API request
   */
  private createSoapEnvelope(countryCode: string, vatNumber: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <checkVat xmlns="urn:ec.europa.eu:taxud:vies:services:checkVat:types">
      <countryCode>${countryCode}</countryCode>
      <vatNumber>${vatNumber}</vatNumber>
    </checkVat>
  </soap:Body>
</soap:Envelope>`;
  }

  /**
   * Parse VIES XML response
   */
  private parseViesResponse(xmlResponse: string, originalVatNumber: string): ViesResponse {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlResponse, 'text/xml');
    
    // Check for SOAP fault
    const fault = xmlDoc.getElementsByTagName('env:Fault')[0] || xmlDoc.getElementsByTagName('soap:Fault')[0];
    if (fault) {
      throw new Error('VIES service error');
    }

    // Try different response formats
    let response = xmlDoc.getElementsByTagName('ns2:checkVatResponse')[0];
    if (!response) {
      response = xmlDoc.getElementsByTagName('checkVatResponse')[0];
    }
    if (!response) {
      throw new Error('Invalid VIES response');
    }

    const countryCode = this.getTextContent(response, 'ns2:countryCode') || this.getTextContent(response, 'countryCode');
    const vatNumber = this.getTextContent(response, 'ns2:vatNumber') || this.getTextContent(response, 'vatNumber');
    const requestDate = this.getTextContent(response, 'ns2:requestDate') || this.getTextContent(response, 'requestDate');
    const valid = (this.getTextContent(response, 'ns2:valid') || this.getTextContent(response, 'valid')) === 'true';
    const traderName = this.getTextContent(response, 'ns2:name') || this.getTextContent(response, 'traderName') || '';
    const traderAddress = this.getTextContent(response, 'ns2:address') || this.getTextContent(response, 'traderAddress') || '';
    const traderCompanyType = this.getTextContent(response, 'ns2:companyType') || this.getTextContent(response, 'traderCompanyType') || '';
    const requestIdentifier = this.getTextContent(response, 'ns2:requestIdentifier') || this.getTextContent(response, 'requestIdentifier') || '';

    return {
      uid: requestIdentifier,
      countryCode: countryCode,
      vatNumber: originalVatNumber,
      valid: valid,
      traderName: traderName,
      traderCompanyType: traderCompanyType,
      traderAddress: traderAddress,
      id: requestIdentifier,
      date: requestDate,
      source: 'http://ec.europa.eu'
    };
  }

  /**
   * Get text content from XML element
   */
  private getTextContent(parent: Element, tagName: string): string {
    const element = parent.getElementsByTagName(tagName)[0];
    return element ? element.textContent || '' : '';
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
