import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslationService, Language } from '../services/translation.service';
import { PartnerService } from '../services/partner.service';

@Component({
  selector: 'app-partner-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    private partnerService: PartnerService
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

    // For now, we'll use a simple check for the admin user
    if (this.email.toLowerCase() === 'securex@mobility.be') {
      // Admin user - proceed to partner dashboard
      this.loginAsAdmin();
    } else {
      // Check if this is a valid partner email
      this.checkPartnerEmail();
    }
  }

  private loginAsAdmin(): void {
    console.log('Logging in as Securex admin...');
    
    // Store admin credentials
    localStorage.setItem('userEmail', this.email);
    localStorage.setItem('partnerId', 'securex');
    localStorage.setItem('partnerName', 'Securex');
    localStorage.setItem('partnerCode', 'securex');
    localStorage.setItem('isPartner', 'true');

    this.success = 'Login successful! Redirecting to partner dashboard...';
    
    // Redirect to partner dashboard
    setTimeout(() => {
      this.router.navigate(['/partner-dashboard']);
    }, 1000);
  }

  private checkPartnerEmail(): void {
    // For now, we'll only allow the admin user
    // In the future, this would check against a partner database
    this.isLoading = false;
    this.error = 'This email is not registered as a partner. Please contact support.';
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

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
