import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Signup {
  id: string;
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  socialSecretary: string;
  companyNumber: string;
  companyName?: string;
  companyAddress?: string;
  companyValidated: boolean;
  viesUid?: string;
  viesCountryCode?: string;
  viesCompanyType?: string;
  viesRequestDate?: Date;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}

export interface CreateSignupDto {
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  socialSecretary: string;
  companyNumber: string;
  companyName: string;
  companyAddress?: string;
  companyValidated?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private apiUrl = `${environment.backendUrl}/signup`;

  constructor(private http: HttpClient) {}

  /**
   * Create a new signup
   */
  create(signupData: CreateSignupDto): Observable<Signup> {
    console.log('SignupService: Creating signup with data:', signupData);
    return this.http.post<Signup>(this.apiUrl, signupData);
  }

  /**
   * Find signup by email
   */
  findByEmail(email: string): Observable<Signup | null> {
    const url = `${this.apiUrl}/email/${email}`;
    console.log('SignupService: Making request to:', url);
    return this.http.get<Signup | null>(url);
  }

  /**
   * Find signup by ID
   */
  findOne(id: string): Observable<Signup> {
    return this.http.get<Signup>(`${this.apiUrl}/${id}`);
  }

  /**
   * Find signup by company number
   */
  findByCompanyNumber(companyNumber: string): Observable<Signup | null> {
    return this.http.get<Signup | null>(`${this.apiUrl}/company/${companyNumber}`);
  }
}
