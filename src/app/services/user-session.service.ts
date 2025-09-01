import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserSession {
  id: string;
  signupId: string;
  status: 'draft' | 'in_progress' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'completed';
  currentStep: number;
  stepData?: any;
  uploadedFiles?: Array<{
    name: string;
    size: number;
    url?: string;
    uploadedAt: Date;
  }>;
  carCategories?: Array<{
    id: string;
    name: string;
    annualKilometers: number;
    leasingDuration: number;
    employeeContribution: { enabled: boolean; amount: number };
    cleaningCost: { enabled: boolean; amount: number };
    parkingCost: { enabled: boolean; amount: number };
    fuelCard: { enabled: boolean; amount: number };
    referenceCar?: any;
    monthlyTco?: number;
    status?: 'success' | 'error' | 'pending';
  }>;
  selectedCalculationMethod?: number;
  selectedFuelTypes?: string[];
  selectedBrands?: string[];
  notes?: string;
  lastActivityAt: Date;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  documentUrl?: string;
  documentStatus?: string;
  documentUrls?: {
    en?: { previewUrl: string; downloadUrl: string };
    nl?: { previewUrl: string; downloadUrl: string };
    fr?: { previewUrl: string; downloadUrl: string };
  };
  createdAt: Date;
  updatedAt: Date;
  signup?: {
    id: string;
    fullName: string;
    email: string;
    companyName?: string;
    socialSecretary?: string;
  };
}

export interface CreateUserSessionDto {
  signupId: string;
  currentStep?: number;
  stepData?: any;
  uploadedFiles?: Array<{
    name: string;
    size: number;
    url?: string;
    uploadedAt: Date;
  }>;
  carCategories?: Array<{
    id: string;
    name: string;
    annualKilometers: number;
    leasingDuration: number;
    employeeContribution: { enabled: boolean; amount: number };
    cleaningCost: { enabled: boolean; amount: number };
    parkingCost: { enabled: boolean; amount: number };
    fuelCard: { enabled: boolean; amount: number };
    referenceCar?: any;
    monthlyTco?: number;
    status?: 'success' | 'error' | 'pending';
  }>;
  selectedCalculationMethod?: number;
  selectedFuelTypes?: string[];
  selectedBrands?: string[];
  notes?: string;
  documentUrl?: string;
  documentStatus?: string;
  documentUrls?: {
    en?: { previewUrl: string; downloadUrl: string };
    nl?: { previewUrl: string; downloadUrl: string };
    fr?: { previewUrl: string; downloadUrl: string };
  };
}

export interface UpdateUserSessionDto {
  status?: 'draft' | 'in_progress' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'completed';
  currentStep?: number;
  stepData?: any;
  uploadedFiles?: Array<{
    name: string;
    size: number;
    url?: string;
    uploadedAt: Date;
  }>;
  carCategories?: Array<{
    id: string;
    name: string;
    annualKilometers: number;
    leasingDuration: number;
    employeeContribution: { enabled: boolean; amount: number };
    cleaningCost: { enabled: boolean; amount: number };
    parkingCost: { enabled: boolean; amount: number };
    fuelCard: { enabled: boolean; amount: number };
    referenceCar?: any;
    monthlyTco?: number;
    status?: 'success' | 'error' | 'pending';
  }>;
  selectedCalculationMethod?: number;
  selectedFuelTypes?: string[];
  selectedBrands?: string[];
  notes?: string;
  reviewedBy?: string;
  documentUrl?: string;
  documentStatus?: string;
  documentUrls?: {
    en?: { previewUrl: string; downloadUrl: string };
    nl?: { previewUrl: string; downloadUrl: string };
    fr?: { previewUrl: string; downloadUrl: string };
  };
  lastActivityAt?: Date;
}

