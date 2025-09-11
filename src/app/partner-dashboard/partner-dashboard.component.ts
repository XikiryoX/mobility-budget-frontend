import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslationService, Language } from '../services/translation.service';
import { I18nPipe } from '../pipes/i18n.pipe';
import { UserSessionService } from '../services/user-session.service';
import { SocialSecretaryService } from '../services/social-secretary.service';

interface CompanySessions {
  signup: any;
  sessions: any[];
  totalSessions: number;
  pendingSessions: number;
  completedSessions: number;
  inProgressSessions: number;
  expanded: boolean;
}

@Component({
  selector: 'app-partner-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, I18nPipe],
  templateUrl: './partner-dashboard.component.html',
  styleUrls: ['./partner-dashboard.component.scss']
})
export class PartnerDashboardComponent implements OnInit {
  partnerName: string = '';
  partnerId: string = '';
  companySessions: CompanySessions[] = [];
  filteredCompanySessions: CompanySessions[] = [];
  companyFilter: string = '';
  isLoading: boolean = false;
  error: string = '';
  deletingSessionId: string | null = null;

  // Language
  selectedLanguage: Language = 'en';
  availableLanguages: { code: Language; name: string; flag: string }[] = [];
  showLanguageMenu: boolean = false;

  constructor(
    private router: Router,
    private translationService: TranslationService,
    private userSessionService: UserSessionService,
    private socialSecretaryService: SocialSecretaryService
  ) {}

  ngOnInit(): void {
    this.availableLanguages = this.translationService.getAvailableLanguages();
    this.selectedLanguage = this.translationService.getCurrentLanguage();
    
    this.checkAuthentication();
    this.loadPartnerSessions();
  }

  checkAuthentication(): void {
    const isPartner = localStorage.getItem('isPartner') === 'true';
    if (!isPartner) {
      console.error('No partner authentication found - redirecting to login');
      this.router.navigate(['/partner-login']);
      return;
    }

    const partnerId = localStorage.getItem('partnerId');
    const partnerName = localStorage.getItem('partnerName');
    
    if (!partnerId || !partnerName) {
      console.error('Invalid partner data - redirecting to login');
      this.router.navigate(['/partner-login']);
      return;
    }
    
    this.partnerId = partnerId;
    this.partnerName = partnerName;
    console.log('Partner authenticated:', this.partnerName);
  }

