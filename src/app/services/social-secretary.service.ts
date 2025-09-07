import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SocialSecretary {
  id: string;
  name: string;
  email: string;
  socialSecretaryCode: string;
  phoneCountryCode: string;
  phoneNumber: string;
  address?: string;
  website?: string;
  description?: string;
  isActive: boolean;
  role: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyWithSessions {
  signup: {
    id: string;
    fullName: string;
    email: string;
    companyName?: string;
    companyNumber: string;
    socialSecretary: string;
    status: string;
    createdAt: Date;
  };
  sessions: Array<{
    id: string;
    status: string;
    currentStep: number;
    lastActivityAt: Date;
    createdAt: Date;
  }>;
  totalSessions: number;
  pendingSessions: number;
  completedSessions: number;
  inProgressSessions: number;
}

export interface SocialSecretaryStatistics {
  totalCompanies: number;
  totalSessions: number;
  pendingSessions: number;
  inProgressSessions: number;
  submittedSessions: number;
  approvedSessions: number;
  rejectedSessions: number;
  completedSessions: number;
}

export interface CreateSocialSecretaryDto {
  name: string;
  email: string;
  socialSecretaryCode: string;
  phoneCountryCode: string;
  phoneNumber: string;
  address?: string;
  website?: string;
  description?: string;
  isActive?: boolean;
  role?: string;
  notes?: string;
}

export interface UpdateSocialSecretaryDto {
  name?: string;
  email?: string;
  socialSecretaryCode?: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  address?: string;
  website?: string;
  description?: string;
  isActive?: boolean;
  role?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocialSecretaryService {
  private apiUrl = environment.backendUrl;

  constructor(private http: HttpClient) {}

  /**
   * Create a new social secretary
   */
  create(createSocialSecretaryDto: CreateSocialSecretaryDto): Observable<SocialSecretary> {
    return this.http.post<SocialSecretary>(`${this.apiUrl}/social-secretaries`, createSocialSecretaryDto);
  }

  /**
   * Get all social secretaries
   */
  findAll(page: number = 1, limit: number = 10): Observable<{ data: SocialSecretary[]; total: number }> {
    return this.http.get<{ data: SocialSecretary[]; total: number }>(`${this.apiUrl}/social-secretaries?page=${page}&limit=${limit}`);
  }

  /**
   * Get a specific social secretary by ID
   */
  findOne(id: string): Observable<SocialSecretary> {
    return this.http.get<SocialSecretary>(`${this.apiUrl}/social-secretaries/${id}`);
  }

  /**
   * Get social secretary by email
   */
  findByEmail(email: string): Observable<SocialSecretary> {
    return this.http.get<SocialSecretary>(`${this.apiUrl}/social-secretaries/email/${email}`);
  }

  /**
   * Get social secretary by code
   */
  findByCode(code: string): Observable<SocialSecretary> {
    return this.http.get<SocialSecretary>(`${this.apiUrl}/social-secretaries/code/${code}`);
  }

  /**
   * Update a social secretary
   */
  update(id: string, updateSocialSecretaryDto: UpdateSocialSecretaryDto): Observable<SocialSecretary> {
    return this.http.put<SocialSecretary>(`${this.apiUrl}/social-secretaries/${id}`, updateSocialSecretaryDto);
  }

  /**
   * Delete a social secretary
   */
  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/social-secretaries/${id}`);
  }

  /**
   * Get all companies and their sessions for a social secretary
   */
  getCompaniesAndSessions(id: string): Observable<{
    companies: CompanyWithSessions[];
    totalCompanies: number;
    totalSessions: number;
  }> {
    return this.http.get<{
      companies: CompanyWithSessions[];
      totalCompanies: number;
      totalSessions: number;
    }>(`${this.apiUrl}/social-secretaries/${id}/companies`);
  }

  /**
   * Get statistics for a social secretary
   */
  getStatistics(id: string): Observable<SocialSecretaryStatistics> {
    return this.http.get<SocialSecretaryStatistics>(`${this.apiUrl}/social-secretaries/${id}/statistics`);
  }

  /**
   * Authenticate social secretary
   */
  authenticate(email: string): Observable<SocialSecretary> {
    return this.http.post<SocialSecretary>(`${this.apiUrl}/social-secretaries/authenticate`, { email });
  }

  /**
   * Get status display text
   */
  getStatusDisplayText(status: string): string {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'in_progress':
        return 'In Progress';
      case 'submitted':
        return 'Submitted';
      case 'under_review':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  }

  /**
   * Get status color class
   */
  getStatusColorClass(status: string): string {
    switch (status) {
      case 'draft':
        return 'status-draft';
      case 'in_progress':
        return 'status-in-progress';
      case 'submitted':
        return 'status-submitted';
      case 'under_review':
        return 'status-under-review';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-default';
    }
  }

  /**
   * Logout social secretary
   */
  logout(): void {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('partnerId');
    localStorage.removeItem('partnerName');
    localStorage.removeItem('partnerCode');
    localStorage.removeItem('isPartner');
  }
}