export interface SessionStatistics {
  total: number;
  draft: number;
  inProgress: number;
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
  completed: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {
  private apiUrl = environment.backendUrl;

  constructor(private http: HttpClient) {}

  /**
   * Create a new user session
   */
  create(createUserSessionDto: CreateUserSessionDto): Observable<UserSession> {
    return this.http.post<UserSession>(`${this.apiUrl}/user-sessions`, createUserSessionDto);
  }

  /**
   * Get all sessions for a user by email
   */
  findByUserEmail(email: string): Observable<UserSession[]> {
    return this.http.get<UserSession[]>(`${this.apiUrl}/user-sessions/user/${email}`);
  }

  /**
   * Get all sessions for a signup
   */
  findBySignupId(signupId: string): Observable<UserSession[]> {
    return this.http.get<UserSession[]>(`${this.apiUrl}/user-sessions/signup/${signupId}`);
  }

  /**
   * Get all sessions for a partner (social secretary)
   */
  findByPartnerId(partnerId: string): Observable<UserSession[]> {
    return this.http.get<UserSession[]>(`${this.apiUrl}/user-sessions/partner/${partnerId}`);
  }

  /**
   * Get a specific session by ID
   */
  findOne(id: string): Observable<UserSession> {
    return this.http.get<UserSession>(`${this.apiUrl}/user-sessions/${id}`);
  }

  /**
   * Update a session
   */
  update(id: string, updateUserSessionDto: UpdateUserSessionDto): Observable<UserSession> {
    return this.http.put<UserSession>(`${this.apiUrl}/user-sessions/${id}`, updateUserSessionDto);
  }

  /**
   * Update session step
   */
  updateStep(id: string, step: number, stepData?: any): Observable<UserSession> {
    return this.http.put<UserSession>(`${this.apiUrl}/user-sessions/${id}/step`, { step, stepData });
  }

  /**
   * Submit session for review
   */
  submitForReview(id: string): Observable<UserSession> {
    return this.http.put<UserSession>(`${this.apiUrl}/user-sessions/${id}/submit`, {});
  }

  /**
   * Review session (approve/reject)
   */
  reviewSession(id: string, status: 'approved' | 'rejected', reviewedBy: string, notes?: string): Observable<UserSession> {
    return this.http.put<UserSession>(`${this.apiUrl}/user-sessions/${id}/review`, { status, reviewedBy, notes });
  }

  /**
   * Delete a session
   */
  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user-sessions/${id}`);
  }

  /**
   * Get session statistics for a user
   */
  getStatistics(email: string): Observable<SessionStatistics> {
    return this.http.get<SessionStatistics>(`${this.apiUrl}/user-sessions/statistics/${email}`);
  }

  /**
   * Add car category to session
   */
  addCarCategory(sessionId: string, carCategory: any): Observable<UserSession> {
    return this.http.post<UserSession>(`${this.apiUrl}/user-sessions/${sessionId}/car-categories`, carCategory);
  }

  /**
   * Update car category in session
   */
  updateCarCategory(sessionId: string, categoryId: string, updatedCategory: any): Observable<UserSession> {
    return this.http.put<UserSession>(`${this.apiUrl}/user-sessions/${sessionId}/car-categories/${categoryId}`, updatedCategory);
  }

  /**
   * Delete car category from session
   */
  deleteCarCategory(sessionId: string, categoryId: string): Observable<UserSession> {
    return this.http.delete<UserSession>(`${this.apiUrl}/user-sessions/${sessionId}/car-categories/${categoryId}`);
  }

  /**
   * Save TCO document to Google Cloud Storage
   */
  saveTcoDocument(sessionId: string, tcoData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user-sessions/${sessionId}/save-tco-document`, tcoData);
  }

  /**
   * Get document content for a specific language via backend proxy
   */
  getDocumentContent(sessionId: string, language: string = 'en'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user-sessions/${sessionId}/document-content/${language}`);
  }

  /**
   * Get available document languages for a session
   */
  getDocumentLanguages(sessionId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user-sessions/${sessionId}/document-languages`);
  }

  /**
   * Update document content for a specific language
   */
  updateDocumentContent(sessionId: string, updateData: {
    documentContent: string;
    language: string;
    lastModified: string;
  }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user-sessions/${sessionId}/document-content`, updateData);
  }

  /**
   * Approve document and generate multi-language versions
   */
  approveDocument(sessionId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user-sessions/${sessionId}/approve-document`, {});
  }

  /**
   * Reject document and reset session to step 4
   */
  rejectDocument(sessionId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user-sessions/${sessionId}/reject-document`, {});
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
}
