import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslationService, Language } from '../services/translation.service';
import { I18nPipe } from '../pipes/i18n.pipe';
import { VehiclesService } from '../services/vehicles.service';
import { TcoResultsComponent, TcoResult } from '../tco-results/tco-results.component';
import { UserSessionService, UserSession } from '../services/user-session.service';
import { FileUploadService, UploadedFile as FileUploadedFile, CarCategoryInfo } from '../services/file-upload.service';
import { AiAnalysisPopupComponent } from '../components/ai-analysis-popup/ai-analysis-popup.component';
import { SafePipe } from '../pipes/safe.pipe';

export interface Step {
  id: number;
  key: string;
  title: string;
  completed: boolean;
  active: boolean;
}



@Component({
  selector: 'app-tco-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, TcoResultsComponent, AiAnalysisPopupComponent, SafePipe, I18nPipe],
  templateUrl: './tco-converter.component.html',
  styleUrls: ['./tco-converter.component.scss']
})
export class TcoConverterComponent implements OnInit, OnDestroy {
  currentStep: number = 1;
  totalSteps: number = 5;
  
  steps: Step[] = [
    { id: 1, key: 'generalInformation', title: 'General information', completed: false, active: true },
    { id: 2, key: 'uploadCarPolicy', title: 'Upload car policy', completed: false, active: false },
    { id: 3, key: 'calculationMethod', title: 'Calculation method', completed: false, active: false },
    { id: 4, key: 'carCategories', title: 'Car categories', completed: false, active: false },
    { id: 5, key: 'mobilityBudgetPolicy', title: 'Mobility budget policy', completed: false, active: false }
  ];

  // File upload
  uploadedFiles: FileUploadedFile[] = [];
  isDragOver: boolean = false;
  uploadProgress: number = 0;
  isUploading: boolean = false;
  showAiAnalysisPopup: boolean = false;
  aiAnalysisCategories: CarCategoryInfo[] = [];
  currentAnalyzedFile: string = '';

  // Calculation method
  selectedCalculationMethod: number = 0;

  // New Category Setup
  showAddCategoryForm: boolean = false;
  newCategory = {
    name: '',
    annualKilometers: '',
    leasingDuration: '',
    employeeContribution: { enabled: false, amount: 0 },
    cleaningCost: { enabled: false, amount: 0 },
    parkingCost: { enabled: false, amount: 0 },
    fuelCard: { enabled: false, amount: 0 }
  };

  selectedFuelTypes: string[] = ['diesel', 'electric', 'hybrid', 'petrol'];

  carBrands: string[] = [];
  selectedBrands: string[] = [];
  availableBrands: string[] = [];
  availableFuelTypes: string[] = [];
  tcoDistribution: any[] = [];
  isLoadingTcoData = false;
  
  // TCO Range Sliders
  tcoRangeMin: number = 0;
  tcoRangeMax: number = 0;
  isDraggingSlider: boolean = false;
  activeSlider: 'min' | 'max' | null = null;
  
  // TCO Calculation Details
  tcoCalculationDetails: any[] = [];
  
  // Reference cars
  referenceCars: any[] = [];
  selectedReferenceCar: string | null = null; // Changed to single selection
  currentPage = 1;
  totalPages = 0;
  totalCars = 0;
  isLoadingReferenceCars = false;

  // Car filter modal
  showCarFilter: boolean = false;
  carFilterSearch: string = '';
  allReferenceCars: any[] = [];
  filteredCarGroups: any[] = [];
  selectedCarsInFilter: string[] = [];
  isCarFilterActive: boolean = false;

  // Sorting
  tcoSortDirection: 'asc' | 'desc' | null = null;

  // Partner for review
  partner: string = '';
  
  // Partner mode
  isPartnerMode: boolean = false;
  partnerName: string = '';
  companyName: string = '';
  userName: string = '';
  
  // Document management
  documentStatus: 'draft' | 'pending' | 'submitted' | 'approved' | 'rejected' = 'draft';
  documentUrl: string = '';
  documentContent: string = '';
  documentUrls: { en?: { previewUrl: string; downloadUrl: string }; nl?: { previewUrl: string; downloadUrl: string }; fr?: { previewUrl: string; downloadUrl: string } } = {};
  showDocumentEditor: boolean = false;
  editableDocumentContent: string = '';
  isGeneratingDocument: boolean = false;
  @ViewChild('documentEditor', { static: false }) documentEditorRef!: ElementRef<HTMLElement>;
  
  // Cache for storing edited content across languages
  private languageContentCache: { [key: string]: string } = {};

  // New Client Modal
  showNewClientModal: boolean = false;
  isSubmittingNewClient: boolean = false;
  newClientData = {
    fullName: '',
    email: '',
    phoneNumber: '',
    selectedCountry: '+32',
    socialSecretary: '',
    companyNumber: '',
    companyName: '',
    showCompanyNameInput: false,
    companyInfo: null as any,
    // Validation errors
    fullNameError: '',
    emailError: '',
    phoneNumberError: '',
    companyNumberError: '',
    companyNameError: ''
  };


  // Language
  selectedLanguage: Language = 'en';
  availableLanguages: { code: Language; name: string; flag: string }[] = [];
  
  // Document language (independent from UI language selector)
  documentLanguage: Language = 'en';

  // TCO Results
  tcoResult: TcoResult | null = null;
  showTcoResults: boolean = false;
  selectedReferenceCarData: any = null; // Track the currently selected reference car data
  calculatedTco: number | null = null; // Store the calculated TCO value

  // Car Categories
  carCategories: any[] = [];
  editingCategory: any = null; // Track which category is being edited

  // Session management
  currentSessionId: string | null = null;
  isLoadingSession: boolean = false;
  stepData: any = {};
  private routeSubscription?: Subscription;

