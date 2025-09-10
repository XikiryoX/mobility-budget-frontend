import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslationService, Language } from '../services/translation.service';
import { I18nPipe } from '../pipes/i18n.pipe';
import { ViesServiceFactory, ViesServiceInterface } from '../services/vies.service.factory';
import { ViesResponse } from '../services/vies.service';
import { SignupService } from '../services/signup.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  // Form data
  fullName: string = '';
  email: string = '';
  phoneNumber: string = '';
  selectedCountry: string = '+32'; // Belgian flag is already default
  socialSecretary: string = '';
  companyNumber: string = '';
  companyName: string = '';
  
  // Form validation
  fullNameError: string = '';
  emailError: string = '';
  phoneNumberError: string = '';
  socialSecretaryError: string = '';
  companyNumberError: string = '';
  companyNameError: string = '';
  isSubmitting: boolean = false;
  showCompanyNameInput: boolean = false;
  
  // VIES API
  isLookingUpCompany: boolean = false;
  companyInfo: any = null;
  
  // Language
  selectedLanguage: Language = 'en';
  availableLanguages: { code: Language; name: string; flag: string }[] = [];
  private languageSubscription?: Subscription;
  
  // Validation regex patterns
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private phoneRegex = /^[0-9+\-\s\(\)]{8,15}$/;
  private companyNumberRegex = /^(BE)?[0-9]{10}$/;

  private viesService: ViesServiceInterface;

  constructor(
    private router: Router,
    private translationService: TranslationService,
    private viesServiceFactory: ViesServiceFactory,
    private signupService: SignupService
  ) {
    this.viesService = this.viesServiceFactory.getViesService();
    console.log('Using VIES service:', this.viesServiceFactory.getServiceName());
  }

  ngOnInit(): void {
    this.availableLanguages = this.translationService.getAvailableLanguages();
    this.selectedLanguage = this.translationService.getCurrentLanguage();
    
    // Ensure Belgian flag is selected by default
    this.selectedCountry = '+32';
    
    this.languageSubscription = this.translationService.currentLanguage$.subscribe(
      (language) => {
        this.selectedLanguage = language;
        this.updateErrorMessages();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  // Navigation
  goBack(): void {
    this.router.navigate(['/']);
  }

  // Language handling
  onLanguageChange(): void {
    this.translationService.setLanguage(this.selectedLanguage);
  }

  // Form validation methods
  validateEmail(email: string): boolean {
    return this.emailRegex.test(email);
  }

  validatePhoneNumber(phone: string): boolean {
    return this.phoneRegex.test(phone);
  }

  validateCompanyNumber(companyNumber: string): boolean {
    // Disabled regex validation - only VIES API validation is used
    return companyNumber.trim().length > 0;
  }

  onFullNameChange(): void {
    if (!this.fullName) {
      this.fullNameError = '';
    } else if (this.fullName.trim().length < 2) {
      this.fullNameError = this.translate('fullNameRequired');
    } else {
      this.fullNameError = '';
    }
  }

  onEmailChange(): void {
    if (!this.email) {
      this.emailError = '';
    } else if (!this.validateEmail(this.email)) {
      this.emailError = this.translate('invalidEmail');
    } else {
      this.emailError = '';
    }
  }

  onPhoneNumberChange(): void {
    if (!this.phoneNumber) {
      this.phoneNumberError = '';
    } else if (!this.validatePhoneNumber(this.phoneNumber)) {
      this.phoneNumberError = this.translate('invalidPhoneNumber');
    } else {
      this.phoneNumberError = '';
    }
  }

  onSocialSecretaryChange(): void {
    if (!this.socialSecretary) {
      this.socialSecretaryError = '';
    } else {
      this.socialSecretaryError = '';
    }
  }

  onCompanyNumberChange(): void {
    this.companyNumberError = '';
    
    if (!this.companyNumber) {
      this.companyInfo = null;
      this.showCompanyNameInput = false;
      this.companyName = '';
      return;
    }

    // Clear company info when company number changes
    this.companyInfo = null;
    this.showCompanyNameInput = false;
    this.companyName = '';
    
    // Lookup company info after a short delay
    setTimeout(() => {
      this.lookupCompanyInfo();
    }, 500);
  }

  onCompanyNameChange(): void {
    this.companyNameError = '';
    
    if (!this.companyName) {
      this.companyNameError = this.translate('companyNameRequired');
      return;
    }

    if (this.companyName.length < 2) {
      this.companyNameError = this.translate('companyNameTooShort');
      return;
    }
  }

  private lookupCompanyInfo(): void {
    if (!this.companyNumber || this.isLookingUpCompany) {
      return;
    }

    this.isLookingUpCompany = true;
    const vatNumber = this.viesService.formatVatNumber(this.companyNumber);
    
    console.log('Looking up VAT number:', vatNumber);

    this.viesService.lookupCompany(vatNumber).subscribe({
      next: (response: ViesResponse) => {
        this.isLookingUpCompany = false;
        console.log('VIES API response:', response);
        
        if (this.viesService.isCompanyValid(response)) {
          this.companyInfo = this.viesService.extractCompanyInfo(response);
          this.companyNumberError = '';
          this.showCompanyNameInput = false;
          console.log('Company found:', this.companyInfo);
        } else {
          // Show company name input when VIES lookup fails or returns invalid data
          this.companyInfo = null;
          this.companyNumberError = '';
          this.showCompanyNameInput = true;
          console.log('Company not found in VIES - showing manual input');
        }
      },
      error: (error: any) => {
        this.isLookingUpCompany = false;
        this.companyInfo = null;
        console.error('VIES API error:', error);
        
        // Handle VIES API errors
        if (error.status === 0 || error.message?.includes('CORS')) {
          this.companyNumberError = this.translate('corsError');
          this.showCompanyNameInput = true;
        } else if (error.error?.code === 22) {
          this.companyNumberError = this.translate('invalidCompanyNumber');
          this.showCompanyNameInput = true;
        } else {
          this.companyNumberError = this.translate('companyLookupError');
          this.showCompanyNameInput = true;
        }
      }
    });
  }

  isFormValid(): boolean {
    const baseValidation = !!(
      this.fullName &&
      !this.fullNameError &&
      this.email &&
      !this.emailError &&
      this.phoneNumber &&
      !this.phoneNumberError &&
      this.socialSecretary &&
      !this.socialSecretaryError &&
      this.companyNumber &&
      !this.companyNumberError
    );

    // If company name input is shown, validate it too
    if (this.showCompanyNameInput) {
      return baseValidation && !!this.companyName && !this.companyNameError;
    }

    return baseValidation;
  }

  // Form submission
  onSubmit(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.isSubmitting = true;
    
    const signupData = {
      fullName: this.fullName,
      email: this.email,
      phoneCountryCode: this.selectedCountry,
      phoneNumber: this.phoneNumber,
      socialSecretary: this.socialSecretary.toUpperCase(), // Ensure uppercase
      companyNumber: this.companyNumber,
      companyName: this.companyInfo?.name || this.companyName || this.companyNumber,
      companyAddress: this.companyInfo?.address || null,
      companyValidated: this.companyInfo?.isValid || false,
    };

    console.log('Submitting signup data:', signupData);
    
    // Send to backend API
    this.signupService.create(signupData).subscribe({
      next: (response) => {
        console.log('Signup successful:', response);
        this.isSubmitting = false;
        // Redirect to success page or dashboard
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Signup failed:', error);
        this.isSubmitting = false;
        // Show error message
        alert('Signup failed: ' + (error.error?.message || error.message || 'Unknown error'));
      }
    });
  }

  // Translation helper
  translate(key: string): string {
    return this.translationService.translate(key);
  }

  // Error message updates
  private updateErrorMessages(): void {
    if (this.fullNameError) {
      this.onFullNameChange();
    }
    if (this.emailError) {
      this.onEmailChange();
    }
    if (this.phoneNumberError) {
      this.onPhoneNumberChange();
    }
    if (this.companyNumberError) {
      this.onCompanyNumberChange();
    }
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
