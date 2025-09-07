import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserSessionService, UserSession } from '../services/user-session.service';
import { TranslationService, Language } from '../services/translation.service';

@Component({
  selector: 'app-user-sessions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-sessions.component.html',
  styleUrls: ['./user-sessions.component.scss']
})
export class UserSessionsComponent implements OnInit, OnDestroy {
  userSessions: UserSession[] = [];
  isLoading: boolean = false;
  error: string = '';
  
  // Language
  selectedLanguage: Language = 'en';
  availableLanguages: { code: Language; name: string; flag: string }[] = [];
  private languageSubscription?: Subscription;

  constructor(
    private userSessionService: UserSessionService,
    private translationService: TranslationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.availableLanguages = this.translationService.getAvailableLanguages();
    this.checkAuthentication();
    this.loadUserSessions();
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  loadUserSessions(): void {
    this.isLoading = true;
    this.error = '';

    // Get user email from localStorage or session storage
    const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    
    if (!userEmail) {
      this.error = 'No user email found. Please login again.';
      this.isLoading = false;
      return;
    }

    this.userSessionService.findByUserEmail(userEmail).subscribe({
      next: (sessions) => {
        this.userSessions = sessions;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user sessions:', error);
        this.error = 'Failed to load sessions. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSessionClick(session: UserSession): void {
    // Navigate to TCO converter with session data
    this.router.navigate(['/tco-converter'], { 
      queryParams: { 
        sessionId: session.id,
        step: session.currentStep 
      } 
    });
  }

  onNewSession(): void {
    // Clear any existing session data from localStorage
    localStorage.removeItem('currentSessionId');
    
    // Navigate to TCO converter for new session
    this.router.navigate(['/tco-converter']);
  }

  onBackToTcoConverter(): void {
    this.router.navigate(['/tco-converter']);
  }

  checkAuthentication(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      this.router.navigate(['/login']);
      return;
    }
  }

  getStatusDisplayText(status: string): string {
    return this.userSessionService.getStatusDisplayText(status);
  }

  getStatusColorClass(status: string): string {
    return this.userSessionService.getStatusColorClass(status);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  }

  onLanguageChange(): void {
    this.translationService.setLanguage(this.selectedLanguage);
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  openLanguageDropdown(selectElement: HTMLSelectElement): void {
    // Create and dispatch a mousedown event to open the dropdown
    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    selectElement.dispatchEvent(event);
  }
}
