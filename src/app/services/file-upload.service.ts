import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UploadedFile {
  id: string;
  originalName: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  sessionId: string;
}

export interface CarCategoryInfo {
  categoryName: string;
  monthlyBudget?: number;
  employeeContribution?: number;
  cleaningCost?: number;
  parkingCost?: number;
  fuelCard?: number;
  confidence: number;
  source: string;
}

export interface UploadProgress {
  progress: number;
  loaded: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = 'http://localhost:3000/file-upload';
  private uploadProgressSubject = new BehaviorSubject<UploadProgress>({ progress: 0, loaded: 0, total: 0 });

  constructor(private http: HttpClient) {}

  uploadFile(sessionId: string, file: File): Observable<{ file: UploadedFile; categories?: CarCategoryInfo[] }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ file: UploadedFile; categories?: CarCategoryInfo[] }>(
      `${this.apiUrl}/${sessionId}`,
      formData,
      {
        reportProgress: true,
        observe: 'events'
      }
    ).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = event.total ? Math.round(100 * event.loaded / event.total) : 0;
          this.uploadProgressSubject.next({
            progress,
            loaded: event.loaded,
            total: event.total || 0
          });
        } else if (event.type === HttpEventType.Response) {
          this.uploadProgressSubject.next({ progress: 100, loaded: 100, total: 100 });
          return event.body;
        }
        return null;
      })
    );
  }

  deleteFile(sessionId: string, fileName: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${sessionId}/${fileName}`);
  }

  getSessionFiles(sessionId: string): Observable<UploadedFile[]> {
    return this.http.get<UploadedFile[]>(`${this.apiUrl}/${sessionId}/files`);
  }

  analyzeFile(sessionId: string, fileName: string): Observable<{ categories: CarCategoryInfo[] }> {
    return this.http.post<{ categories: CarCategoryInfo[] }>(
      `${this.apiUrl}/${sessionId}/${fileName}/analyze`,
      {}
    );
  }

  getUploadProgress(): Observable<UploadProgress> {
    return this.uploadProgressSubject.asObservable();
  }

  resetUploadProgress(): void {
    this.uploadProgressSubject.next({ progress: 0, loaded: 0, total: 0 });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  isValidFileType(file: File): boolean {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    return allowedTypes.includes(file.type);
  }
}
