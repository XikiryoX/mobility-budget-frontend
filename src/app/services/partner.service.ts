import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Partner {
  id: string;
  name: string;
  email: string;
  socialSecretaryCode: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private apiUrl = environment.backendUrl;

  constructor(private http: HttpClient) {}

  /**
   * Authenticate a partner by email
   */
  authenticate(email: string): Observable<Partner> {
    return this.http.get<Partner>(`${this.apiUrl}/partners/authenticate/${email}`);
  }

  /**
   * Get partner by ID
   */
  findOne(id: string): Observable<Partner> {
    return this.http.get<Partner>(`${this.apiUrl}/partners/${id}`);
  }

  /**
   * Get all partners
   */
  findAll(): Observable<Partner[]> {
    return this.http.get<Partner[]>(`${this.apiUrl}/partners`);
  }

  /**
   * Check if current user is a partner
   */
  isPartner(): boolean {
    return localStorage.getItem('isPartner') === 'true';
  }

  /**
   * Get current partner info from localStorage
   */
  getCurrentPartner(): { id: string; name: string; email: string } | null {
    if (!this.isPartner()) {
      return null;
    }

    return {
      id: localStorage.getItem('partnerId') || '',
      name: localStorage.getItem('partnerName') || '',
      email: localStorage.getItem('userEmail') || ''
    };
  }

  /**
   * Logout partner
   */
  logout(): void {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('partnerId');
    localStorage.removeItem('partnerName');
    localStorage.removeItem('partnerCode');
    localStorage.removeItem('isPartner');
  }
}