  loadPartnerSessions(): void {
    this.isLoading = true;
    this.error = '';

    // Get all companies and sessions for this partner using the correct service
    this.socialSecretaryService.getCompaniesAndSessions(this.partnerId).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Loaded companies and sessions for partner:', response);
        
        // Transform the response to match our interface
        this.companySessions = response.companies.map(company => ({
          signup: company.signup,
          sessions: company.sessions,
          totalSessions: company.totalSessions,
          pendingSessions: company.pendingSessions,
          completedSessions: company.completedSessions,
          inProgressSessions: company.inProgressSessions || 0,
          expanded: false
        }));
        
        // Initialize filtered companies
        this.applyCompanyFilter();
        console.log('Transformed company sessions:', this.companySessions);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading partner sessions:', error);
        this.error = 'Failed to load sessions. Please try again.';
      }
    });
  }

  // Data is now loaded directly from the backend with the correct structure
  // No need to group sessions by company as the backend already provides this

  toggleCompanyExpansion(company: CompanySessions): void {
    company.expanded = !company.expanded;
  }

  openSession(session: any): void {
    // Navigate to TCO converter with session ID and partner mode
    this.router.navigate(['/tco-converter'], {
      queryParams: { 
        sessionId: session.id,
        partnerMode: 'true',
        partnerName: this.partnerName,
        companyName: session.signup?.companyName || 'Unknown Company',
        userName: session.signup?.fullName || 'Unknown User'
      }
    });
  }

  getStatusClass(session: any): string {
    const status = session.status || 'draft';
    switch (status) {
      case 'completed':
        return 'completed';
      case 'approved':
        return 'completed';
      case 'submitted':
      case 'under_review':
        return 'pending';
      case 'in_progress':
        return 'pending';
      default:
        return 'draft';
    }
  }

  getStatusText(session: any): string {
    const status = session.status || 'draft';
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'approved':
        return 'Approved';
      case 'submitted':
        return 'Submitted';
      case 'under_review':
        return 'Under Review';
      case 'in_progress':
        return 'In Progress';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Draft';
    }
  }

  getCurrentStep(session: any): number {
    return session.currentStep || 1;
  }

  getStepName(session: any): string {
    const step = session.currentStep || 1;
    switch (step) {
      case 1:
        return 'Basic Info';
      case 2:
        return 'Fuel & Brands';
      case 3:
        return 'Calculation Method';
      case 4:
        return 'Car Categories';
      case 5:
        return 'Review';
      default:
        return 'Basic Info';
    }
  }

  getCategoryCount(session: any): number {
    return session.carCategories?.length || 0;
  }

  getCompletedCategories(session: any): number {
    if (!session.carCategories) return 0;
    return session.carCategories.filter((cat: any) => cat.status === 'success').length;
  }

  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'N/A';
    return dateObj.toLocaleDateString();
  }

  formatTime(date: Date | string): string {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'N/A';
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getSessionCount(company: CompanySessions): number {
    return company.totalSessions;
  }

  getCompletedSessions(company: CompanySessions): number {
    return company.completedSessions;
  }

  getPendingSessions(company: CompanySessions): number {
    return company.pendingSessions;
  }

  getInProgressSessions(company: CompanySessions): number {
    return company.inProgressSessions || 0;
  }

  getDraftSessions(company: CompanySessions): number {
    return company.totalSessions - (company.completedSessions + company.pendingSessions + (company.inProgressSessions || 0));
  }

  onLanguageChange(): void {
    this.translationService.setLanguage(this.selectedLanguage);
  }

  toggleLanguageMenu(): void {
    this.showLanguageMenu = !this.showLanguageMenu;
  }

  getCurrentLanguageName(): string {
    const currentLang = this.availableLanguages.find(lang => lang.code === this.selectedLanguage);
    return currentLang ? currentLang.name : 'English';
  }

  selectLanguage(languageCode: Language): void {
    this.selectedLanguage = languageCode;
    this.onLanguageChange();
    this.showLanguageMenu = false; // Close dropdown after selection
  }

  signOut(): void {
    localStorage.removeItem('isPartner');
    localStorage.removeItem('partnerId');
    localStorage.removeItem('partnerName');
    this.router.navigate(['/partner-login']);
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  deleteSession(session: any, event: Event): void {
    event.stopPropagation(); // Prevent row click
    
    if (confirm(`Are you sure you want to delete this session for ${session.signup?.fullName || 'Unknown Contact'}? This action cannot be undone.`)) {
      this.deletingSessionId = session.id;
      
      this.userSessionService.remove(session.id).subscribe({
        next: () => {
          console.log('Session deleted successfully');
          this.deletingSessionId = null;
          // Reload sessions to update the list
          this.loadPartnerSessions();
        },
        error: (error: any) => {
          console.error('Error deleting session:', error);
          this.deletingSessionId = null;
          alert('Failed to delete session. Please try again.');
        }
      });
    }
  }

  startNewPolicy(company: CompanySessions, event: Event): void {
    event.stopPropagation(); // Prevent company expansion
    
    // Create a new session for this company
    // Only send signupId as required by the backend API
    const newSessionData = {
      signupId: company.signup.id
    };

    console.log('Creating new session with data:', newSessionData);

    // Create new session
    this.userSessionService.create(newSessionData).subscribe({
      next: (newSession: any) => {
        console.log('New session created:', newSession);
        // Navigate to the TCO converter with the new session
        this.router.navigate(['/tco-converter'], { 
          queryParams: { 
            sessionId: newSession.id,
            partnerMode: 'true',
            partnerId: this.partnerId,
            partnerName: this.partnerName,
            companyName: company.signup.companyName,
            userName: company.signup.fullName
          }
        });
      },
      error: (error: any) => {
        console.error('Error creating new session:', error);
        alert(this.translate('errorCreatingSession'));
      }
    });
  }

  isDeleting(session: any): boolean {
    return this.deletingSessionId === session.id;
  }

  // Company Filter Methods
  onCompanyFilterChange(): void {
    this.applyCompanyFilter();
  }

  clearCompanyFilter(): void {
    this.companyFilter = '';
    this.applyCompanyFilter();
  }

  private applyCompanyFilter(): void {
    if (!this.companyFilter.trim()) {
      this.filteredCompanySessions = [...this.companySessions];
    } else {
      const filterValue = this.companyFilter.toLowerCase().trim();
      this.filteredCompanySessions = this.companySessions.filter(company =>
        company.signup.companyName.toLowerCase().includes(filterValue) ||
        company.signup.fullName.toLowerCase().includes(filterValue) ||
        company.signup.email.toLowerCase().includes(filterValue)
      );
    }
  }

}