  // User management
  userEmail: string | null = null;
  showUserMenu: boolean = false;
  showLanguageMenu: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translationService: TranslationService,
    private vehiclesService: VehiclesService,
    private userSessionService: UserSessionService,
    private fileUploadService: FileUploadService
  ) {}

    ngOnInit(): void {
    this.availableLanguages = this.translationService.getAvailableLanguages();
    this.selectedLanguage = this.translationService.getCurrentLanguage();
    this.documentLanguage = this.translationService.getCurrentLanguage(); // Initialize document language with current UI language
    // Don't call updateSteps here - it will be called after loading the session
    this.selectedFuelTypes = ['diesel', 'electric', 'hybrid', 'petrol']; // Initialize with all fuel types selected
    this.loadCarBrands();
    this.loadTcoDistribution();
    this.loadReferenceCars(); // Auto's moeten altijd geladen worden, ongeacht of er parameters zijn ingevuld
    this.updateAvailableFilters();

    // Check authentication
    this.checkAuthentication();
    
    // Check partner mode
    this.checkPartnerMode();

    // Check for session parameters
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      const sessionId = params['sessionId'];
      const step = params['step'];

      if (sessionId) {
        this.currentSessionId = sessionId;
        this.loadSession(sessionId);
      } else {
        // Check if we should create a new session (no currentSessionId in localStorage)
        const existingSessionId = localStorage.getItem('currentSessionId');
        if (existingSessionId) {
          // Load existing session
          this.createOrLoadSession();
        } else {
          // Create new session
          this.createNewSession();
        }
      }

      if (step) {
        // Only set currentStep from URL if no session is being loaded
        // This prevents URL parameters from overriding session data
        if (!sessionId) {
          this.currentStep = parseInt(step);
          this.updateSteps();
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  onLanguageChange(): void {
    this.translationService.setLanguage(this.selectedLanguage);
  }

  updateSteps(): void {
    console.log(`🔧 updateSteps called - currentStep: ${this.currentStep}, documentStatus: ${this.documentStatus}`);
    
    this.steps.forEach((step, index) => {
      step.active = step.id === this.currentStep;
      
      // A step is completed if:
      // 1. It's a previous step (step.id < this.currentStep), OR
      // 2. It's the current step (step 5) AND the document is approved or submitted
      step.completed = (step.id < this.currentStep) || 
                      (step.id === 5 && (this.documentStatus === 'approved' || this.documentStatus === 'submitted'));
      
      console.log(`🔧 Step ${step.id}: active=${step.active}, completed=${step.completed}`);
    });
  }

  getStepProgress(): number {
    // Calculate progress: each completed step is 100%, current step is 10%, future steps are 0%
    const completedSteps = this.currentStep - 1;
    const currentStepProgress = 0.10; // 10% for current step
    return (completedSteps + currentStepProgress) / this.totalSteps * 100;
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateSteps();
      
      // If moving to step 5 (review), automatically generate document and submit for review
      if (this.currentStep === 5 && this.currentSessionId) {
        // Only generate document if all categories have valid TCO
        if (this.canGenerateDocument()) {
          console.log('🔄 Moving to step 5 - automatically generating document and submitting for review...');
          
          // Generate the document first
          this.saveTcoDocument();
          
          // Update the document status to 'submitted' (ready for review)
          this.documentStatus = 'submitted';
          
          // Update session status to 'submitted'
          this.updateSessionStatus('submitted');
          
          console.log('✅ Document generated and submitted for review automatically');
        } else {
          console.log('❌ Cannot generate document: not all categories have valid TCO');
          // Show error message to user
          alert('Cannot generate document: Please ensure all car categories have valid TCO calculations (green checkmarks)');
          // Go back to step 4
          this.currentStep = 4;
          this.updateSteps();
          return;
        }
      }
      
      // Save session when moving to next step
      this.saveSession();
      // Scroll to top when moving to next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateSteps();
      // Save session when moving to previous step
      this.saveSession();
      // Scroll to top when moving to previous step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToStep(stepId: number): void {
    if (stepId <= this.currentStep) {
      this.currentStep = stepId;
      this.updateSteps();
    }
  }

  selectCalculationMethod(method: number): void {
    this.selectedCalculationMethod = method;
    // Save session when calculation method changes
    if (this.currentSessionId) {
      this.saveSession();
    }
  }

  toggleFuelType(fuelType: string): void {
    const index = this.selectedFuelTypes.indexOf(fuelType);
    if (index > -1) {
      this.selectedFuelTypes.splice(index, 1);
    } else {
      this.selectedFuelTypes.push(fuelType);
    }
    // Reset car filter when other filters change
    this.isCarFilterActive = false;
    // Reload data when fuel types change
    this.loadTcoDistribution();
    this.currentPage = 1; // Reset to first page
    this.loadReferenceCars();
    this.updateAvailableFilters();
  }

  isFormValid(): boolean {
    return this.newCategory.name.trim() !== '' && 
           this.newCategory.annualKilometers !== '' && 
           this.newCategory.leasingDuration !== '';
  }

  saveCategory(): void {
    console.log('Save category called');
    console.log('Form valid:', this.isFormValid());
    console.log('Current session ID:', this.currentSessionId);
    console.log('Form data:', this.newCategory);
    
    if (this.isFormValid() && this.currentSessionId) {
      // Create a new category object with TCO information if available
      const newCategoryObj = {
        name: this.newCategory.name,
        annualKilometers: parseInt(this.newCategory.annualKilometers, 10),
        leasingDuration: parseInt(this.newCategory.leasingDuration, 10),
        employeeContribution: this.newCategory.employeeContribution,
        cleaningCost: this.newCategory.cleaningCost,
        parkingCost: this.newCategory.parkingCost,
        fuelCard: this.newCategory.fuelCard,
        selectedFuelTypes: this.selectedFuelTypes,
        selectedBrands: this.selectedBrands,
        referenceCar: this.selectedReferenceCarData ? {
          id: this.selectedReferenceCarData.id,
          brand: this.selectedReferenceCarData.brand,
          model: this.selectedReferenceCarData.model,
          fuelType: this.selectedReferenceCarData.fuel_type
        } : null,
        monthlyTco: this.calculatedTco || null,
        tcoBreakdown: this.tcoResult?.tcoBreakdown || null,
        status: (this.calculatedTco && this.selectedReferenceCarData) ? 'success' : 'pending'
      };

      if (this.editingCategory) {
        // Update existing category
        this.userSessionService.updateCarCategory(this.currentSessionId, this.editingCategory.id, newCategoryObj).subscribe({
          next: (updatedSession) => {
            this.carCategories = updatedSession.carCategories || [];
            this.showAddCategoryForm = false;
            this.resetNewCategoryForm();
            this.editingCategory = null;
            console.log('Category updated successfully');
          },
          error: (error) => {
            console.error('Error updating category:', error);
            alert('Error updating category. Please try again.');
          }
        });
      } else {
        // Add new category
        this.userSessionService.addCarCategory(this.currentSessionId, newCategoryObj).subscribe({
          next: (updatedSession) => {
            this.carCategories = updatedSession.carCategories || [];
            this.showAddCategoryForm = false;
            this.resetNewCategoryForm();
            console.log('Category added successfully');
          },
          error: (error) => {
            console.error('Error adding category:', error);
            alert('Error adding category. Please try again.');
          }
        });
      }
    } else {
      console.error('Cannot save category: Form invalid or no session ID');
      if (!this.isFormValid()) {
        console.error('Form validation failed');
        alert('Please fill in all required fields (Category Name, Annual Kilometers, and Leasing Duration)');
      }
      if (!this.currentSessionId) {
        console.error('No current session ID');
        alert('Session not found. Redirecting to login...');
        // Redirect to login instead of trying to create session
        this.router.navigate(['/login']);
      }
    }
  }

  resetNewCategoryForm(): void {
    this.newCategory = {
      name: '',
      annualKilometers: '',
      leasingDuration: '',
      employeeContribution: { enabled: false, amount: 0 },
      cleaningCost: { enabled: false, amount: 0 },
      parkingCost: { enabled: false, amount: 0 },
      fuelCard: { enabled: false, amount: 0 }
    };
    // Keep fuel types selected
    this.selectedFuelTypes = ['diesel', 'electric', 'hybrid', 'petrol'];
    
    // Reset brand selection for new category
    this.selectedBrands = [];
    
    // Reset TCO related fields
    this.selectedReferenceCar = null;
    this.selectedReferenceCarData = null;
    this.calculatedTco = null;
    this.tcoResult = null;
    this.showTcoResults = false;
    this.editingCategory = null;
  }

  editCategory(category: any): void {
    this.editingCategory = category;
    
    // Populate form with category data
    this.newCategory = {
      name: category.name,
      annualKilometers: category.annualKilometers.toString(),
      leasingDuration: category.leasingDuration.toString(),
      employeeContribution: category.employeeContribution || { enabled: false, amount: 0 },
      cleaningCost: category.cleaningCost || { enabled: false, amount: 0 },
      parkingCost: category.parkingCost || { enabled: false, amount: 0 },
      fuelCard: category.fuelCard || { enabled: false, amount: 0 }
    };

    this.selectedFuelTypes = category.selectedFuelTypes || ['diesel', 'electric', 'hybrid', 'petrol'];
    this.selectedBrands = category.selectedBrands || [];

    // Set reference car if exists
    if (category.referenceCar) {
      this.selectedReferenceCar = category.referenceCar.id.toString();
      this.selectedReferenceCarData = category.referenceCar;
      this.calculatedTco = category.monthlyTco;
      this.tcoResult = category.tcoBreakdown ? { 
        vehicle: {
          id: category.referenceCar.id,
          brand: category.referenceCar.brand,
          model: category.referenceCar.model,
          description: category.referenceCar.description || '',
          fuelType: category.referenceCar.fuelType,
          co2Emissions: category.referenceCar.co2Emissions || 0,
          fuelConsumption: category.referenceCar.fuelConsumption || 0,
          price: category.referenceCar.price || 0
        },
        parameters: { 
          yearlyKm: category.annualKilometers, 
          duration: category.leasingDuration,
          estimatedMonthlyLeaseCost: category.monthlyTco || 0,
          estimatedMonthlyFuelCost: 0
        },
        tcoBreakdown: category.tcoBreakdown,
        totalAnnualTCO: category.monthlyTco * 12,
        totalMonthlyTCO: category.monthlyTco,
        additionalCosts: [],
        monthlyAdjustments: []
      } : null;
    }

    // Show the form
    this.showAddCategoryForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteCategory(category: any): void {
    if (confirm('Are you sure you want to delete this car category? This action cannot be undone.')) {
      if (this.currentSessionId) {
        this.userSessionService.deleteCarCategory(this.currentSessionId, category.id).subscribe({
          next: (updatedSession) => {
            this.carCategories = updatedSession.carCategories || [];
            console.log('Category deleted successfully');
          },
          error: (error) => {
            console.error('Error deleting category:', error);
            // If session is invalid, redirect to login
            this.router.navigate(['/login']);
          }
        });
      } else {
        console.error('No current session ID for deletion');
        this.router.navigate(['/login']);
      }
    }
  }

  addCategory(): void {
    // Ensure we have a session before showing the form
    if (!this.currentSessionId) {
      // Try to create/load session, but if it fails, redirect to login
      this.createOrLoadSession();
      // Note: createOrLoadSession will handle the redirect if needed
    }
    
    // Reset form for new category
    this.resetNewCategoryForm();
    
    // Show the add category form (stays on current step)
    this.showAddCategoryForm = true;
    // Scroll to top when showing form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  createNewSession(): void {
    const partnerId = localStorage.getItem('partnerId');
    const userEmail = localStorage.getItem('userEmail');
    
    console.log('createNewSession called');
    console.log('partnerId from localStorage:', partnerId);
    console.log('userEmail from localStorage:', userEmail);
    
    if (!partnerId || !userEmail) {
      console.error('Missing partner ID or user email - redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    // Always create a new session
    const newSession = {
      signupId: partnerId,
      currentStep: 1, // Start from step 1
      selectedCalculationMethod: 0, // Default to no selection
      selectedFuelTypes: ['diesel', 'electric', 'hybrid', 'petrol'],
      selectedBrands: [],
      carCategories: []
    };
    
    this.userSessionService.create(newSession).subscribe({
      next: (session) => {
        this.currentSessionId = session.id;
        this.carCategories = session.carCategories || [];
        this.selectedCalculationMethod = session.selectedCalculationMethod || 0;
        this.selectedFuelTypes = session.selectedFuelTypes || ['diesel', 'electric', 'hybrid', 'petrol'];
        this.selectedBrands = session.selectedBrands || [];
        // Store the new session ID in localStorage
        localStorage.setItem('currentSessionId', session.id);
        console.log('Created new session:', this.currentSessionId);
      },
      error: (error) => {
        console.error('Error creating new session:', error);
        this.router.navigate(['/login']);
      }
    });
  }

  createOrLoadSession(): void {
    const partnerId = localStorage.getItem('partnerId');
    const userEmail = localStorage.getItem('userEmail');
    
    console.log('createOrLoadSession called');
    console.log('partnerId from localStorage:', partnerId);
    console.log('userEmail from localStorage:', userEmail);
    
    if (!partnerId || !userEmail) {
      console.error('Missing partner ID or user email - redirecting to login');
      console.error('partnerId missing:', !partnerId);
      console.error('userEmail missing:', !userEmail);
      this.router.navigate(['/login']);
      return;
    }

    // Try to find existing session first
    this.userSessionService.findByUserEmail(userEmail).subscribe({
      next: (sessions) => {
        if (sessions && sessions.length > 0) {
          // Use the most recent session
          const session = sessions[0];
          this.currentSessionId = session.id;
          this.carCategories = session.carCategories || [];
          this.selectedCalculationMethod = session.selectedCalculationMethod || 0;
          this.selectedFuelTypes = session.selectedFuelTypes || ['diesel', 'electric', 'hybrid', 'petrol'];
          this.selectedBrands = session.selectedBrands || [];
          
          // Set currentStep based on session currentStep
          this.currentStep = session.currentStep || 1;
          console.log(`🔧 Using session currentStep: ${this.currentStep}`);
          
          // Set document status based on current step and session status
          this.documentStatus = this.getValidDocumentStatus(this.currentStep, session.documentStatus || 'draft') as 'draft' | 'pending' | 'submitted' | 'approved' | 'rejected';
          console.log(`🔧 Step ${this.currentStep}: Document status set to ${this.documentStatus}`);
          
          // Store the session ID in localStorage
          localStorage.setItem('currentSessionId', session.id);
          console.log('Loaded existing session:', this.currentSessionId);
          
          // Update steps to reflect the correct currentStep
          this.updateSteps();
          
          // Validate category statuses after loading
          this.validateCategoryStatuses();
        } else {
          // Create new session
          const newSession = {
            signupId: partnerId,
            currentStep: 4,
            selectedCalculationMethod: 0, // Default to no selection
            selectedFuelTypes: ['diesel', 'electric', 'hybrid', 'petrol'],
            selectedBrands: [],
            carCategories: []
          };
          
          this.userSessionService.create(newSession).subscribe({
            next: (session) => {
              this.currentSessionId = session.id;
              this.carCategories = session.carCategories || [];
              this.selectedCalculationMethod = session.selectedCalculationMethod || 0;
              this.selectedFuelTypes = session.selectedFuelTypes || ['diesel', 'electric', 'hybrid', 'petrol'];
              this.selectedBrands = session.selectedBrands || [];
              // Store the session ID in localStorage
              localStorage.setItem('currentSessionId', session.id);
              console.log('Created new session:', this.currentSessionId);
              // Validate category statuses after loading
              this.validateCategoryStatuses();
            },
            error: (error) => {
              console.error('Error creating session:', error);
              // If we can't create a session, redirect to login
              this.router.navigate(['/login']);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error loading sessions:', error);
        // If we can't load sessions, redirect to login
        this.router.navigate(['/login']);
      }
    });
  }

  hasCategories(): boolean {
    return this.carCategories.length > 0;
  }

  canProceedToReview(): boolean {
    // Check if there are categories
    if (this.carCategories.length === 0) {
      return false;
    }
    
    // Check if all categories have success status AND have TCO calculations
    return this.carCategories.every(category => 
      category.status === 'success' && 
      category.monthlyTco && 
      category.referenceCar
    );
  }

  hasCategoriesWithErrorStatus(): boolean {
    return this.carCategories.some(category => 
      category.status !== 'success' || 
      !category.monthlyTco || 
      !category.referenceCar
    );
  }

  /**
   * Validate and correct category statuses
   * This ensures that categories only have 'success' status if they have both TCO and reference car
   */
  validateCategoryStatuses(): void {
    this.carCategories.forEach(category => {
      const shouldBeSuccess = category.monthlyTco && category.referenceCar;
      if (category.status === 'success' && !shouldBeSuccess) {
        // Force update the category to correct status
        const correctedCategory = {
          ...category,
          status: 'pending'
        };
        
        this.userSessionService.updateCarCategory(this.currentSessionId!, category.id, correctedCategory).subscribe({
          next: (updatedSession) => {
            this.carCategories = updatedSession.carCategories || [];
            console.log(`Corrected status for category ${category.name}`);
          },
          error: (error) => {
            console.error(`Error correcting status for category ${category.name}:`, error);
          }
        });
      }
    });
  }

  areTopFieldsFilled(): boolean {
    // Auto's moeten altijd getoond worden, ongeacht of er merken zijn geselecteerd
    // We controleren alleen of de basis parameters zijn ingevuld
    return this.newCategory.annualKilometers !== '' && 
           this.newCategory.leasingDuration !== '';
  }

  canGenerateDocument(): boolean {
    // Check if we have car categories and if they all have valid TCO
    if (!this.carCategories || this.carCategories.length === 0) {
      return false;
    }
    
    // All categories must have a valid monthlyTco and referenceCar
    return this.carCategories.every(category => 
      category.monthlyTco && 
      category.referenceCar && 
      category.status === 'success'
    );
  }

  submitForReview(): void {
    if (!this.canGenerateDocument()) {
      console.log('Cannot submit for review: not all categories have valid TCO');
      return;
    }

    console.log('Submitting document for review...');
    
    // Generate the document first
    this.saveTcoDocument();
    
    // Update the document status to 'pending'
    this.documentStatus = 'pending';
    
    // Save the session with the new status
    if (this.currentSessionId) {
      this.saveSession();
    }
    
    console.log('Document submitted for review successfully');
  }

  inspireMe(): void {
    console.log('Inspire me button clicked');
    console.log('Current session ID:', this.currentSessionId);
    
    if (!this.currentSessionId) {
      console.error('No session ID available for inspire me');
      return;
    }

    // First, get all available parameter combinations from the database
    console.log('Loading available parameter combinations...');
    this.vehiclesService.getReferenceCars(1, 1000, {}).subscribe({
      next: (data) => {
        console.log('Received all cars data:', data);
        const allCars = data.cars;
        console.log('Total cars found:', allCars.length);
        
        if (allCars.length === 0) {
          console.error('No cars available in database');
          return;
        }

        // Extract unique combinations of yearlyKm and duration
        const combinations = new Set<string>();
        allCars.forEach(car => {
          if (car.yearly_km && car.duration) {
            combinations.add(`${car.yearly_km}-${car.duration}`);
          }
        });

        const availableCombinations = Array.from(combinations).map(combo => {
          const [yearlyKm, duration] = combo.split('-').map(Number);
          return { yearlyKm, duration };
        });

        console.log('Available combinations:', availableCombinations);

        if (availableCombinations.length === 0) {
          console.error('No valid parameter combinations found');
          return;
        }

        // Select a random combination
        const randomIndex = Math.floor(Math.random() * availableCombinations.length);
        const selectedCombination = availableCombinations[randomIndex];
        
        console.log('Selected random combination - yearlyKm:', selectedCombination.yearlyKm, 'duration:', selectedCombination.duration);

        // Now load cars with the selected combination
        this.loadCarsForInspireMe(selectedCombination.yearlyKm, selectedCombination.duration);
      },
      error: (error) => {
        console.error('Error loading parameter combinations:', error);
      }
    });
  }

  private loadCarsForInspireMe(yearlyKm: number, duration: number): void {
    console.log('Loading cars for inspire me with parameters - yearlyKm:', yearlyKm, 'duration:', duration);
    
    this.vehiclesService.getReferenceCars(1, 100, {
      yearlyKm: yearlyKm,
      duration: duration
    }).subscribe({
      next: (data) => {
        console.log('Received data from getReferenceCars:', data);
        const availableCars = data.cars;
        console.log('Available cars found:', availableCars.length);
        
        if (availableCars.length < 3) {
          console.error('Not enough cars available for inspire me');
          return;
        }

        // Sort cars by price to determine segments
        const sortedCars = availableCars.sort((a: any, b: any) => (a.price || 0) - (b.price || 0));
        
        // Ensure we have at least 3 cars and select from different segments
        if (sortedCars.length < 3) {
          console.error('Not enough cars available for inspire me (need at least 3)');
          return;
        }
        
        // Select cars from different segments - ensure good distribution
        const lowSegmentCar = sortedCars[0]; // Cheapest (low segment)
        const midSegmentCar = sortedCars[Math.floor(sortedCars.length * 0.5)]; // Middle segment (50th percentile)
        const highSegmentCar = sortedCars[Math.floor(sortedCars.length * 0.8)]; // High segment (80th percentile)
        
        // Ensure we have three different cars
        const selectedCars = [lowSegmentCar, midSegmentCar, highSegmentCar];
        const uniqueCars = selectedCars.filter((car, index, self) => 
          index === self.findIndex(c => c.id === car.id)
        );
        
        // Determine final car selection
        let finalLowCar, finalMidCar, finalHighCar;
        
        if (uniqueCars.length < 3) {
          console.warn('Not enough unique cars, selecting from different price ranges');
          // If we don't have 3 unique cars, select from different price ranges
          const step = Math.floor(sortedCars.length / 3);
          finalLowCar = sortedCars[0];
          finalMidCar = sortedCars[step];
          finalHighCar = sortedCars[Math.min(step * 2, sortedCars.length - 1)];
        } else {
          finalLowCar = lowSegmentCar;
          finalMidCar = midSegmentCar;
          finalHighCar = highSegmentCar;
        }
        
        console.log('Selected cars for segments:');
        console.log('Low segment:', finalLowCar.brand, finalLowCar.model, 'Price:', finalLowCar.price);
        console.log('Mid segment:', finalMidCar.brand, finalMidCar.model, 'Price:', finalMidCar.price);
        console.log('High segment:', finalHighCar.brand, finalHighCar.model, 'Price:', finalHighCar.price);

        // Create three categories with descriptive names
        const categories = [
          {
            name: 'Budget Segment',
            annualKilometers: yearlyKm.toString(),
            leasingDuration: duration.toString(),
            employeeContribution: { enabled: false, amount: 0 },
            cleaningCost: { enabled: false, amount: 0 },
            parkingCost: { enabled: false, amount: 0 },
            fuelCard: { enabled: false, amount: 0 },
            selectedFuelTypes: [finalLowCar.fuel_type?.toLowerCase() || 'petrol'],
            selectedBrands: [finalLowCar.brand],
            referenceCar: {
              id: finalLowCar.id,
              brand: finalLowCar.brand,
              model: finalLowCar.model,
              fuelType: finalLowCar.fuel_type
            },
            monthlyTco: null,
            tcoBreakdown: null,
            status: 'pending' // Red dot - needs TCO calculation
          },
          {
            name: 'Mid-Range Segment',
            annualKilometers: yearlyKm.toString(),
            leasingDuration: duration.toString(),
            employeeContribution: { enabled: false, amount: 0 },
            cleaningCost: { enabled: false, amount: 0 },
            parkingCost: { enabled: false, amount: 0 },
            fuelCard: { enabled: false, amount: 0 },
            selectedFuelTypes: [finalMidCar.fuel_type?.toLowerCase() || 'petrol'],
            selectedBrands: [finalMidCar.brand],
            referenceCar: {
              id: finalMidCar.id,
              brand: finalMidCar.brand,
              model: finalMidCar.model,
              fuelType: finalMidCar.fuel_type
            },
            monthlyTco: null,
            tcoBreakdown: null,
            status: 'pending' // Red dot - needs TCO calculation
          },
          {
            name: 'Premium Segment',
            annualKilometers: yearlyKm.toString(),
            leasingDuration: duration.toString(),
            employeeContribution: { enabled: false, amount: 0 },
            cleaningCost: { enabled: false, amount: 0 },
            parkingCost: { enabled: false, amount: 0 },
            fuelCard: { enabled: false, amount: 0 },
            selectedFuelTypes: [finalHighCar.fuel_type?.toLowerCase() || 'petrol'],
            selectedBrands: [finalHighCar.brand],
            referenceCar: {
              id: finalHighCar.id,
              brand: finalHighCar.brand,
              model: finalHighCar.model,
              fuelType: finalHighCar.fuel_type
            },
            monthlyTco: null,
            tcoBreakdown: null,
            status: 'pending' // Red dot - needs TCO calculation
          }
        ];

        // Add all categories to the session
        this.addInspireMeCategories(categories);
      },
      error: (error) => {
        console.error('Error loading electric cars for inspire me:', error);
      }
    });
  }

  private addInspireMeCategories(categories: any[]): void {
    console.log('Starting to add inspire me categories:', categories.length);
    
    // Add categories sequentially to avoid race conditions
    this.addCategorySequentially(categories, 0);
  }

  private addCategorySequentially(categories: any[], index: number): void {
    if (index >= categories.length) {
      console.log('All inspire me categories processed successfully');
      return;
    }

    const category = categories[index];
    console.log(`Adding category ${index + 1}:`, category.name, 'with car:', category.referenceCar);
    
    this.userSessionService.addCarCategory(this.currentSessionId!, category).subscribe({
      next: (updatedSession) => {
        console.log(`Successfully added inspire me category ${index + 1}:`, category.name);
        this.carCategories = updatedSession.carCategories || [];
        
        // Add next category
        this.addCategorySequentially(categories, index + 1);
      },
      error: (error) => {
        console.error(`Error adding inspire me category ${index + 1}:`, error);
        
        // Continue with next category even if this one failed
        this.addCategorySequentially(categories, index + 1);
      }
    });
  }

  private saveTcoDocument(): void {
    if (!this.currentSessionId) {
      console.error('No session ID available for saving TCO document');
      return;
    }

    this.isGeneratingDocument = true;
    console.log('Saving TCO document to Google Cloud Storage...');
    
    // Prepare TCO data for document generation
    const tcoData = {
      sessionId: this.currentSessionId,
      partnerId: this.partner || 'unknown',
      userEmail: this.userEmail || 'unknown',
      carCategories: this.carCategories,
      selectedCalculationMethod: this.selectedCalculationMethod,
      selectedFuelTypes: this.selectedFuelTypes,
      selectedBrands: this.selectedBrands,
      uploadedFiles: this.uploadedFiles,
      companyName: this.companyName || 'Company Name',
      generatedAt: new Date().toISOString(),
      documentStatus: 'pending'
    };

    this.userSessionService.saveTcoDocument(this.currentSessionId, tcoData).subscribe({
      next: (response) => {
        this.isGeneratingDocument = false;
        if (response.success) {
          console.log('✅ TCO document saved successfully:', response.documentUrls);
          this.documentUrls = response.documentUrls;
          this.documentStatus = 'pending';
          // Load document content using the session ID and default language
          const defaultLanguage = Object.keys(response.documentUrls)[0] || 'en';
          this.selectedLanguage = defaultLanguage as any;
          this.loadDocumentContent(this.currentSessionId!, defaultLanguage);
        } else {
          console.error('❌ Failed to save TCO document:', response.message);
          this.documentContent = this.translate('errorGeneratingDocument');
        }
      },
      error: (error) => {
        this.isGeneratingDocument = false;
        console.error('❌ Error saving TCO document:', error);
        this.documentContent = this.translate('errorGeneratingDocument');
      }
    });
  }

  private updateSessionWithDocumentInfo(documentUrl: string, status: string): void {
    if (!this.currentSessionId) return;

    const updateData = {
      documentUrl: documentUrl,
      documentStatus: status,
      lastActivityAt: new Date()
    };

    console.log('Updating session with document info:', updateData);

    this.userSessionService.update(this.currentSessionId, updateData).subscribe({
      next: (response) => {
        console.log('Session updated with document info:', response);
      },
      error: (error) => {
        console.error('Error updating session:', error);
      }
    });
  }

  // Method to automatically generate document for partners if not exists
  private ensureDocumentExists(): void {
    if (!this.currentSessionId || !this.isPartnerMode) return;
    
    // If no document URLs exist and we have car categories, generate the document
    if ((!this.documentUrls || Object.keys(this.documentUrls).length === 0) && this.carCategories && this.carCategories.length > 0) {
      console.log('Auto-generating TCO document for partner...');
      this.saveTcoDocument();
    }
  }

  // Helper method to get available languages
  getAvailableLanguages(): string[] {
    const languages = Object.keys(this.documentUrls || {});
    console.log(`🌍 Available languages: ${languages.join(', ')}`);
    console.log(`📊 Document URLs:`, this.documentUrls);
    console.log(`📊 Language cache:`, this.languageContentCache);
    return languages;
  }

  // Switch document language
  switchDocumentLanguage(language: 'en' | 'nl' | 'fr'): void {
    console.log(`🔄 Attempting to switch to language: ${language}`);
    console.log(`📊 Current session ID: ${this.currentSessionId}`);
    console.log(`📊 Available document URLs:`, this.documentUrls);
    console.log(`📊 Language cache:`, this.languageContentCache);
    console.log(`📊 Available languages: ${this.getAvailableLanguages().join(', ')}`);
    
    if (this.currentSessionId && this.documentUrls[language]?.previewUrl) {
      console.log(`🔄 Switching to language: ${language}`);
      this.documentLanguage = language as any;
      
      // CRITICAL: Always load content from backend to ensure correct template language
      // This ensures that each language shows the correct template with updated content
      console.log(`📥 Loading content for language: ${language} from backend`);
      this.loadDocumentContent(this.currentSessionId, language);
      
      // Clear the cache for this language to force fresh content
      delete this.languageContentCache[language];
    } else {
      console.warn(`⚠️ Cannot switch to language ${language}: no preview URL available`);
      console.warn(`⚠️ Session ID: ${this.currentSessionId}`);
      console.warn(`⚠️ Document URLs for ${language}:`, this.documentUrls[language]);
      console.warn(`⚠️ All documentUrls:`, this.documentUrls);
      console.warn(`⚠️ Available languages: ${this.getAvailableLanguages().join(', ')}`);
    }
    
    // Debug: Show current state after language switch
    console.log(`🔍 After language switch to ${language}:`);
    console.log(`🔍 Document language: ${this.documentLanguage}`);
    console.log(`🔍 Document content length: ${this.documentContent?.length || 0}`);
  }

  // Document content loading
  private loadDocumentContent(sessionId: string, language: string = 'en'): void {
    console.log(`📥 Loading document content for session: ${sessionId}, language: ${language}`);
    
    if (!sessionId) {
      console.error('No session ID available for loading document content');
      return;
    }

    // Set loading message
    this.documentContent = this.translate('generatingPolicyDocuments');

    this.userSessionService.getDocumentContent(sessionId, language).subscribe({
      next: (response) => {
        console.log(`📥 Response received for language ${language}:`, response);
        
        if (response.success) {
          // Cache the loaded content for this language
          this.languageContentCache[language] = response.content;
          
          // Always update the displayed content when loading for the current document language
          if (this.documentLanguage === language) {
            this.documentContent = response.content;
          }
          
          console.log(`✅ Document content loaded successfully for language: ${language}`);
          console.log(`📊 Content length: ${response.content?.length || 0} characters`);
          console.log(`📊 Cache updated for language: ${language}`);
        } else {
          console.error('❌ Failed to load document content:', response.message);
          if (this.documentLanguage === language) {
            this.documentContent = this.translate('errorLoadingDocument');
          }
        }
      },
      error: (error) => {
        console.error('❌ Error loading document content:', error);
        if (this.documentLanguage === language) {
          this.documentContent = this.translate('errorLoadingDocument');
        }
      }
    });
  }

  // Document iframe event handlers
  onDocumentLoad(): void {
    console.log('✅ Document loaded successfully in iframe');
  }

  onDocumentError(): void {
    console.log('⚠️ Document failed to load in iframe, showing fallback content');
    // You could set a flag here to show fallback content
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  loadCarBrands(): void {
    this.vehiclesService.getBrands().subscribe({
      next: (brands: string[]) => {
        this.carBrands = brands;
        console.log('Loaded car brands from database:', brands);
      },
      error: (error) => {
        console.error('Error loading car brands from database:', error);
        this.carBrands = []; // Empty array if API fails
      }
    });
  }

  loadTcoDistribution(): void {
    // Only load if top fields are filled
    if (!this.areTopFieldsFilled()) {
      // If no fields are filled, load with default values for initial display
      this.loadTcoDistributionWithDefaults();
      return;
    }

    this.isLoadingTcoData = true;
    
    // Only filter if values are actually selected (not empty strings)
    const yearlyKm = this.newCategory.annualKilometers && this.newCategory.annualKilometers !== '' ? parseInt(this.newCategory.annualKilometers, 10) : undefined;
    const duration = this.newCategory.leasingDuration && this.newCategory.leasingDuration !== '' ? parseInt(this.newCategory.leasingDuration, 10) : undefined;
    
    // Map frontend fuel types to database values
    const fuelTypes = this.selectedFuelTypes.map(type => {
      switch(type) {
        case 'diesel': return 'Diesel';
        case 'electric': return 'Électrique';
        case 'hybrid': return 'Hybride';
        case 'petrol': return 'Essence';
        default: return type;
      }
    }).filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
    
    // Don't apply TCO range filter to distribution query - we want to see the full range
    this.vehiclesService.getTcoDistribution(yearlyKm, duration, this.selectedBrands, fuelTypes).subscribe({
      next: (distribution: any[]) => {
        this.tcoDistribution = distribution;
        console.log('Loaded TCO distribution:', distribution);
        this.isLoadingTcoData = false;
        // Initialize TCO range when distribution changes
        this.initializeTcoRange();
        // Update available filters after loading TCO distribution
        this.updateAvailableFilters();
      },
      error: (error) => {
        console.error('Error loading TCO distribution:', error);
        this.tcoDistribution = [];
        this.isLoadingTcoData = false;
      }
    });
  }

  onAnnualKilometersChange(): void {
    this.loadTcoDistribution();
    this.currentPage = 1; // Reset to first page
    this.loadReferenceCars();
  }

  onLeasingDurationChange(): void {
    this.loadTcoDistribution();
    this.currentPage = 1; // Reset to first page
    this.loadReferenceCars();
  }

  onBrandSelectionChange(brand: string, isChecked: boolean): void {
    if (isChecked) {
      if (!this.selectedBrands.includes(brand)) {
        this.selectedBrands.push(brand);
      }
    } else {
      this.selectedBrands = this.selectedBrands.filter(b => b !== brand);
    }
    // Reset car filter when other filters change
    this.isCarFilterActive = false;
    this.loadTcoDistribution();
    this.currentPage = 1; // Reset to first page
    this.loadReferenceCars();
    this.updateAvailableFilters();
  }

  getBarHeight(count: number): string {
    if (this.tcoDistribution.length === 0) return '2px';
    const maxCount = Math.max(...this.tcoDistribution.map(item => item.count));
    const percentage = (count / maxCount) * 100;
    const minHeight = 2;
    const maxHeight = 100;
    const height = Math.max(minHeight, (percentage / 100) * maxHeight);
    return `${height}%`;
  }

  getMinTco(): number {
    if (this.tcoDistribution.length === 0) return 0;
    return this.tcoDistribution[0].globalMinTco;
  }

  getMaxTco(): number {
    if (this.tcoDistribution.length === 0) return 0;
    return this.tcoDistribution[0].globalMaxTco;
  }

  getAllTcoRanges(): number[] {
    if (this.tcoDistribution.length === 0) return [];
    const minTco = this.getMinTco();
    const maxTco = this.getMaxTco();
    const ranges: number[] = [];
    
    for (let i = minTco; i <= maxTco; i += 10) {
      ranges.push(i);
    }
    
    return ranges;
  }

  getCountForRange(range: number): number {
    const item = this.tcoDistribution.find(d => d.minTco === range);
    return item ? item.count : 0;
  }

  isBarGreyedOut(range: number): boolean {
    // Grey out bars that are outside the slider range
    return range < this.tcoRangeMin || range > this.tcoRangeMax;
  }

  updateAvailableFilters(): void {
    // Only update if top fields are filled
    if (!this.areTopFieldsFilled()) {
      this.availableBrands = [];
      this.availableFuelTypes = [];
      return;
    }

    const yearlyKm = this.newCategory.annualKilometers && this.newCategory.annualKilometers !== '' ? parseInt(this.newCategory.annualKilometers, 10) : undefined;
    const duration = this.newCategory.leasingDuration && this.newCategory.leasingDuration !== '' ? parseInt(this.newCategory.leasingDuration, 10) : undefined;
    
    // Map frontend fuel types to database values
    const fuelTypes = this.selectedFuelTypes.map(type => {
      switch(type) {
        case 'diesel': return 'Diesel';
        case 'electric': return 'Électrique';
        case 'hybrid': return 'Hybride';
        case 'petrol': return 'Essence';
        default: return type;
      }
    }).filter((value, index, self) => self.indexOf(value) === index);

    this.vehiclesService.getAvailableFilters(yearlyKm, duration, this.selectedBrands, fuelTypes).subscribe({
      next: (filters: any) => {
        this.availableBrands = filters.availableBrands;
        this.availableFuelTypes = filters.availableFuelTypes;
        console.log('Updated available filters:', filters);
      },
      error: (error: any) => {
        console.error('Error updating available filters:', error);
        this.availableBrands = [];
        this.availableFuelTypes = [];
      }
    });
  }

  // Reference cars methods
  loadReferenceCars(): void {
    // Only load if top fields are filled
    if (!this.areTopFieldsFilled()) {
      this.referenceCars = [];
      this.totalPages = 0;
      this.totalCars = 0;
      this.isLoadingReferenceCars = false;
      this.isCarFilterActive = false; // Reset filter when no data
      return;
    }

    this.isLoadingReferenceCars = true;
    
    // Map frontend fuel types to database values
    const fuelTypes = this.selectedFuelTypes.map(type => {
      switch(type) {
        case 'diesel': return 'Diesel';
        case 'electric': return 'Électrique';
        case 'hybrid': return 'Hybride';
        case 'petrol': return 'Essence';
        default: return type;
      }
    }).filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
    
    const filters = {
      yearlyKm: this.newCategory.annualKilometers && this.newCategory.annualKilometers !== '' ? parseInt(this.newCategory.annualKilometers, 10) : undefined,
      duration: this.newCategory.leasingDuration && this.newCategory.leasingDuration !== '' ? parseInt(this.newCategory.leasingDuration, 10) : undefined,
      brands: this.selectedBrands,
      fuelTypes: fuelTypes,
      minTco: this.tcoRangeMin,
      maxTco: this.tcoRangeMax
    };

    this.vehiclesService.getReferenceCars(this.currentPage, 10, filters).subscribe({
      next: (data) => {
        this.referenceCars = data.cars;
        this.totalPages = data.totalPages;
        this.totalCars = data.total;
        this.isLoadingReferenceCars = false;
        
        // Update allReferenceCars if not filtered (for clear filter functionality)
        if (!this.isCarFilterActive) {
          // Load all cars to populate allReferenceCars for filtering
          this.loadAllReferenceCarsForFilter();
        }
        
        // Update available filters after loading reference cars
        this.updateAvailableFilters();
        // Reload TCO distribution to show filtered data
        this.loadTcoDistribution();
      },
      error: (error) => {
        console.error('Error loading reference cars:', error);
        this.isLoadingReferenceCars = false;
      }
    });
  }

  onReferenceCarSelectionChange(carId: string): void {
    this.selectedReferenceCar = carId;
    // Reset TCO details when changing reference car
    this.tcoCalculationDetails = [];
    // Calculate TCO for the selected vehicle only if top fields are filled
    if (this.areTopFieldsFilled()) {
      this.calculateTCOForVehicle(carId);
    }
  }

  // Car filter modal methods
  openCarFilter(): void {
    this.showCarFilter = true;
    this.carFilterSearch = '';
    this.loadAllReferenceCars();
  }

  closeCarFilter(): void {
    this.showCarFilter = false;
    this.carFilterSearch = '';
    this.filteredCarGroups = [];
    this.selectedCarsInFilter = [];
  }

  clearCarFilter(): void {
    // Reset the reference cars to show all cars again
    this.isCarFilterActive = false;
    this.selectedCarsInFilter = [];
    
    // Restore the original reference cars list
    this.referenceCars = [...this.allReferenceCars];
    
    // Update pagination info for unfiltered results
    this.totalCars = this.referenceCars.length;
    this.totalPages = Math.ceil(this.totalCars / 10);
    this.currentPage = 1; // Reset to first page
    
    // Reload TCO distribution to show unfiltered data
    this.loadTcoDistribution();
  }

  loadAllReferenceCars(): void {
    // Load all reference cars without pagination for the filter
    const filters = {
      yearlyKm: this.newCategory.annualKilometers && this.newCategory.annualKilometers !== '' ? parseInt(this.newCategory.annualKilometers, 10) : undefined,
      duration: this.newCategory.leasingDuration && this.newCategory.leasingDuration !== '' ? parseInt(this.newCategory.leasingDuration, 10) : undefined,
      brands: this.selectedBrands,
      fuelTypes: this.selectedFuelTypes.map(type => {
        switch(type) {
          case 'diesel': return 'Diesel';
          case 'electric': return 'Électrique';
          case 'hybrid': return 'Hybride';
          case 'petrol': return 'Essence';
          default: return type;
        }
      }).filter((value, index, self) => self.indexOf(value) === index),
      minTco: this.tcoRangeMin,
      maxTco: this.tcoRangeMax
    };

    this.vehiclesService.getReferenceCars(1, 1000, filters).subscribe({
      next: (data) => {
        this.allReferenceCars = data.cars;
        this.groupCarsByBrand();
      },
      error: (error) => {
        console.error('Error loading all reference cars:', error);
        this.allReferenceCars = [];
      }
    });
  }

  loadAllReferenceCarsForFilter(): void {
    // Load all reference cars without pagination for the filter (background loading)
    const filters = {
      yearlyKm: this.newCategory.annualKilometers && this.newCategory.annualKilometers !== '' ? parseInt(this.newCategory.annualKilometers, 10) : undefined,
      duration: this.newCategory.leasingDuration && this.newCategory.leasingDuration !== '' ? parseInt(this.newCategory.leasingDuration, 10) : undefined,
      brands: this.selectedBrands,
      fuelTypes: this.selectedFuelTypes.map(type => {
        switch(type) {
          case 'diesel': return 'Diesel';
          case 'electric': return 'Électrique';
          case 'hybrid': return 'Hybride';
          case 'petrol': return 'Essence';
          default: return type;
        }
      }).filter((value, index, self) => self.indexOf(value) === index),
      minTco: this.tcoRangeMin,
      maxTco: this.tcoRangeMax
    };

    this.vehiclesService.getReferenceCars(1, 1000, filters).subscribe({
      next: (data) => {
        this.allReferenceCars = data.cars;
      },
      error: (error) => {
        console.error('Error loading all reference cars for filter:', error);
        this.allReferenceCars = [];
      }
    });
  }

  groupCarsByBrand(): void {
    // Group by brand and main model (remove motorization details)
    const grouped = this.allReferenceCars.reduce((groups: any, car: any) => {
      const brand = car.brand;
      const mainModel = this.getMainModel(car.model);
      
      if (!groups[brand]) {
        groups[brand] = [];
      }
      
      // Check if this main model already exists
      const existingModel = groups[brand].find((m: any) => m.model === mainModel);
      if (existingModel) {
        // Keep the one with the lowest TCO
        if (car.monthlyTco < existingModel.monthlyTco) {
          const index = groups[brand].indexOf(existingModel);
          groups[brand][index] = { ...car, model: mainModel };
        }
      } else {
        groups[brand].push({ ...car, model: mainModel });
      }
      
      return groups;
    }, {});

    this.filteredCarGroups = Object.keys(grouped).map(brand => ({
      brand,
      models: grouped[brand].sort((a: any, b: any) => a.model.localeCompare(b.model))
    })).sort((a, b) => a.brand.localeCompare(b.brand));
  }

  getMainModel(modelName: string): string {
    // Remove motorization details and keep only the main model name
    // Examples: "A3 2.0 TDI" -> "A3", "Golf 1.6 TSI" -> "Golf"
    return modelName.split(' ')[0];
  }

  filterCars(): void {
    if (!this.carFilterSearch.trim()) {
      this.groupCarsByBrand();
      return;
    }

    const searchTerm = this.carFilterSearch.toLowerCase();
    const filtered = this.allReferenceCars.filter((car: any) => 
      car.brand.toLowerCase().includes(searchTerm) ||
      this.getMainModel(car.model).toLowerCase().includes(searchTerm) ||
      (car.description && car.description.toLowerCase().includes(searchTerm))
    );

    // Use the same grouping logic as groupCarsByBrand
    const grouped = filtered.reduce((groups: any, car: any) => {
      const brand = car.brand;
      const mainModel = this.getMainModel(car.model);
      
      if (!groups[brand]) {
        groups[brand] = [];
      }
      
      const existingModel = groups[brand].find((m: any) => m.model === mainModel);
      if (existingModel) {
        if (car.monthlyTco < existingModel.monthlyTco) {
          const index = groups[brand].indexOf(existingModel);
          groups[brand][index] = { ...car, model: mainModel };
        }
      } else {
        groups[brand].push({ ...car, model: mainModel });
      }
      
      return groups;
    }, {});

    this.filteredCarGroups = Object.keys(grouped).map(brand => ({
      brand,
      models: grouped[brand].sort((a: any, b: any) => a.model.localeCompare(b.model))
    })).sort((a, b) => a.brand.localeCompare(b.brand));
  }

  isCarSelected(carId: string): boolean {
    return this.selectedCarsInFilter.includes(carId);
  }

  toggleCarSelection(car: any): void {
    const carId = car.id.toString();
    const index = this.selectedCarsInFilter.indexOf(carId);
    
    if (index > -1) {
      this.selectedCarsInFilter.splice(index, 1);
    } else {
      this.selectedCarsInFilter.push(carId);
    }
  }

  applyCarFilter(): void {
    if (this.selectedCarsInFilter.length > 0) {
      // Filter the reference cars to only show the selected ones
      this.referenceCars = this.allReferenceCars.filter((car: any) => 
        this.selectedCarsInFilter.includes(car.id.toString())
      );
      
      // Update pagination info for filtered results
      this.totalCars = this.referenceCars.length;
      this.totalPages = Math.ceil(this.totalCars / 10);
      this.currentPage = 1; // Reset to first page
      
      // Select the first car from the filtered results
      this.selectedReferenceCar = this.selectedCarsInFilter[0];
      
      // Mark filter as active
      this.isCarFilterActive = true;
      
      // Reload TCO distribution to show filtered data
      this.loadTcoDistribution();
      
      this.closeCarFilter();
    }
  }

  // Sorting methods
  sortByTco(): void {
    if (this.tcoSortDirection === null || this.tcoSortDirection === 'desc') {
      this.tcoSortDirection = 'asc';
    } else {
      this.tcoSortDirection = 'desc';
    }
    
    this.referenceCars.sort((a, b) => {
      const tcoA = a.monthlyTco || 0;
      const tcoB = b.monthlyTco || 0;
      
      if (this.tcoSortDirection === 'asc') {
        return tcoA - tcoB;
      } else {
        return tcoB - tcoA;
      }
    });
  }

  calculateTCOForVehicle(carId: string): void {
    // Find the vehicle in the current page by ID
    const vehicle = this.referenceCars.find(car => car.id.toString() === carId);
    
    if (!vehicle) {
      console.error('Vehicle not found:', carId);
      return;
    }

    // Only calculate TCO if top fields are filled
    if (!this.areTopFieldsFilled()) {
      console.log('Top fields not filled, skipping TCO calculation');
      this.selectedReferenceCarData = vehicle;
      this.tcoCalculationDetails = []; // Reset TCO details
      return;
    }

    this.selectedReferenceCarData = vehicle;
    console.log('Calculating TCO for vehicle:', vehicle);

    // Prepare additional costs from the form
    // These are costs that ADD to the TCO (cleaning, parking, fuel card)
    const additionalCosts = [];
    if (this.newCategory.cleaningCost.enabled) {
      additionalCosts.push({
        label: 'Vehicle Cleaning Cost',
        amount: this.newCategory.cleaningCost.amount
      });
    }
    if (this.newCategory.parkingCost.enabled) {
      additionalCosts.push({
        label: 'Parking/Storage Cost',
        amount: this.newCategory.parkingCost.amount
      });
    }
    if (this.newCategory.fuelCard.enabled) {
      additionalCosts.push({
        label: 'Limited Fuel Card',
        amount: this.newCategory.fuelCard.amount
      });
    }

    // Prepare monthly adjustments (can be positive or negative)
    // Employee contribution REDUCES the TCO, so it should be negative
    const monthlyAdjustments = [];
    if (this.newCategory.employeeContribution.enabled) {
      monthlyAdjustments.push({
        label: 'Employee Contribution',
        amount: -this.newCategory.employeeContribution.amount // Negative to reduce TCO
      });
    }

    const yearlyKm = this.newCategory.annualKilometers && this.newCategory.annualKilometers !== '' 
      ? parseInt(this.newCategory.annualKilometers, 10) 
      : 15000; // Default value

    const duration = this.newCategory.leasingDuration && this.newCategory.leasingDuration !== '' 
      ? parseInt(this.newCategory.leasingDuration, 10) 
      : 48; // Default value

    console.log('Sending TCO calculation request with vehicle ID:', vehicle.id);
    
    this.vehiclesService.calculateVehicleTCO({
      vehicleId: parseInt(vehicle.id),
      yearlyKm,
      duration,
      additionalCosts,
      monthlyAdjustments
    }).subscribe({
      next: (result) => {
        console.log('TCO Calculation Result:', result);
        this.tcoResult = result;
        this.calculatedTco = result.totalMonthlyTCO;
        this.tcoCalculationDetails = result.tcoBreakdown || [];
        // this.showTcoResults = true; // Disabled popup
        console.log('TCO Results calculated but popup disabled');
        
        // Update the selected reference car with TCO information
        if (this.selectedReferenceCarData) {
          this.selectedReferenceCarData.monthlyTco = result.totalMonthlyTCO;
          this.selectedReferenceCarData.tcoBreakdown = result.tcoBreakdown;
        }
      },
      error: (error) => {
        console.error('Error calculating TCO:', error);
        this.tcoCalculationDetails = []; // Reset TCO details on error
      }
    });
  }

  // Method to recalculate TCO when form fields change
  recalculateTCO(): void {
    if (this.selectedReferenceCarData && this.selectedReferenceCar && this.areTopFieldsFilled()) {
      // Recalculate TCO for the currently selected car
      this.calculateTCOForVehicle(this.selectedReferenceCar);
    }
  }

  // Method to reset reference car when top-level parameters change
  resetReferenceCar(): void {
    this.selectedReferenceCar = null;
    this.selectedReferenceCarData = null;
    this.calculatedTco = null;
    this.referenceCars = [];
    this.totalPages = 0;
    this.totalCars = 0;
    // Reset brand selection when reference car is reset
    this.selectedBrands = [];
  }

  // Watch for changes in the top-level form fields
  onTopFieldsChange(): void {
    // Reset reference car configuration when top fields change
    this.resetReferenceCar();
    
    // Reset car filter when top-level parameters change
    this.isCarFilterActive = false;
    
    // Update available filters and load reference cars with new parameters
    if (this.areTopFieldsFilled()) {
      this.updateAvailableFilters();
      this.loadReferenceCars();
      this.loadTcoDistribution();
    }
    
    // If there was a selected reference car, recalculate TCO with new parameters
    if (this.selectedReferenceCar && this.areTopFieldsFilled()) {
      this.calculateTCOForVehicle(this.selectedReferenceCar);
    }
  }

  // Watch for changes in the additional cost fields
  onAdditionalCostsChange(): void {
    // Recalculate TCO when additional costs change
    this.recalculateTCO();
  }

  // Watch for changes in the input fields (only when a value is entered)
  onInputChange(fieldName: 'employeeContribution' | 'cleaningCost' | 'parkingCost' | 'fuelCard', value: number): void {
    // Only recalculate if the field is enabled and has a value
    const field = this.newCategory[fieldName];
    if (field && field.enabled && value > 0) {
      this.recalculateTCO();
    }
  }

  // Watch for changes in the toggle switches
  onToggleChange(fieldName: 'employeeContribution' | 'cleaningCost' | 'parkingCost' | 'fuelCard', enabled: boolean): void {
    if (!enabled) {
      // When slider is turned OFF, clear the amount and recalculate TCO
      this.newCategory[fieldName].amount = 0;
      this.recalculateTCO();
    }
    // When slider is turned ON, don't recalculate until a value is entered
  }

  onTcoResultsClose(): void {
    this.showTcoResults = false;
    this.tcoResult = null;
  }







  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadReferenceCars();
    }
  }

  formatCurrency(amount: number): string {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '€0,00';
    }
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  getPaginationRange(): number[] {
    const range: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    
    return range;
  }

  getShowingRange(): string {
    const start = (this.currentPage - 1) * 10 + 1;
    const end = Math.min(this.currentPage * 10, this.totalCars);
    return `${start}-${end} of ${this.totalCars}`;
  }

  logout(): void {
    // TODO: Implement logout logic
    this.router.navigate(['/']);
  }

  // TCO Range Slider Methods
  private boundMoveHandler: ((e: MouseEvent | TouchEvent) => void) | null = null;
  private boundUpHandler: (() => void) | null = null;

  getSliderFillWidth(): string {
    if (this.tcoRangeMax === 0 && this.tcoRangeMin === 0) return '0%';
    const minPos = this.getMinSliderPosition();
    const maxPos = this.getMaxSliderPosition();
    
    // Bereken de breedte van de fill tussen de twee sliders
    const fillWidth = maxPos - minPos;
    
    // Zorg dat de fill altijd positief is en correct gepositioneerd
    return `${Math.max(0, fillWidth)}%`;
  }

  getMinSliderPosition(): number {
    if (this.tcoDistribution.length === 0) return 0;
    const minTco = this.getMinTco();
    const maxTco = this.getMaxTco();
    if (maxTco === minTco) return 0;
    
    // Bereken positie als percentage van de totale breedte
    // Zorg dat de slider exact op de horizontale as van de grafiek staat
    // De slider moet gelijk staan met de grafiek balken (met padding van 10px aan elke kant)
    const position = ((this.tcoRangeMin - minTco) / (maxTco - minTco)) * 100;
    
    // Begrens de positie tussen 0% en 100%
    return Math.max(0, Math.min(100, position));
  }

  getMaxSliderPosition(): number {
    if (this.tcoDistribution.length === 0) return 100;
    const minTco = this.getMinTco();
    const maxTco = this.getMaxTco();
    if (maxTco === minTco) return 100;
    
    // Bereken positie als percentage van de totale breedte
    // Zorg dat de slider exact op de horizontale as van de grafiek staat
    // De slider moet gelijk staan met de grafiek balken (met padding van 10px aan elke kant)
    const position = ((this.tcoRangeMax - minTco) / (maxTco - minTco)) * 100;
    
    // Begrens de positie tussen 0% en 100%
    return Math.max(0, Math.min(100, position));
  }

  startSliderDrag(slider: 'min' | 'max', event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    this.isDraggingSlider = true;
    this.activeSlider = slider;
    
    // Voeg dragging class toe aan de actieve slider handle
    const activeHandle = document.querySelector(`.slider-handle.${slider}-handle`) as HTMLElement;
    if (activeHandle) {
      activeHandle.classList.add('dragging');
    }
    
    // Create bound handlers to maintain proper 'this' context
    this.boundMoveHandler = this.onSliderDrag.bind(this);
    this.boundUpHandler = this.stopSliderDrag.bind(this);
    
    // The bound handlers are ready to use
    
    // Add event listeners
    document.addEventListener('mousemove', this.boundMoveHandler, { passive: false });
    document.addEventListener('touchmove', this.boundMoveHandler, { passive: false });
    document.addEventListener('mouseup', this.boundUpHandler);
    document.addEventListener('touchend', this.boundUpHandler);
  }

  onSliderDrag(event: MouseEvent | TouchEvent): void {
    if (!this.isDraggingSlider || !this.activeSlider) return;
    
    const sliderTrack = document.querySelector('.slider-track') as HTMLElement;
    if (!sliderTrack) return;
    
    const rect = sliderTrack.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const position = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    
    const minTco = this.getMinTco();
    const maxTco = this.getMaxTco();
    const value = minTco + (position / 100) * (maxTco - minTco);
    
    // Ensure minimum gap between sliders (5% of total range)
    const minGap = (maxTco - minTco) * 0.05;
    
    if (this.activeSlider === 'min') {
      // Min slider cannot go beyond max slider minus minimum gap
      this.tcoRangeMin = Math.min(value, this.tcoRangeMax - minGap);
      // Ensure min slider doesn't go below global minimum
      this.tcoRangeMin = Math.max(this.tcoRangeMin, minTco);
    } else {
      // Max slider cannot go below min slider plus minimum gap
      this.tcoRangeMax = Math.max(value, this.tcoRangeMin + minGap);
      // Ensure max slider doesn't go above global maximum
      this.tcoRangeMax = Math.min(this.tcoRangeMax, maxTco);
    }
    
    console.log(`Slider dragged: ${this.activeSlider} = €${this.activeSlider === 'min' ? this.tcoRangeMin : this.tcoRangeMax}`);
    
    // Don't apply filter during drag - only update the visual position
    // Filtering will happen when the user releases the slider
    // Update the UI immediately by updating the DOM directly
    this.updateSliderValues();
  }

  stopSliderDrag(): void {
    this.isDraggingSlider = false;
    
    // Verwijder dragging class van alle slider handles
    const handles = document.querySelectorAll('.slider-handle');
    handles.forEach(handle => {
      handle.classList.remove('dragging');
    });
    
    this.activeSlider = null;
    
    // Remove event listeners using bound handlers
    if (this.boundMoveHandler) {
      document.removeEventListener('mousemove', this.boundMoveHandler);
      document.removeEventListener('touchmove', this.boundMoveHandler);
      this.boundMoveHandler = null;
    }
    if (this.boundUpHandler) {
      document.removeEventListener('mouseup', this.boundUpHandler);
      document.removeEventListener('touchend', this.boundUpHandler);
      this.boundUpHandler = null;
    }
    
    // Clear the bound handlers
    
    // Apply filter only when the user releases the slider
    // This prevents haptic feedback and jumping during drag
    console.log('Slider released, applying TCO range filter...');
    this.applyTcoRangeFilter();
  }

  applyTcoRangeFilter(): void {
    // Filter reference cars based on TCO range
    console.log(`Applying TCO range filter: €${this.tcoRangeMin} - €${this.tcoRangeMax}`);
    
    // Reset car filter when TCO range changes
    this.isCarFilterActive = false;
    
    // Use setTimeout to prevent immediate filtering that can cause slider jumping
    setTimeout(() => {
      this.currentPage = 1;
      this.loadReferenceCars();
    }, 100);
  }

  // Helper method to update slider values in the DOM
  private updateSliderValues(): void {
    // Update the min slider value display
    const minValueElement = document.querySelector('.slider-value.min-value') as HTMLElement;
    if (minValueElement) {
      minValueElement.textContent = `€${Math.round(this.tcoRangeMin / 10) * 10}`;
    }
    
    // Update the max slider value display
    const maxValueElement = document.querySelector('.slider-value.max-value') as HTMLElement;
    if (maxValueElement) {
      maxValueElement.textContent = `€${Math.round(this.tcoRangeMax / 10) * 10}`;
    }
  }

  initializeTcoRange(): void {
    if (this.tcoDistribution.length > 0) {
      const newMin = this.getMinTco();
      const newMax = this.getMaxTco();
      
      // Always initialize sliders to show the full range when distribution changes
      // This ensures the slider reflects the current filtered data
      this.tcoRangeMin = newMin;
      this.tcoRangeMax = newMax;
      
      console.log(`Initialized TCO range: €${newMin} - €${newMax}`);
    }
  }

  // Helper method to round values to nearest 10 for display
  roundToTens(value: number): number {
    return Math.round(value / 10) * 10;
  }

  goToSessions(): void {
    this.router.navigate(['/user-sessions']);
  }

  goToPartnerDashboard(): void {
    this.router.navigate(['/partner-dashboard']);
  }

  // Document management methods
  downloadDocument(language: string = 'en'): void {
    let downloadUrl = this.documentUrl;
    let filename = `mobility-budget-policy-${this.currentSessionId}.txt`;
    
    // If we have multi-language URLs and the requested language exists, use it
    if (this.documentUrls && this.documentUrls[language as keyof typeof this.documentUrls]) {
      const languageUrls = this.documentUrls[language as keyof typeof this.documentUrls];
      if (languageUrls?.downloadUrl) {
        downloadUrl = languageUrls.downloadUrl;
        filename = `mobility-budget-policy-${language}-${this.currentSessionId}.pdf`;
      }
    }
    
    if (downloadUrl) {
      // Create a temporary link to download the document
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  openDocumentEditor(): void {
    this.showDocumentEditor = true;
    
    // Initialize editable content with current document content for the selected language
    this.editableDocumentContent = this.documentContent;
    
    // Set content in the editor after view is updated
    setTimeout(() => {
      if (this.documentEditorRef) {
        this.documentEditorRef.nativeElement.innerHTML = this.documentContent;
      }
    }, 0);
    
    console.log(`✅ Opening editor for language: ${this.documentLanguage}`);
    console.log(`📝 Content length: ${this.documentContent?.length || 0} characters`);
  }

  // Helper method to strip HTML tags and convert to plain text
  private stripHtmlTags(htmlContent: string): string {
    if (!htmlContent) return '';
    
    // Create a temporary div to parse HTML and extract text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Get text content and normalize whitespace
    let textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Clean up extra whitespace and line breaks
    textContent = textContent
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n\n') // Replace multiple line breaks with double line breaks
      .trim();
    
    // Additional cleanup to ensure no HTML entities remain
    textContent = textContent
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&amp;/g, '&') // Replace ampersands
      .replace(/&lt;/g, '<') // Replace less than
      .replace(/&gt;/g, '>') // Replace greater than
      .replace(/&quot;/g, '"') // Replace quotes
      .replace(/&#39;/g, "'") // Replace apostrophes
      .replace(/&apos;/g, "'"); // Replace apostrophes (alternative)
    
    return textContent;
  }

  closeDocumentEditor(): void {
    this.showDocumentEditor = false;
  }

  saveDocumentChanges(): void {
    if (!this.currentSessionId) return;

    console.log(`💾 Saving document changes for language: ${this.documentLanguage}`);
    console.log(`📝 Editable content length: ${this.editableDocumentContent?.length || 0} characters`);

    // Update the document content directly (HTML is already formatted)
    this.documentContent = this.editableDocumentContent;
    console.log(`💾 Updated document content length: ${this.documentContent?.length || 0} characters`);
    
    // Update the cache for the current document language
    this.languageContentCache[this.documentLanguage] = this.editableDocumentContent;
    console.log(`💾 Updated cache for language ${this.documentLanguage}: ${this.editableDocumentContent?.length || 0} characters`);
    
    // Synchronize changes across all languages
    this.synchronizeChangesAcrossLanguages(this.editableDocumentContent);
    
    // Save the updated document to storage
    this.saveUpdatedDocument();
    
    this.closeDocumentEditor();
    
    // Debug: Show final cache status after saving
    console.log('🔍 Final cache status after saving:');
    Object.keys(this.languageContentCache).forEach(lang => {
      console.log(`🔍 ${lang}: ${this.languageContentCache[lang]?.length || 0} characters`);
    });
  }

  // Synchronize changes across all available languages
  private synchronizeChangesAcrossLanguages(updatedContent: string): void {
    if (!this.documentUrls) return;
    
    // Get all available languages
    const availableLanguages = Object.keys(this.documentUrls);
    console.log(`🔄 Synchronizing changes across languages: ${availableLanguages.join(', ')}`);
    console.log(`📝 Updated content length: ${updatedContent.length} characters`);
    
    // For each language, update the local content cache
    availableLanguages.forEach(language => {
      // Store the updated content for this language
      if (!this.languageContentCache) {
        this.languageContentCache = {};
      }
      this.languageContentCache[language] = updatedContent;
      console.log(`✅ Updated cache for language ${language}: ${updatedContent.length} characters`);
    });
    
    console.log('✅ Changes synchronized across all languages:', availableLanguages);
    console.log('💾 All language versions now contain the updated content');
    console.log(`📊 Cache now contains ${Object.keys(this.languageContentCache).length} languages`);
    
    // Debug: Show final cache status
    Object.keys(this.languageContentCache).forEach(lang => {
      console.log(`🔍 Final cache ${lang}: ${this.languageContentCache[lang]?.length || 0} characters`);
    });
  }

  // Handle editor input changes
  onEditorInput(event: Event): void {
    const target = event.target as HTMLElement;
    // Update the editable content without losing cursor position
    this.editableDocumentContent = target.innerHTML;
  }





  // Reset to step 4 when document is rejected
  resetToStep4(): void {
    this.currentStep = 4;
    this.documentStatus = 'draft';
    this.updateSteps();
    this.saveSession();
    
    // Scroll to top when resetting
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Helper method to get valid document status for current step
  getValidDocumentStatus(step: number, sessionDocumentStatus: string): string {
    if (step === 5) {
      // In step 5, document status can be 'draft', 'pending', 'submitted', or 'approved'
      // 'rejected' status is not possible in step 5
      if (sessionDocumentStatus === 'approved') {
        return 'approved';
      } else if (sessionDocumentStatus === 'submitted') {
        return 'submitted';
      } else if (sessionDocumentStatus === 'pending') {
        return 'pending';
      } else {
        return 'draft';
      }
    } else {
      // For other steps, use the session document status
      return sessionDocumentStatus || 'draft';
    }
  }

  // Helper method to convert plain text back to HTML
  private convertTextToHtml(plainText: string): string {
    if (!plainText) return '';
    
    // Split text into paragraphs and wrap in HTML tags
    const paragraphs = plainText.split('\n\n').filter(p => p.trim());
    
    const htmlContent = paragraphs.map(paragraph => {
      // Check if paragraph is a heading (starts with number and dot)
      if (/^\d+\.\s/.test(paragraph)) {
        return `<h2>${paragraph}</h2>`;
      }
      // Check if paragraph is a subheading (starts with number, dot, number, dot)
      else if (/^\d+\.\d+\s/.test(paragraph)) {
        return `<h3>${paragraph}</h3>`;
      }
      // Check if paragraph is a sub-subheading (starts with number, dot, number, dot, number, dot)
      else if (/^\d+\.\d+\.\d+\s/.test(paragraph)) {
        return `<h4>${paragraph}</h4>`;
      }
      // Regular paragraph
      else {
        return `<p>${paragraph}</p>`;
      }
    }).join('');
    
    return htmlContent;
  }

  private saveUpdatedDocument(): void {
    if (!this.currentSessionId || !this.editableDocumentContent) return;

    console.log('💾 Saving document changes to backend...');
    
    // Update the current language content in the cache
    this.languageContentCache[this.documentLanguage] = this.editableDocumentContent;
    
    // Create the update data
    const updateData = {
      documentContent: this.editableDocumentContent,
      language: this.documentLanguage,
      lastModified: new Date().toISOString()
    };
    
            // Send the updated content to the backend
        this.userSessionService.updateDocumentContent(this.currentSessionId, updateData).subscribe({
          next: (response: any) => {
            console.log('✅ Document changes saved to backend successfully:', response);
            console.log('📊 Response type:', typeof response);
            console.log('📊 Response keys:', Object.keys(response || {}));
            console.log('📊 Response documentUrls:', response?.documentUrls);
            
            // Update the session with new document URLs if provided
            if (response.documentUrls) {
              this.documentUrls = response.documentUrls;
              console.log('🔄 Document URLs updated:', this.documentUrls);
            }
            
            // Don't reload the session - it would overwrite our cached changes
            // Instead, just update the session data without reloading content
            this.updateSessionDataOnly(response);
          },
          error: (error: any) => {
            console.error('❌ Failed to save document changes to backend:', error);
            
            // Fallback: save locally and show warning
            console.warn('⚠️ Saving changes locally as fallback');
            this.saveChangesLocally();
          }
        });
  }

  // Fallback method to save changes locally
  private saveChangesLocally(): void {
    console.log('💾 Saving changes locally as fallback...');
    
    // Update the cache for all languages
    if (this.documentUrls) {
      const availableLanguages = Object.keys(this.documentUrls);
      availableLanguages.forEach(language => {
        this.languageContentCache[language] = this.editableDocumentContent;
      });
    }
    
    console.log('✅ Changes saved locally');
    console.log('📝 Note: Changes are only stored locally. Backend synchronization failed.');
  }

  // Update session data without reloading content (to preserve cached changes)
  private updateSessionDataOnly(response: any): void {
    console.log('🔄 Updating session data without reloading content...');
    console.log('📊 Response received:', response);
    console.log('📊 Current documentUrls before update:', this.documentUrls);
    
    // Update document URLs if provided
    if (response.documentUrls) {
      this.documentUrls = response.documentUrls;
      console.log('✅ Document URLs updated to:', this.documentUrls);
      
      // Update the local cache with the new content for all languages
      // This ensures that when switching languages, we show the updated content
      const availableLanguages = this.getAvailableLanguages();
      
      // CRITICAL: Update the document content directly without reloading
      console.log('🔄 Updating document content directly without reloading...');
      
      // Update the current document content with the edited content
      this.documentContent = this.editableDocumentContent;
      
      // Update the cache for all languages with the edited content
      availableLanguages.forEach(lang => {
        this.languageContentCache[lang] = this.editableDocumentContent;
        console.log(`✅ Updated cache for language ${lang}: ${this.editableDocumentContent?.length || 0} characters`);
      });
      
      console.log('✅ Document content updated directly without reloading');
      
      // Note: Backend already updates the session with new document URLs
      // No need to call userSessionService.update here
      console.log('ℹ️ Backend already updated session with new document URLs');
    } else {
      console.warn('⚠️ No documentUrls in response, keeping existing URLs');
      console.log('📊 Existing documentUrls:', this.documentUrls);
      
      // Note: Backend already updates the session timestamp
      // No need to call userSessionService.update here
      console.log('ℹ️ Backend already updated session timestamp');
    }
    
    console.log('✅ Session data updated successfully while preserving cached changes');
    console.log('📊 Final documentUrls state:', this.documentUrls);
    console.log('📊 Available languages:', this.getAvailableLanguages());
    console.log('📊 Language cache status:', this.languageContentCache);
  }

  updateDocumentStatus(status: 'approved' | 'rejected'): void {
    if (!this.currentSessionId) return;

    if (status === 'approved') {
      // Use the new approve document API
      this.userSessionService.approveDocument(this.currentSessionId).subscribe({
        next: (response) => {
          console.log('Document approved successfully:', response);
          this.documentStatus = 'approved';
          this.documentUrls = response.documentUrls || {};
          this.documentUrl = response.documentUrls?.en?.previewUrl || this.documentUrl;
          
          // Reload session to get updated data
          this.loadSession(this.currentSessionId!);
          
          // Update stepper to show step 5 as completed
          this.updateSteps();
        },
        error: (error) => {
          console.error('Error approving document:', error);
          alert('Failed to approve document. Please try again.');
        }
      });
    } else if (status === 'rejected') {
      // Use the reject document API
      this.userSessionService.rejectDocument(this.currentSessionId).subscribe({
        next: (response) => {
          console.log('Document rejected successfully:', response);
          this.documentStatus = 'rejected';
          
          // Reload session to get updated data
          this.loadSession(this.currentSessionId!);
          
          // Update stepper
          this.updateSteps();
        },
        error: (error) => {
          console.error('Error rejecting document:', error);
          alert('Failed to reject document. Please try again.');
        }
      });
    }
    
    console.log(`Document status updated to: ${status}`);
  }

  // User management methods
  checkAuthentication(): void {
    const email = localStorage.getItem('userEmail');
    const partnerId = localStorage.getItem('partnerId');
    const partnerName = localStorage.getItem('partnerName');
    
    console.log('checkAuthentication called');
    console.log('userEmail from localStorage:', email);
    console.log('partnerId from localStorage:', partnerId);
    console.log('partnerName from localStorage:', partnerName);
    
    if (!email) {
      console.error('No user email found - redirecting to login');
      this.router.navigate(['/login']);
      return;
    }
    
    if (!partnerId) {
      console.error('No partner ID found - redirecting to login');
      this.router.navigate(['/login']);
      return;
    }
    
    this.userEmail = email;
    this.partner = partnerName || 'your partner';
    console.log('Authentication check passed');
  }

  checkPartnerMode(): void {
    // Check if we're in partner mode by looking at route parameters
    this.route.queryParams.subscribe(params => {
      const partnerMode = params['partnerMode'];
      const partnerName = params['partnerName'];
      const companyName = params['companyName'];
      const userName = params['userName'];
      
      if (partnerMode === 'true') {
        this.isPartnerMode = true;
        this.partnerName = partnerName || 'Partner';
        this.companyName = companyName || 'Unknown Company';
        this.userName = userName || 'Unknown User';
        console.log('Partner mode activated for:', this.partnerName, 'for company:', this.companyName, 'user:', this.userName);
        
        // Update header to show partner mode
        this.updateHeaderForPartnerMode();
      }
    });
  }

  updateHeaderForPartnerMode(): void {
    // Update the header to show we're in partner mode
    // This will be handled in the template
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showLanguageMenu = false; // Close language menu when opening user menu
  }

  toggleLanguageMenu(): void {
    this.showLanguageMenu = !this.showLanguageMenu;
    this.showUserMenu = false; // Close user menu when opening language menu
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
    localStorage.removeItem('userEmail');
    localStorage.removeItem('partnerEmail');
    localStorage.removeItem('partnerId');
    localStorage.removeItem('partnerName');
    localStorage.removeItem('partnerCode');
    this.router.navigate(['/login']);
  }

  // New Client Modal methods
  openNewClientModal(): void {
    this.showNewClientModal = true;
    this.resetNewClientData();
    // Pre-fill social secretary with partner name
    this.newClientData.socialSecretary = this.partnerName;
  }

  closeNewClientModal(): void {
    this.showNewClientModal = false;
    this.resetNewClientData();
  }

  resetNewClientData(): void {
    this.newClientData = {
      fullName: '',
      email: '',
      phoneNumber: '',
      selectedCountry: '+32',
      socialSecretary: this.partnerName,
      companyNumber: '',
      companyName: '',
      showCompanyNameInput: false,
      companyInfo: null,
      fullNameError: '',
      emailError: '',
      phoneNumberError: '',
      companyNumberError: '',
      companyNameError: ''
    };
  }

  // Validation methods for new client
  validateNewClientFullName(): void {
    if (!this.newClientData.fullName.trim()) {
      this.newClientData.fullNameError = this.translate('fullNameRequired');
    } else if (this.newClientData.fullName.trim().length < 2) {
      this.newClientData.fullNameError = this.translate('fullNameMinLength');
    } else {
      this.newClientData.fullNameError = '';
    }
  }

  validateNewClientEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.newClientData.email.trim()) {
      this.newClientData.emailError = this.translate('emailRequired');
    } else if (!emailRegex.test(this.newClientData.email)) {
      this.newClientData.emailError = this.translate('emailInvalid');
    } else {
      this.newClientData.emailError = '';
    }
  }

  validateNewClientPhoneNumber(): void {
    const phoneRegex = /^[0-9+\-\s\(\)]{8,15}$/;
    if (!this.newClientData.phoneNumber.trim()) {
      this.newClientData.phoneNumberError = this.translate('phoneNumberRequired');
    } else if (!phoneRegex.test(this.newClientData.phoneNumber)) {
      this.newClientData.phoneNumberError = this.translate('phoneNumberInvalid');
    } else {
      this.newClientData.phoneNumberError = '';
    }
  }

  validateNewClientCompanyNumber(): void {
    const companyNumberRegex = /^(BE)?[0-9]{10}$/;
    if (!this.newClientData.companyNumber.trim()) {
      this.newClientData.companyNumberError = this.translate('companyNumberRequired');
    } else if (!companyNumberRegex.test(this.newClientData.companyNumber)) {
      this.newClientData.companyNumberError = this.translate('companyNumberInvalid');
    } else {
      this.newClientData.companyNumberError = '';
      // Trigger company lookup
      this.lookupCompanyInfo();
    }
  }

  validateNewClientCompanyName(): void {
    if (!this.newClientData.companyName.trim()) {
      this.newClientData.companyNameError = this.translate('companyNameRequired');
    } else {
      this.newClientData.companyNameError = '';
    }
  }

  lookupCompanyInfo(): void {
    if (!this.newClientData.companyNumber || this.newClientData.companyNumberError) return;
    
    // This would integrate with VIES API similar to signup component
    // For now, we'll just show the company name input
    this.newClientData.showCompanyNameInput = true;
  }

  isNewClientFormValid(): boolean {
    return !!(this.newClientData.fullName && !this.newClientData.fullNameError &&
              this.newClientData.email && !this.newClientData.emailError &&
              this.newClientData.phoneNumber && !this.newClientData.phoneNumberError &&
              this.newClientData.companyNumber && !this.newClientData.companyNumberError &&
              (!this.newClientData.showCompanyNameInput || (this.newClientData.companyName && !this.newClientData.companyNameError)));
  }

  submitNewClient(): void {
    if (!this.isNewClientFormValid() || this.isSubmittingNewClient) return;

    this.isSubmittingNewClient = true;
    
    // Here you would call the signup service to create a new client
    // For now, we'll just simulate the process
    setTimeout(() => {
      console.log('Creating new client:', this.newClientData);
      this.isSubmittingNewClient = false;
      this.closeNewClientModal();
      // Show success message
      alert(this.translate('clientCreatedSuccessfully'));
    }, 2000);
  }

  // File upload methods
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files) {
      this.processFiles(Array.from(files));
    }
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.processFiles(Array.from(files));
    }
  }

  private processFiles(files: File[]): void {
    files.forEach(file => {
      if (!this.fileUploadService.isValidFileType(file)) {
        alert('Invalid file type. Only PDF and Word documents are allowed.');
        return;
      }
      
      this.uploadFile(file);
    });
  }

  private uploadFile(file: File): void {
    if (!this.currentSessionId) {
      alert('No active session found. Please refresh the page.');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    this.fileUploadService.uploadFile(this.currentSessionId, file).subscribe({
      next: (result) => {
        this.isUploading = false;
        this.uploadProgress = 100;
        
        if (result) {
          this.uploadedFiles.push(result.file);
          
          // Show AI analysis popup if categories were found
          if (result.categories && result.categories.length > 0) {
            this.aiAnalysisCategories = result.categories;
            this.currentAnalyzedFile = result.file.originalName;
            this.showAiAnalysisPopup = true;
          }
        }
        
        this.fileUploadService.resetUploadProgress();
      },
      error: (error) => {
        this.isUploading = false;
        this.uploadProgress = 0;
        console.error('Upload failed:', error);
        alert('File upload failed. Please try again.');
        this.fileUploadService.resetUploadProgress();
      }
    });

    // Subscribe to upload progress
    this.fileUploadService.getUploadProgress().subscribe(progress => {
      this.uploadProgress = progress.progress;
    });
  }

  removeFile(fileName: string): void {
    if (!this.currentSessionId) return;

    this.fileUploadService.deleteFile(this.currentSessionId, fileName).subscribe({
      next: () => {
        this.uploadedFiles = this.uploadedFiles.filter(f => f.fileName !== fileName);
      },
      error: (error) => {
        console.error('Delete failed:', error);
        alert('Failed to delete file. Please try again.');
      }
    });
  }

  analyzeFile(fileName: string): void {
    if (!this.currentSessionId) return;

    this.fileUploadService.analyzeFile(this.currentSessionId, fileName).subscribe({
      next: (result) => {
        this.aiAnalysisCategories = result.categories;
        this.currentAnalyzedFile = this.uploadedFiles.find(f => f.fileName === fileName)?.originalName || '';
        this.showAiAnalysisPopup = true;
      },
      error: (error) => {
        console.error('Analysis failed:', error);
        alert('Document analysis failed. Please try again.');
      }
    });
  }

  onAiAnalysisClose(): void {
    this.showAiAnalysisPopup = false;
    this.aiAnalysisCategories = [];
    this.currentAnalyzedFile = '';
  }

  onAddCategoriesFromAnalysis(categories: CarCategoryInfo[]): void {
    categories.forEach(category => {
      const newCategory = {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        name: category.categoryName,
        annualKilometers: 15000,
        leasingDuration: 48,
        employeeContribution: { 
          enabled: category.employeeContribution !== undefined, 
          amount: category.employeeContribution || 0 
        },
        cleaningCost: { 
          enabled: category.cleaningCost !== undefined, 
          amount: category.cleaningCost || 0 
        },
        parkingCost: { 
          enabled: category.parkingCost !== undefined, 
          amount: category.parkingCost || 0 
        },
        fuelCard: { 
          enabled: category.fuelCard !== undefined, 
          amount: category.fuelCard || 0 
        },
        status: 'pending' as 'pending' | 'success' | 'error',
        source: category.source
      };
      
      this.carCategories.push(newCategory);
    });
    
    this.saveSession();
  }

  loadSessionFiles(): void {
    if (!this.currentSessionId) return;

    this.fileUploadService.getSessionFiles(this.currentSessionId).subscribe({
      next: (files) => {
        this.uploadedFiles = files;
      },
      error: (error) => {
        console.error('Failed to load session files:', error);
      }
    });
  }

  formatFileSize(bytes: number): string {
    return this.fileUploadService.formatFileSize(bytes);
  }

  // Session management methods
  private loadSession(sessionId: string): void {
    this.isLoadingSession = true;
    
    this.userSessionService.findOne(sessionId).subscribe({
      next: (session: UserSession) => {
        this.currentSessionId = session.id;
        this.selectedCalculationMethod = session.selectedCalculationMethod || 0;
        this.selectedFuelTypes = session.selectedFuelTypes || ['diesel', 'electric', 'hybrid', 'petrol'];
        this.selectedBrands = session.selectedBrands || [];
        this.carCategories = session.carCategories || [];
        
        // Load step data if available
        if (session.stepData) {
          this.stepData = session.stepData;
        }
        
        // Load document information
        this.documentUrl = session.documentUrl || '';
        this.documentStatus = (session.documentStatus as 'draft' | 'pending' | 'submitted' | 'approved' | 'rejected') || 'draft';
        this.documentUrls = session.documentUrls || {};
        
        // If document is approved, automatically set currentStep to 5 (review)
        if (this.documentStatus === 'approved') {
          this.currentStep = 5;
          console.log(`🔧 Document is approved, setting currentStep to 5 (was: ${session.currentStep})`);
        } else {
          this.currentStep = session.currentStep;
          console.log(`🔧 Document status: ${this.documentStatus}, using session currentStep: ${session.currentStep}`);
        }
        
        console.log(`🔧 Final currentStep: ${this.currentStep}, documentStatus: ${this.documentStatus}`);
        
        // Load document content if URLs exist
        if (this.documentUrls && Object.keys(this.documentUrls).length > 0) {
          // Set the first available language as default document language
          const availableLanguages = Object.keys(this.documentUrls);
          if (availableLanguages.length > 0) {
            this.documentLanguage = availableLanguages[0] as any;
            
            // Load content for all available languages to populate the cache
            availableLanguages.forEach(language => {
              this.loadDocumentContent(session.id, language);
            });
          }
        } else if (this.documentUrl) {
          // Fallback for old format
          this.loadDocumentContent(session.id);
        }
        
        // Load session files
        this.loadSessionFiles();
        
        // Load partner information from session
        if (session.signup?.socialSecretary) {
          this.partner = session.signup.socialSecretary;
        }
        
        // Load company name from session
        if (session.signup?.companyName) {
          this.companyName = session.signup.companyName;
        }
        
        // Load uploaded files
        if (session.uploadedFiles) {
          this.uploadedFiles = session.uploadedFiles.map(file => ({
            id: file.name, // Use name as id since we don't have a proper id
            originalName: file.name,
            fileName: file.name,
            fileUrl: file.url || '',
            fileSize: file.size,
            mimeType: 'application/octet-stream', // Default since we don't have this info
            uploadedAt: file.uploadedAt,
            sessionId: session.id
          }));
        }
        
        // Update steps AFTER setting currentStep
        console.log(`🔧 About to call updateSteps with currentStep: ${this.currentStep}`);
        this.updateSteps();
        
        // Debug: Check if steps were updated correctly
        console.log(`🔧 After updateSteps - currentStep: ${this.currentStep}`);
        this.steps.forEach(step => {
          console.log(`🔧 Step ${step.id}: active=${step.active}, completed=${step.completed}`);
        });
        
        this.isLoadingSession = false;
        
        // Validate category statuses after loading
        this.validateCategoryStatuses();
        
        // Auto-generate document for partners if needed
        this.ensureDocumentExists();
      },
      error: (error) => {
        console.error('Error loading session:', error);
        this.isLoadingSession = false;
        // If session is not found or invalid, redirect to login
        this.router.navigate(['/login']);
      }
    });
  }

  private saveSession(): void {
    if (!this.currentSessionId) {
      // Create new session
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        console.error('No user email found');
        return;
      }
      
      // For now, we'll create a mock signup ID - in a real app, you'd get this from the user's signup
      const mockSignupId = 'mock-signup-id';
      
      const sessionData = {
        signupId: mockSignupId,
        currentStep: this.currentStep,
        selectedCalculationMethod: this.selectedCalculationMethod,
        selectedFuelTypes: this.selectedFuelTypes,
        selectedBrands: this.selectedBrands,
        carCategories: this.carCategories,
        uploadedFiles: this.uploadedFiles.map(file => ({
          name: file.originalName,
          size: file.fileSize,
          uploadedAt: new Date()
        }))
      };
      
      this.userSessionService.create(sessionData).subscribe({
        next: (session) => {
          this.currentSessionId = session.id;
          console.log('Session created:', session);
        },
        error: (error) => {
          console.error('Error creating session:', error);
        }
      });
    } else {
      // Update existing session
      const updateData = {
        currentStep: this.currentStep,
        selectedCalculationMethod: this.selectedCalculationMethod,
        selectedFuelTypes: this.selectedFuelTypes,
        selectedBrands: this.selectedBrands,
        carCategories: this.carCategories,
        uploadedFiles: this.uploadedFiles.map(file => ({
          name: file.originalName,
          size: file.fileSize,
          uploadedAt: new Date()
        }))
      };
      
      this.userSessionService.update(this.currentSessionId, updateData).subscribe({
        next: (session) => {
          console.log('Session updated:', session);
        },
        error: (error) => {
          console.error('Error updating session:', error);
        }
      });
    }
  }

  /**
   * Force regeneration of the document to ensure latest templates are used
   */
  public forceDocumentRegeneration(): void {
    console.log('🔄 Forcing document regeneration to ensure latest templates are used...');
    
    // Check if we can generate a document
    if (!this.canGenerateDocument()) {
      console.log('❌ Cannot generate document: not all categories have valid TCO');
      alert('Cannot generate document: Please ensure all car categories have valid TCO calculations (green checkmarks)');
      return;
    }
    
    // Clear any existing document URLs to force regeneration
    this.documentUrls = {};
    
    // Clear the cache
    this.clearDocumentCache();
    
    // Generate the document with fresh data
    this.saveTcoDocument();
  }

  /**
   * Clear the document cache to ensure fresh content is loaded
   */
  public clearDocumentCache(): void {
    console.log('🧹 Clearing document cache...');
    this.languageContentCache = {};
    this.documentContent = '';
    console.log('✅ Document cache cleared');
  }

  /**
   * Debug method to show document information
   */
  public debugDocumentInfo(): void {
    console.log('📊 Debug Document Information:');
    console.log('📊 Current Session ID:', this.currentSessionId);
    console.log('📊 Document Status:', this.documentStatus);
    console.log('📊 Document URLs:', this.documentUrls);
    console.log('📊 Language Cache:', this.languageContentCache);
    console.log('📊 Available Languages:', this.getAvailableLanguages());
    console.log('📊 Document Content Length:', this.documentContent?.length || 0);
    console.log('📊 Car Categories:', this.carCategories);
    
    // Show alert with key information
    const info = `
Debug Info:
- Session ID: ${this.currentSessionId || 'none'}
- Document Status: ${this.documentStatus || 'none'}
- Available Languages: ${this.getAvailableLanguages().join(', ') || 'none'}
- Cache Size: ${this.getCacheSize()}
- Content Length: ${this.documentContent?.length || 0}
- Categories: ${this.carCategories?.length || 0}
    `.trim();
    
    alert(info);
  }

  /**
   * Helper method to get cache size for display
   */
  public getCacheSize(): number {
    return Object.keys(this.languageContentCache || {}).length;
  }

  /**
   * Update session status in the backend
   */
  private updateSessionStatus(status: 'draft' | 'in_progress' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'completed'): void {
    if (!this.currentSessionId) return;

    const updateData = {
      status: status,
      lastActivityAt: new Date()
    };

    console.log('Updating session status to:', status);

    this.userSessionService.update(this.currentSessionId, updateData).subscribe({
      next: (response) => {
        console.log('Session status updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating session status:', error);
      }
    });
  }

  // Load TCO distribution with default values for initial display
  private loadTcoDistributionWithDefaults(): void {
    this.isLoadingTcoData = true;
    
    // Use default values for initial display
    const defaultYearlyKm = 15000;
    const defaultDuration = 60;
    
    // Map frontend fuel types to database values
    const fuelTypes = this.selectedFuelTypes.map(type => {
      switch(type) {
        case 'diesel': return 'Diesel';
        case 'electric': return 'Électrique';
        case 'hybrid': return 'Hybride';
        case 'petrol': return 'Essence';
        default: return type;
      }
    }).filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
    
    this.vehiclesService.getTcoDistribution(defaultYearlyKm, defaultDuration, [], fuelTypes).subscribe({
      next: (distribution: any[]) => {
        this.tcoDistribution = distribution;
        console.log('Loaded TCO distribution with defaults:', distribution);
        this.isLoadingTcoData = false;
        // Initialize TCO range when distribution changes
        this.initializeTcoRange();
        // Update available filters after loading TCO distribution
        this.updateAvailableFilters();
      },
      error: (error) => {
        console.error('Error loading TCO distribution with defaults:', error);
        this.tcoDistribution = [];
        this.isLoadingTcoData = false;
      }
    });
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
