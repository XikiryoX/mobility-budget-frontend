import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslationService, Language } from '../services/translation.service';
import { SignupService, Signup } from '../services/signup.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string = '';
  isSubmitting: boolean = false;
  selectedLanguage: Language = 'en';
  emailError: string = '';
  availableLanguages: { code: Language; name: string; flag: string }[] = [];
  
  private languageSubscription: Subscription = new Subscription();

  // Email validation regex
  private emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(
    private translationService: TranslationService,
    private signupService: SignupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.availableLanguages = this.translationService.getAvailableLanguages();
    this.selectedLanguage = this.translationService.getCurrentLanguage();
    
    this.languageSubscription = this.translationService.currentLanguage$.subscribe(
      (language) => {
        this.selectedLanguage = language;
        this.updateErrorMessages();
      }
    );
  }

  ngOnDestroy(): void {
    this.languageSubscription.unsubscribe();
  }

  validateEmail(email: string): boolean {
    return this.emailRegex.test(email);
  }

  onEmailChange(): void {
    this.emailError = '';
    if (this.email && !this.validateEmail(this.email)) {
      this.emailError = this.translationService.translate('invalidEmail');
    }
  }

  onSubmit(): void {
    if (!this.email) {
      this.emailError = this.translationService.translate('emailRequired');
      return;
    }
    
    if (!this.validateEmail(this.email)) {
      this.emailError = this.translationService.translate('invalidEmail');
      return;
    }

    this.isSubmitting = true;
    
    // Find signup by email to get the signup ID (partner ID)
    console.log('Attempting to find signup for email:', this.email);
    console.log('API URL:', `${environment.backendUrl}/signup/email/${this.email}`);
    
    this.signupService.findByEmail(this.email).subscribe({
      next: (signup: Signup | null) => {
        this.isSubmitting = false;
        console.log('API response received:', signup);
        
        if (signup) {
          // Store user information in localStorage
          localStorage.setItem('userEmail', this.email);
          localStorage.setItem('partnerId', signup.id); // Use signup ID as partner ID
          localStorage.setItem('partnerName', signup.socialSecretary); // Use social secretary name
          localStorage.setItem('partnerCode', signup.socialSecretary);
          
          console.log('Login successful for:', signup.email);
          console.log('Signup ID (partner ID):', signup.id);
          console.log('Stored in localStorage:', {
            userEmail: localStorage.getItem('userEmail'),
            partnerId: localStorage.getItem('partnerId'),
            partnerName: localStorage.getItem('partnerName'),
            partnerCode: localStorage.getItem('partnerCode')
          });
          
          // Navigate to TCO Converter after successful login
          this.router.navigate(['/tco-converter']);
        } else {
          // No signup found with this email
          console.log('No signup found for email:', this.email);
          this.emailError = this.translationService.translate('userNotFound') || 'No account found with this email address. Please sign up first.';
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Login error:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        this.emailError = this.translationService.translate('loginError') || 'An error occurred during login. Please try again.';
      }
    });
  }

  onLanguageChange(): void {
    this.translationService.setLanguage(this.selectedLanguage);
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }

  viewPreviousSessions(): void {
    this.router.navigate(['/user-sessions']);
  }

  goToPartnerLogin(): void {
    this.router.navigate(['/partner-login']);
  }

  private updateErrorMessages(): void {
    if (this.emailError) {
      if (this.emailError === 'Please enter a valid email address' || 
          this.emailError === 'Email address is required') {
        this.onEmailChange(); // This will update the error message in the current language
      }
    }
  }

  // Translation helper methods
  translate(key: string): string {
    return this.translationService.translate(key);
  }
} 