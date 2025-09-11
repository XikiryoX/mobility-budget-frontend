import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslationService, Language } from '../services/translation.service';
import { I18nPipe } from '../pipes/i18n.pipe';
import { SocialSecretaryService } from '../services/social-secretary.service';

@Component({
  selector: 'app-partner-login',
  standalone: true,
  imports: [CommonModule, FormsModule, I18nPipe],
  templateUrl: './partner-login.component.html',
  styleUrls: ['./partner-login.component.scss']
})
export class PartnerLoginComponent {
  email: string = '';
  isLoading: boolean = false;
  error: string = '';
  success: string = '';

  // Language
  selectedLanguage: Language = 'en';
  availableLanguages: { code: Language; name: string; flag: string }[] = [];

  constructor(
    private router: Router,
    private translationService: TranslationService,
    private socialSecretaryService: SocialSecretaryService
  ) {
    this.availableLanguages = this.translationService.getAvailableLanguages();
    this.selectedLanguage = this.translationService.getCurrentLanguage();
  }

  onSubmit(): void {
    if (!this.email || !this.email.trim()) {
      this.error = 'Please enter your email address';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.error = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.success = '';

    console.log('Partner login attempt for:', this.email);

    // Authenticate via backend
    this.socialSecretaryService.authenticate(this.email).subscribe({
      next: (socialSecretary) => {
        if (socialSecretary) {
          // Valid partner - proceed to partner dashboard
          this.loginAsPartner(socialSecretary);
        } else {
          // Not a registered partner
          this.isLoading = false;
          this.error = 'This email is not registered as a partner. Please contact support.';
        }
      },
      error: (error) => {
        console.error('Authentication error:', error);
        this.isLoading = false;
        this.error = 'Authentication failed. Please try again or contact support.';
      }
    });
  }

  private loginAsPartner(socialSecretary: any): void {
    console.log(`Logging in as ${socialSecretary.name} partner...`);
    
    // Store partner credentials
    localStorage.setItem('userEmail', this.email);
    localStorage.setItem('partnerId', socialSecretary.id);
    localStorage.setItem('partnerName', socialSecretary.name);
    localStorage.setItem('partnerCode', socialSecretary.socialSecretaryCode);
    localStorage.setItem('isPartner', 'true');

    this.success = `Login successful! Redirecting to ${socialSecretary.name} partner dashboard...`;
    
    // Redirect to partner dashboard
    setTimeout(() => {
      this.router.navigate(['/partner-dashboard']);
    }, 1000);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onLanguageChange(): void {
    this.translationService.setLanguage(this.selectedLanguage);
  }

  goToUserLogin(): void {
    this.router.navigate(['/login']);
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

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
