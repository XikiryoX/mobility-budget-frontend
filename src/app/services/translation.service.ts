import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'nl' | 'fr' | 'en';

export interface Translations {
  [key: string]: {
    nl: string;
    fr: string;
    en: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguageSubject = new BehaviorSubject<Language>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: Translations = {
    'signInToContinue': {
      nl: 'Meld je aan om door te gaan naar',
      fr: 'Connectez-vous pour continuer vers',
      en: 'Sign in to continue to'
    },
    'emailAddress': {
      nl: 'E-mailadres',
      fr: 'Adresse e-mail',
      en: 'Email Address'
    },
    'addYourEmailAddress': {
      nl: 'Voeg je e-mailadres toe',
      fr: 'Ajoutez votre adresse e-mail',
      en: 'Add your email address'
    },
    'signIn': {
      nl: 'Aanmelden',
      fr: 'Se connecter',
      en: 'Sign in'
    },
    'signUp': {
      nl: 'Registreren',
      fr: 'S\'inscrire',
      en: 'Sign up'
    },
    'wantToJoinPartner': {
      nl: 'Wil je ons platform als partner vervoegen?',
      fr: 'Voulez-vous rejoindre notre plateforme en tant que partenaire ?',
      en: 'Want to join our platform as a partner?'
    },
    'becomePartner': {
      nl: 'Word partner',
      fr: 'Devenir partenaire',
      en: 'Become a partner'
    },
    'viewPreviousSessions': {
      nl: 'Bekijk eerdere sessies',
      fr: 'Voir les sessions précédentes',
      en: 'View previous sessions'
    },
    'partnerLogin': {
      nl: 'Partner login',
      fr: 'Connexion partenaire',
      en: 'Partner login'
    },
    'emailRequired': {
      nl: 'E-mailadres is verplicht',
      fr: 'L\'adresse e-mail est requise',
      en: 'Email address is required'
    },
    'invalidEmail': {
      nl: 'Voer een geldig e-mailadres in',
      fr: 'Veuillez saisir une adresse e-mail valide',
      en: 'Please enter a valid email address'
    },
    'sending': {
      nl: 'Versturen...',
      fr: 'Envoi...',
      en: 'Sending...'
    },
    'imageText': {
      nl: 'De <b>100% Belgische</b> oplossing voor werkgevers en werknemers.',
      fr: 'La solution <b>100% belge</b> pour les employeurs et les salariés.',
      en: 'The <b>100% Belgian</b> solution for employers and employees.'
    },
    'back': {
      nl: 'Terug',
      fr: 'Retour',
      en: 'Back'
    },
    'signUpToContinue': {
      nl: 'Registreer om door te gaan naar',
      fr: 'Inscrivez-vous pour continuer vers',
      en: 'Sign up to continue to'
    },
    'fullName': {
      nl: 'Volledige naam',
      fr: 'Nom complet',
      en: 'Full name'
    },
    'addYourFullName': {
      nl: 'Voeg je volledige naam toe',
      fr: 'Ajoutez votre nom complet',
      en: 'Add your full name'
    },
    'phoneNumber': {
      nl: 'Telefoonnummer',
      fr: 'Numéro de téléphone',
      en: 'Phone number'
    },
    'addYourPhoneNumber': {
      nl: 'Voeg je telefoonnummer toe',
      fr: 'Ajoutez votre numéro de téléphone',
      en: 'Add your phone number'
    },
    'socialSecretary': {
      nl: 'Sociaal secretariaat',
      fr: 'Secrétariat social',
      en: 'Social secretary'
    },
    'chooseYourSocialSecretary': {
      nl: 'Kies je sociaal secretariaat',
      fr: 'Choisissez votre secrétariat social',
      en: 'Choose your social secretary'
    },
    'companyNumber': {
      nl: 'Ondernemingsnummer',
      fr: 'Numéro d\'entreprise',
      en: 'Company Number'
    },
    'addYourCompanyNumber': {
      nl: 'Voeg je ondernemingsnummer toe',
      fr: 'Ajoutez votre numéro d\'entreprise',
      en: 'Add your company number'
    },
    'invalidCompanyNumber': {
      nl: 'Voer een geldig ondernemingsnummer in',
      fr: 'Veuillez saisir un numéro d\'entreprise valide',
      en: 'Please enter a valid company number'
    },
    'companyName': {
      nl: 'Bedrijfsnaam',
      fr: 'Nom de l\'entreprise',
      en: 'Company name'
    },
    'addYourCompanyName': {
      nl: 'Voeg je bedrijfsnaam toe',
      fr: 'Ajoutez le nom de votre entreprise',
      en: 'Add your company name'
    },
    'companyNameRequired': {
      nl: 'Bedrijfsnaam is verplicht',
      fr: 'Le nom de l\'entreprise est requis',
      en: 'Company name is required'
    },
    'companyNameTooShort': {
      nl: 'Bedrijfsnaam moet minimaal 2 karakters bevatten',
      fr: 'Le nom de l\'entreprise doit contenir au moins 2 caractères',
      en: 'Company name must be at least 2 characters'
    },
    'invalidPhoneNumber': {
      nl: 'Voer een geldig telefoonnummer in',
      fr: 'Veuillez saisir un numéro de téléphone valide',
      en: 'Please enter a valid phone number'
    },
    'fullNameRequired': {
      nl: 'Volledige naam is verplicht',
      fr: 'Le nom complet est requis',
      en: 'Full name is required'
    },
    'companyLookupError': {
      nl: 'Fout bij het opzoeken van bedrijfsinformatie',
      fr: 'Erreur lors de la recherche d\'informations sur l\'entreprise',
      en: 'Error looking up company information'
    },
    'companyFound': {
      nl: 'Bedrijf gevonden',
      fr: 'Entreprise trouvée',
      en: 'Company found'
    },
    'lookingUpCompany': {
      nl: 'Bedrijfsinformatie opzoeken...',
      fr: 'Recherche d\'informations sur l\'entreprise...',
      en: 'Looking up company information...'
    },
    'testModeInfo': {
      nl: 'Test modus - Bedrijfsvalidatie uitgeschakeld',
      fr: 'Mode test - Validation d\'entreprise désactivée',
      en: 'Test Mode - Company validation disabled'
    },
    'testModeDescription': {
      nl: 'Gebruik productie API voor echte validatie',
      fr: 'Utilisez l\'API de production pour une validation réelle',
      en: 'Please use production API for real validation'
    },
    'corsError': {
      nl: 'CORS fout - Gebruik backend proxy voor productie',
      fr: 'Erreur CORS - Utilisez un proxy backend pour la production',
      en: 'CORS error - Use backend proxy for production'
    },
          'productionTestVat': {
        nl: 'Dit BTW nummer is gereserveerd voor productie testing met echte EU VIES API',
        fr: 'Ce numéro de TVA est réservé pour les tests de production avec la vraie API EU VIES',
        en: 'This VAT number is reserved for production testing with real EU VIES API'
      },
      // User Policies translations
      'mySessions': {
        nl: 'Mijn policies',
        fr: 'Mes politiques',
        en: 'My Policies'
      },
      'manageYourSessions': {
        nl: 'Beheer je policies en ga verder waar je gebleven was',
        fr: 'Gérez vos politiques et continuez où vous vous êtes arrêté',
        en: 'Manage your policies and continue where you left off'
      },
      'loadingSessions': {
        nl: 'Policies laden...',
        fr: 'Chargement des politiques...',
        en: 'Loading policies...'
      },
      'retry': {
        nl: 'Opnieuw proberen',
        fr: 'Réessayer',
        en: 'Retry'
      },
      'createNewSession': {
        nl: 'Nieuwe policy maken',
        fr: 'Créer une nouvelle politique',
        en: 'Create new policy'
      },
      'session': {
        nl: 'Policy',
        fr: 'Politique',
        en: 'Policy'
      },
      'currentStep': {
        nl: 'Huidige stap',
        fr: 'Étape actuelle',
        en: 'Current step'
      },
      'lastActivity': {
        nl: 'Laatste activiteit',
        fr: 'Dernière activité',
        en: 'Last activity'
      },
      'submitted': {
        nl: 'Ingediend',
        fr: 'Soumis',
        en: 'Submitted'
      },
      'continue': {
        nl: 'Doorgaan',
        fr: 'Continuer',
        en: 'Continue'
      },
      'noSessionsYet': {
        nl: 'Nog geen policies',
        fr: 'Aucune politique encore',
        en: 'No policies yet'
      },
      'createYourFirstSession': {
        nl: 'Maak je eerste policy aan om te beginnen',
        fr: 'Créez votre première politique pour commencer',
        en: 'Create your first policy to get started'
      },
      'createFirstSession': {
        nl: 'Eerste policy maken',
        fr: 'Créer la première politique',
        en: 'Create first policy'
      },
          'backToLogin': {
      nl: 'Terug naar login',
      fr: 'Retour à la connexion',
      en: 'Back to login'
    },
      // Partner translations
      'partnerDashboard': {
        nl: 'Partner Dashboard',
        fr: 'Tableau de bord partenaire',
        en: 'Partner Dashboard'
      },
      'partnerImageText': {
        nl: 'De <b>100% Belgische</b> oplossing voor sociale secretariaten.',
        fr: 'La solution <b>100% belge</b> pour les secrétariats sociaux.',
        en: 'The <b>100% Belgian</b> solution for social secretaries.'
      },
      'userLogin': {
        nl: 'Gebruiker login',
        fr: 'Connexion utilisateur',
        en: 'User login'
      },
      'partnerInfo': {
        nl: 'Voor sociale secretariaten en partners',
        fr: 'Pour les secrétariats sociaux et partenaires',
        en: 'For social secretaries and partners'
      },
      'partnerNotFound': {
        nl: 'Partner niet gevonden',
        fr: 'Partenaire non trouvé',
        en: 'Partner not found'
      },
      'manageCompanyDossiers': {
        nl: 'Beheer dossiers van alle bedrijven',
        fr: 'Gérez les dossiers de toutes les entreprises',
        en: 'Manage dossiers from all companies'
      },
      'loadingCompanies': {
        nl: 'Bedrijven laden...',
        fr: 'Chargement des entreprises...',
        en: 'Loading companies...'
      },
      'companies': {
        nl: 'Bedrijven',
        fr: 'Entreprises',
        en: 'Companies'
      },
      'totalCompanies': {
        nl: 'Totaal bedrijven',
        fr: 'Total entreprises',
        en: 'Total companies'
      },
      'totalSessions': {
        nl: 'Totaal policies',
        fr: 'Total politiques',
        en: 'Total policies'
      },
      'pendingSessions': {
        nl: 'Wachtende policies',
        fr: 'Politiques en attente',
        en: 'Pending policies'
      },
      'completedSessions': {
        nl: 'Voltooide policies',
        fr: 'Politiques terminées',
        en: 'Completed policies'
      },
      'registered': {
        nl: 'Geregistreerd',
        fr: 'Enregistré',
        en: 'Registered'
      },
      'noSessionsForCompany': {
        nl: 'Geen policies voor dit bedrijf',
        fr: 'Aucune politique pour cette entreprise',
        en: 'No policies for this company'
      },
      'noCompaniesYet': {
        nl: 'Nog geen bedrijven',
        fr: 'Aucune entreprise encore',
        en: 'No companies yet'
      },
      'noCompaniesDescription': {
        nl: 'Er zijn nog geen bedrijven geregistreerd voor dit sociale secretariaat',
        fr: 'Aucune entreprise n\'est encore enregistrée pour ce secrétariat social',
        en: 'No companies are registered yet for this social secretary'
      },
          'logout': {
      nl: 'Uitloggen',
      fr: 'Se déconnecter',
      en: 'Logout'
    },
    'signOut': {
      nl: 'Uitloggen',
      fr: 'Se déconnecter',
      en: 'Sign out'
    },
    'backToTcoConverter': {
      nl: 'Terug naar TCO Converter',
      fr: 'Retour au convertisseur TCO',
      en: 'Back to TCO Converter'
    },
      // TCO Converter translations
      'generalInformation': {
        nl: 'Algemene informatie',
        fr: 'Informations générales',
        en: 'General information'
      },
      'uploadCarPolicy': {
        nl: 'Upload auto policy',
        fr: 'Télécharger la politique automobile',
        en: 'Upload car policy'
      },
      'calculationMethod': {
        nl: 'Berekeningsmethode',
        fr: 'Méthode de calcul',
        en: 'Calculation method'
      },
      'carCategories': {
        nl: 'Autocategorieën',
        fr: 'Catégories de voitures',
        en: 'Car categories'
      },
      'mobilityBudgetPolicy': {
        nl: 'Mobiliteitsbudget policy',
        fr: 'Politique de budget mobilité',
        en: 'Mobility budget policy'
      },
      'next': {
        nl: 'Volgende',
        fr: 'Suivant',
        en: 'Next'
      },
      'previous': {
        nl: 'Vorige',
        fr: 'Précédent',
        en: 'Previous'
      },
      'addYourExistingCarPolicy': {
        nl: 'Voeg je bestaande auto policy toe',
        fr: 'Ajoutez votre politique automobile existante',
        en: 'Add your existing car policy'
      },
      'dragAndDropFiles': {
        nl: 'Sleep bestanden hierheen of klik om te bladeren',
        fr: 'Glissez-déposez des fichiers ici ou cliquez pour parcourir',
        en: 'Drag and drop files here or click to browse'
      },
      'or': {
        nl: 'of',
        fr: 'ou',
        en: 'or'
      },
      'browseFiles': {
        nl: 'Blader door bestanden',
        fr: 'Parcourir les fichiers',
        en: 'Browse files'
      },
      'noCarPolicy': {
        nl: 'Geen auto policy?',
        fr: 'Pas de politique automobile ?',
        en: 'No car policy?'
      },
      'noCarPolicyDescription': {
        nl: 'Je hebt geen auto policy? Geen zorgen! Ga gewoon naar de volgende stap en je kunt de informatie zelf invoeren.',
        fr: 'Vous n\'avez pas de politique automobile ? Pas de soucis ! Passez simplement à l\'étape suivante et vous pourrez saisir les informations vous-même.',
        en: 'You don\'t have a car policy? No worries! Just move to the next step and you will be able to input the information yourself.'
      },
      // Step 3: Calculation Method translations
      'chooseCalculationMethod': {
        nl: 'Kies je energiekosten berekeningsmethode',
        fr: 'Choisissez votre méthode de calcul des coûts énergétiques',
        en: 'Choose your energy cost calculation method'
      },
      'calculationMethodDescription1': {
        nl: 'Selecteer hoe je de energiekosten (brandstof/elektriciteit) in het mobiliteitsbudget wilt schatten.',
        fr: 'Sélectionnez comment vous souhaitez estimer les coûts énergétiques (carburant/électricité) dans le budget mobilité.',
        en: 'Select how you\'d like to estimate energy (fuel/electricity) costs in the mobility budget.'
      },
      'calculationMethodDescription2': {
        nl: 'Alle methoden gebruiken dezelfde Total Cost of Ownership (TCO) per werknemerscategorie, maar verschillen in hoe energie wordt geschat en of professionele reizen zijn inbegrepen.',
        fr: 'Toutes les méthodes utilisent le même Total Cost of Ownership (TCO) par catégorie d\'employé, mais diffèrent dans la façon dont l\'énergie est estimée et si les voyages professionnels sont inclus.',
        en: 'All methods use the same Total Cost of Ownership (TCO) per employee category, but differ in how energy is estimated and whether professional travel is included.'
      },
      'legalFormulaTitle': {
        nl: 'Wettelijke formule gebaseerd op thuis-werk afstand',
        fr: 'Formule légale basée sur la distance domicile-travail',
        en: 'Legal formula based on home-work distance'
      },
      'energyCost': {
        nl: 'Energiekosten:',
        fr: 'Coûts énergétiques :',
        en: 'Energy Cost:'
      },
      'energyCostLegal': {
        nl: 'Individueel berekend met de wettelijke formule, gebaseerd op de woon-werkafstand.',
        fr: 'Calculé individuellement en utilisant la formule légale, basée sur la distance de navette domicile-travail.',
        en: 'Calculated individually using the legal formula, based on the commuting distance from home to the office.'
      },
      'professionalTravel': {
        nl: 'Professionele reizen:',
        fr: 'Voyages professionnels :',
        en: 'Professional Travel:'
      },
      'professionalTravelNotIncluded': {
        nl: '❌ Niet inbegrepen in het budget. Moet apart worden terugbetaald (bijv. via onkostenverklaringen).',
        fr: '❌ Non inclus dans le budget. Doit être remboursé séparément (par exemple, via des rapports de dépenses).',
        en: '❌ Not included in the budget. Must be reimbursed separately (e.g., via expense reports).'
      },
      'mobilityBudget': {
        nl: 'Mobiliteitsbudget:',
        fr: 'Budget mobilité :',
        en: 'Mobility Budget:'
      },
      'mobilityBudgetLegal': {
        nl: 'Verschilt per werknemer afhankelijk van hun woon-werkafstand.',
        fr: 'Varie selon l\'employé en fonction de sa distance de navette domicile-travail.',
        en: 'Varies per employee depending on their commuting distance.'
      },
      'recommendationLegal': {
        nl: 'Aanbevolen voor werkgevers die een strikt regelgevingsgebaseerde, gepersonaliseerde aanpak willen voor energiekosten schatting.',
        fr: 'Recommandé pour les employeurs qui souhaitent une approche strictement basée sur la réglementation et personnalisée pour l\'estimation des coûts énergétiques.',
        en: 'Recommended for employers who want a strictly regulation-based, personalized approach to energy cost estimation.'
      },
      'fixedAmountTitle': {
        nl: 'Vast energiekostenbedrag per categorie',
        fr: 'Montant énergétique fixe par catégorie',
        en: 'Fixed energy amount per category'
      },
      'energyCostFixed': {
        nl: 'Vast bedrag ingesteld per werknemerscategorie. Kan gebaseerd zijn op een standaard energiekostenkaart voorziening, of een gemiddelde van historische energiekosten.',
        fr: 'Montant fixe défini par catégorie d\'employé. Peut être basé sur une provision de carte énergétique standard, ou une moyenne des dépenses énergétiques historiques.',
        en: 'Fixed amount set per employee category. Can be based on a standard energy card provision, or an average of historical energy expenses.'
      },
      'professionalTravelIncluded': {
        nl: '✅ Inbegrepen in het forfait (voor autoreizen)<br>❌ Trein, vlucht en andere vervoerswijzen moeten apart worden terugbetaald.',
        fr: '✅ Inclus dans le forfait (pour les trajets en voiture)<br>❌ Train, vol et autres modes de transport doivent être remboursés séparément.',
        en: '✅ Included in the lump sum (for car trips)<br>❌ Train, flight, and other transport modes must be reimbursed separately.'
      },
      'mobilityBudgetFixed': {
        nl: 'Uniform voor alle werknemers in dezelfde categorie.',
        fr: 'Uniforme pour tous les employés de la même catégorie.',
        en: 'Uniform across all employees in the same category.'
      },
      'recommendationFixed': {
        nl: 'Aanbevolen voor bedrijven die eenvoud en budgetvoorspelbaarheid zoeken over werknemerscategorieën.',
        fr: 'Recommandé pour les entreprises recherchant la simplicité et la prévisibilité budgétaire entre les catégories d\'employés.',
        en: 'Recommended for companies seeking simplicity and budget predictability across employee categories.'
      },
      'leaseContractTitle': {
        nl: 'Schatting gebaseerd op leasecontract kilometers',
        fr: 'Estimation basée sur les kilomètres du contrat de location',
        en: 'Estimate based on lease contract kilometers'
      },
      'energyCostLease': {
        nl: 'Gebaseerd op de jaarlijkse kilometers toegestaan in het leasecontract van de auto, gebruikmakend van het brandstof- of elektriciteitsverbruik van de auto, en een aangenomen energieprijs (€/L of €/kWh).',
        fr: 'Basé sur les kilomètres annuels autorisés dans le contrat de location de la voiture, en utilisant la consommation de carburant ou d\'électricité de la voiture, et un prix énergétique supposé (€/L ou €/kWh).',
        en: 'Based on the annual kilometers allowed in the car\'s lease contract, using the car\'s fuel or electricity consumption, and an assumed energy price (€/L or €/kWh).'
      },
      'professionalTravelLease': {
        nl: '✅ Inbegrepen in het budget (voor autoreizen)<br>❌ Andere vervoerswijzen (trein, vlucht, etc.) moeten apart worden terugbetaald.',
        fr: '✅ Inclus dans le budget (pour les trajets en voiture)<br>❌ Les autres modes de transport (train, vol, etc.) doivent être remboursés séparément.',
        en: '✅ Included in the budget (for car-related trips)<br>❌ Other transport modes (train, flight, etc.) must be reimbursed separately.'
      },
      'mobilityBudgetLease': {
        nl: 'Consistent binnen categorieën, afgestemd op daadwerkelijk autogebruik en policy regels.',
        fr: 'Cohérent au sein des catégories, aligné sur l\'utilisation réelle de la voiture et les règles de politique.',
        en: 'Consistent within categories, aligned with actual car usage and policy rules.'
      },
      'recommendationLease': {
        nl: 'Aanbevolen voor bedrijven die een realistische, datagedreven aanpak willen die zowel gebruik als interne auto policy weerspiegelt.',
        fr: 'Recommandé pour les entreprises qui souhaitent une approche réaliste et basée sur les données reflétant à la fois l\'utilisation et les politiques automobiles internes.',
        en: 'Recommended for companies that want a realistic, data-driven approach reflecting both usage and internal car policies.'
      },
      // Step 4: Car Categories & TCO's translations
      'newCarCategorySetup': {
        nl: 'Nieuwe autocategorie instellen',
        fr: 'Configuration de nouvelle catégorie de voiture',
        en: 'New Car Category Setup'
      },
      'carCategoryParameters': {
        nl: 'Autocategorie parameters',
        fr: 'Paramètres de catégorie de voiture',
        en: 'Car Category Parameters'
      },
      'categoryName': {
        nl: 'Categorienaam',
        fr: 'Nom de catégorie',
        en: 'Category Name'
      },
      'addYourCategoryName': {
        nl: 'Voeg je categorienaam toe',
        fr: 'Ajoutez votre nom de catégorie',
        en: 'Add Your Category Name'
      },
      'annualKilometersAllowed': {
        nl: 'Jaarlijkse kilometers toegestaan',
        fr: 'Kilomètres annuels autorisés',
        en: 'Annual Kilometers Allowed'
      },
      'kilometers': {
        nl: '-- Kilometers',
        fr: '-- Kilomètres',
        en: '-- Kilometers'
      },
      'leasingDuration': {
        nl: 'Lease duur',
        fr: 'Durée de location',
        en: 'Leasing Duration'
      },
      'months': {
        nl: '-- maanden',
        fr: '-- mois',
        en: '-- months'
      },
      'employeeContribution': {
        nl: 'Werknemersbijdrage',
        fr: 'Contribution employé',
        en: 'Employee Contribution'
      },
      'contributionAmount': {
        nl: 'Bijdragebedrag',
        fr: 'Montant de contribution',
        en: 'Contribution Amount'
      },
      'addAnAmount': {
        nl: 'Voeg een bedrag toe',
        fr: 'Ajoutez un montant',
        en: 'Add an Amount'
      },
      'vehicleCleaningCostContribution': {
        nl: 'Voertuigreiniging kostenbijdrage',
        fr: 'Contribution aux coûts de nettoyage du véhicule',
        en: 'Vehicle Cleaning Cost Contribution'
      },
      'contributionValue': {
        nl: 'Bijdragewaarde',
        fr: 'Valeur de contribution',
        en: 'Contribution Value'
      },
      'parkingStorageCostContribution': {
        nl: 'Parkeren / Opslag kostenbijdrage',
        fr: 'Contribution aux coûts de stationnement/stockage',
        en: 'Parking / Storage Cost Contribution'
      },
      'limitedFuelCard': {
        nl: 'Beperkte brandstofkaart',
        fr: 'Carte carburant limitée',
        en: 'Limited Fuel Card'
      },
      'monthlyAmountProvision': {
        nl: 'Maandelijks bedrag voorziening',
        fr: 'Provision de montant mensuel',
        en: 'Monthly Amount Provision'
      },
      'addMaximumMonthlyAmountAllowed': {
        nl: 'Voeg maximaal maandelijks toegestaan bedrag toe',
        fr: 'Ajoutez le montant mensuel maximum autorisé',
        en: 'Add Maximum Monthly Amount Allowed'
      },
      'referenceCarConfiguration': {
        nl: 'Referentieauto configuratie',
        fr: 'Configuration de voiture de référence',
        en: 'Reference Car Configuration'
      },
      'monthlyTcoRange': {
        nl: 'Maandelijkse TCO bereik',
        fr: 'Plage TCO mensuelle',
        en: 'Monthly TCO Range'
      },
      'loadingTcoDistribution': {
        nl: 'TCO verdeling laden...',
        fr: 'Chargement de la distribution TCO...',
        en: 'Loading TCO distribution...'
      },
      'brands': {
        nl: 'Merken',
        fr: 'Marques',
        en: 'Brands'
      },
      'fuelTypes': {
        nl: 'Brandstoftypes',
        fr: 'Types de carburant',
        en: 'Fuel Types'
      },
      'pleaseFillInCarCategoryParameters': {
        nl: 'Vul de autocategorie parameters in om referentieauto configuraties te vinden.',
        fr: 'Veuillez remplir les paramètres de catégorie de voiture pour trouver les configurations de voiture de référence.',
        en: 'Please fill in the car category parameters to find reference car configurations.'
      },
      'referenceCarList': {
        nl: 'Referentieauto lijst',
        fr: 'Liste des voitures de référence',
        en: 'Reference Car List'
      },
      'select': {
        nl: 'Selecteren',
        fr: 'Sélectionner',
        en: 'Select'
      },
      'brand': {
        nl: 'Merk',
        fr: 'Marque',
        en: 'Brand'
      },
      'model': {
        nl: 'Model',
        fr: 'Modèle',
        en: 'Model'
      },
      'monthlyTco': {
        nl: 'Maandelijkse TCO',
        fr: 'TCO mensuel',
        en: 'Monthly TCO'
      },
      'showing': {
        nl: 'Toont',
        fr: 'Affichage',
        en: 'Showing'
      },
      'of': {
        nl: 'van',
        fr: 'de',
        en: 'of'
      },
      'pages': {
        nl: 'pagina\'s',
        fr: 'pages',
        en: 'pages'
      },
      'loadingReferenceCars': {
        nl: 'Referentieauto\'s laden...',
        fr: 'Chargement des voitures de référence...',
        en: 'Loading reference cars...'
      },
      'noReferenceCarsFound': {
        nl: 'Geen referentieauto\'s gevonden met de huidige filters.',
        fr: 'Aucune voiture de référence trouvée avec les filtres actuels.',
        en: 'No reference cars found with the current filters.'
      },
      'tryAdjustingYourFilters': {
        nl: 'Probeer je filters aan te passen',
        fr: 'Essayez d\'ajuster vos filtres',
        en: 'Try adjusting your filters'
      },
      'filter': {
        nl: 'Filter',
        fr: 'Filtrer',
        en: 'Filter'
      },
      'clearFilter': {
        nl: 'Filter wissen',
        fr: 'Effacer le filtre',
        en: 'Clear Filter'
      },
      'newClient': {
        nl: 'Nieuwe Klant',
        fr: 'Nouveau Client',
        en: 'New Client'
      },
      'createClient': {
        nl: 'Klant Aanmaken',
        fr: 'Créer Client',
        en: 'Create Client'
      },
      'creating': {
        nl: 'Aanmaken',
        fr: 'Création',
        en: 'Creating'
      },
      'clientCreatedSuccessfully': {
        nl: 'Klant succesvol aangemaakt!',
        fr: 'Client créé avec succès!',
        en: 'Client created successfully!'
      },
      'socialSecretaryPreFilled': {
        nl: 'Sociaal secretariaat is automatisch ingevuld',
        fr: 'Le secrétariat social est pré-rempli automatiquement',
        en: 'Social secretary is automatically pre-filled'
      },
      'fullNameRequired': {
        nl: 'Volledige naam is verplicht',
        fr: 'Le nom complet est obligatoire',
        en: 'Full name is required'
      },
      'fullNameMinLength': {
        nl: 'Volledige naam moet minimaal 2 karakters bevatten',
        fr: 'Le nom complet doit contenir au moins 2 caractères',
        en: 'Full name must be at least 2 characters'
      },
      'emailRequired': {
        nl: 'E-mail is verplicht',
        fr: 'L\'e-mail est obligatoire',
        en: 'Email is required'
      },
      'emailInvalid': {
        nl: 'Ongeldig e-mailadres',
        fr: 'Adresse e-mail invalide',
        en: 'Invalid email address'
      },
      'phoneNumberRequired': {
        nl: 'Telefoonnummer is verplicht',
        fr: 'Le numéro de téléphone est obligatoire',
        en: 'Phone number is required'
      },
      'phoneNumberInvalid': {
        nl: 'Ongeldig telefoonnummer',
        fr: 'Numéro de téléphone invalide',
        en: 'Invalid phone number'
      },
      'companyNumberRequired': {
        nl: 'Ondernemingsnummer is verplicht',
        fr: 'Le numéro d\'entreprise est obligatoire',
        en: 'Company number is required'
      },
      'companyNumberInvalid': {
        nl: 'Ongeldig ondernemingsnummer (formaat: BE0123456789)',
        fr: 'Numéro d\'entreprise invalide (format: BE0123456789)',
        en: 'Invalid company number (format: BE0123456789)'
      },
      'companyNameRequired': {
        nl: 'Bedrijfsnaam is verplicht',
        fr: 'Le nom de l\'entreprise est obligatoire',
        en: 'Company name is required'
      },
      'companyInformation': {
        nl: 'Bedrijfsinformatie',
        fr: 'Informations sur l\'entreprise',
        en: 'Company Information'
      },
      'address': {
        nl: 'Adres',
        fr: 'Adresse',
        en: 'Address'
      },
      'newPolicy': {
        nl: 'Nieuwe Policy',
        fr: 'Nouvelle Politique',
        en: 'New Policy'
      },
      'startNewPolicy': {
        nl: 'Start een nieuwe policy voor deze klant',
        fr: 'Démarrer une nouvelle politique pour ce client',
        en: 'Start a new policy for this client'
      },
      'errorCreatingSession': {
        nl: 'Fout bij het aanmaken van een nieuwe sessie. Probeer opnieuw.',
        fr: 'Erreur lors de la création d\'une nouvelle session. Veuillez réessayer.',
        en: 'Error creating new session. Please try again.'
      },
      'searchCars': {
        nl: 'Zoek auto\'s...',
        fr: 'Rechercher des voitures...',
        en: 'Search cars...'
      },
      'selectReferenceCar': {
        nl: 'Selecteer referentieauto',
        fr: 'Sélectionner une voiture de référence',
        en: 'Select Reference Car'
      },
      'selectReferenceCars': {
        nl: 'Selecteer referentieauto\'s',
        fr: 'Sélectionner des voitures de référence',
        en: 'Select Reference Cars'
      },
      'carsSelected': {
        nl: 'auto\'s geselecteerd',
        fr: 'voitures sélectionnées',
        en: 'cars selected'
      },
      'models': {
        nl: 'modellen',
        fr: 'modèles',
        en: 'models'
      },
      'noCarsFound': {
        nl: 'Geen auto\'s gevonden',
        fr: 'Aucune voiture trouvée',
        en: 'No cars found'
      },
      'updateCarCategory': {
        nl: 'Autocategorie bijwerken',
        fr: 'Mettre à jour la catégorie de voiture',
        en: 'Update Car Category'
      },
      'saveCarCategory': {
        nl: 'Autocategorie opslaan',
        fr: 'Enregistrer la catégorie de voiture',
        en: 'Save Car Category'
      },
      'carCategory': {
        nl: 'Autocategorie',
        fr: 'Catégorie de voiture',
        en: 'Car Category'
      },
      'parameters': {
        nl: 'Parameters',
        fr: 'Paramètres',
        en: 'Parameters'
      },
      'name': {
        nl: 'Naam:',
        fr: 'Nom :',
        en: 'Name:'
      },
      'yes': {
        nl: 'Ja',
        fr: 'Oui',
        en: 'Yes'
      },
      'no': {
        nl: 'Nee',
        fr: 'Non',
        en: 'No'
      },
      'annualKilometer': {
        nl: 'Jaarlijkse kilometer:',
        fr: 'Kilomètre annuel :',
        en: 'Annual Kilometer:'
      },
      'leasingDurationLabel': {
        nl: 'Lease duur:',
        fr: 'Durée de location :',
        en: 'Leasing Duration:'
      },

      'fuelType': {
        nl: 'Brandstoftype:',
        fr: 'Type de carburant :',
        en: 'Fuel Type:'
      },
      'minimum': {
        nl: 'Minimum',
        fr: 'Minimum',
        en: 'Minimum'
      },
      'maximum': {
        nl: 'Maximum',
        fr: 'Maximum',
        en: 'Maximum'
      },
      // Step 4: Car Categories & TCO's additional translations
      'tcoCalculationDetails': {
        nl: 'TCO berekening details',
        fr: 'Détails du calcul TCO',
        en: 'TCO Calculation Details'
      },
      'parametersUsedInCalculation': {
        nl: 'Parameters gebruikt in berekening',
        fr: 'Paramètres utilisés dans le calcul',
        en: 'Parameters used in calculation'
      },
      'carCategoriesAndTcos': {
        nl: 'Autocategorieën en TCO\'s',
        fr: 'Catégories de voitures et TCO',
        en: 'Car categories and TCO\'s'
      },
      'inspireMe': {
        nl: 'Inspireer me',
        fr: 'Inspirez-moi',
        en: 'Inspire me'
      },
      'addCategory': {
        nl: 'Categorie toevoegen',
        fr: 'Ajouter une catégorie',
        en: 'Add category'
      },
      'noCarCategoriesYet': {
        nl: 'Nog geen autocategorieën',
        fr: 'Aucune catégorie de voiture pour le moment',
        en: 'No car categories yet'
      },
      'getStartedByAddingYourFirstCarCategory': {
        nl: 'Begin door je eerste autocategorie toe te voegen of laat je inspireren door enkele suggesties.',
        fr: 'Commencez par ajouter votre première catégorie de voiture ou laissez-nous vous inspirer avec quelques suggestions.',
        en: 'Get started by adding your first car category or let us inspire you with some suggestions.'
      },
      'referenceCar': {
        nl: 'Referentieauto',
        fr: 'Voiture de référence',
        en: 'Reference car'
      },
      'annualKm': {
        nl: 'Jaarlijkse km',
        fr: 'Km annuels',
        en: 'Annual km'
      },
      'leasingDurationTable': {
        nl: 'Lease duur',
        fr: 'Durée de location',
        en: 'Leasing Duration'
      },
      'monthlyTcoTable': {
        nl: 'Maandelijkse TCO',
        fr: 'TCO mensuel',
        en: 'Monthly TCO'
      },
      'pleaseAddAtLeastOneCarCategory': {
        nl: 'Voeg ten minste één autocategorie toe om door te gaan',
        fr: 'Veuillez ajouter au moins une catégorie de voiture pour continuer',
        en: 'Please add at least one car category to proceed'
      },
      'allCategoriesMustHaveReferenceCarAndTcoCalculation': {
        nl: 'Alle categorieën moeten een referentieauto en TCO berekening hebben om door te gaan',
        fr: 'Toutes les catégories doivent avoir une voiture de référence et un calcul TCO pour continuer',
        en: 'All categories must have a reference car and TCO calculation to proceed'
      },
      'sendForReview': {
        nl: 'Versturen voor beoordeling',
        fr: 'Envoyer pour examen',
        en: 'Send for review'
      },
      'readyToSubmitForReview': {
        nl: 'Klaar om in te dienen voor beoordeling',
        fr: 'Prêt à soumettre pour examen',
        en: 'Ready to submit for review'
      },
      'submitForReview': {
        nl: 'Indienen voor beoordeling',
        fr: 'Soumettre pour examen',
        en: 'Submit for review'
      },
      'pleaseReviewYourCategoriesAndSubmit': {
        nl: 'Controleer je categorieën en dien in voor beoordeling',
        fr: 'Vérifiez vos catégories et soumettez pour examen',
        en: 'Please review your categories and submit for review'
      },
      'completeAllCategoriesFirst': {
        nl: 'Voltooi eerst alle categorieën',
        fr: 'Complétez d\'abord toutes les catégories',
        en: 'Complete all categories first'
      },
      'allCategoriesMustHaveValidTco': {
        nl: 'Alle categorieën moeten een geldige TCO hebben',
        fr: 'Toutes les catégories doivent avoir un TCO valide',
        en: 'All categories must have a valid TCO'
      },
      // Step 5: Review Confirmation translations
      'yourMobilityBudgetPolicy': {
        nl: 'Je mobiliteitsbudget policy',
        fr: 'Votre politique de budget mobilité',
        en: 'Your mobility budget policy'
      },
      'documentStatus': {
        nl: 'Document status',
        fr: 'Statut du document',
        en: 'Document Status'
      },
      'yourPolicyIsBeingReviewedBy': {
        nl: 'Je policy wordt beoordeeld door',
        fr: 'Votre politique est examinée par',
        en: 'Your policy is being reviewed by'
      },
      'yourPolicyHasBeenApproved': {
        nl: 'Je policy is goedgekeurd!',
        fr: 'Votre politique a été approuvée !',
        en: 'Your policy has been approved!'
      },
      'yourPolicyNeedsRevisions': {
        nl: 'Je policy heeft revisies nodig.',
        fr: 'Votre politique nécessite des révisions.',
        en: 'Your policy needs revisions.'
      },
      'documentPreview': {
        nl: 'Document voorvertoning',
        fr: 'Aperçu du document',
        en: 'Document Preview'
      },
      'editDocument': {
        nl: 'Document bewerken',
        fr: 'Modifier le document',
        en: 'Edit Document'
      },
      'saveChanges': {
        nl: 'Wijzigingen opslaan',
        fr: 'Enregistrer les modifications',
        en: 'Save Changes'
      },
      'cancel': {
        nl: 'Annuleren',
        fr: 'Annuler',
        en: 'Cancel'
      },
      'editYourDocumentContentHere': {
        nl: 'Bewerk je document inhoud hier...',
        fr: 'Modifiez le contenu de votre document ici...',
        en: 'Edit your document content here...'
      },
      'noDocumentAvailableYet': {
        nl: 'Nog geen document beschikbaar',
        fr: 'Aucun document disponible pour le moment',
        en: 'No document available yet'
      },
      'status': {
        nl: 'Status',
        fr: 'Statut',
        en: 'Status'
      },
      'generatingDocument': {
        nl: 'Document genereren...',
        fr: 'Génération du document...',
        en: 'Generating document...'
      },
      'pleaseWaitWhileWeCreateYourTcoDocument': {
        nl: 'Even geduld terwijl we je TCO document maken',
        fr: 'Veuillez patienter pendant que nous créons votre document TCO',
        en: 'Please wait while we create your TCO document'
      },
      'approve': {
        nl: 'Goedkeuren',
        fr: 'Approuver',
        en: 'Approve'
      },
      'reject': {
        nl: 'Afwijzen',
        fr: 'Rejeter',
        en: 'Reject'
      },
      'rejectAndResetToStep4': {
        nl: 'Afwijzen en resetten naar stap 4',
        fr: 'Rejeter et réinitialiser à l\'étape 4',
        en: 'Reject & Reset to Step 4'
      },
      'download': {
        nl: 'Downloaden',
        fr: 'Télécharger',
        en: 'Download'
      },
      'edit': {
        nl: 'Bewerken',
        fr: 'Modifier',
        en: 'Edit'
      },
      'youCanNowDownloadYourDocumentInDifferentLanguages': {
        nl: 'Je kunt nu je document downloaden in verschillende talen.',
        fr: 'Vous pouvez maintenant télécharger votre document dans différentes langues.',
        en: 'You can now download your document in different languages.'
      },
      'downloadEnglish': {
        nl: 'Downloaden (Engels)',
        fr: 'Télécharger (Anglais)',
        en: 'Download (English)'
      },
      'downloadNederlands': {
        nl: 'Downloaden (Nederlands)',
        fr: 'Télécharger (Néerlandais)',
        en: 'Download (Nederlands)'
      },
      'downloadFrancais': {
        nl: 'Downloaden (Frans)',
        fr: 'Télécharger (Français)',
        en: 'Download (Français)'
      },
      'yourPolicyIsBeingReviewedByPartner': {
        nl: 'Je policy wordt beoordeeld door',
        fr: 'Votre politique est examinée par',
        en: 'Your policy is being reviewed by'
      },
      'onceReadyYouWillBeNotifiedByEmail': {
        nl: 'Zodra klaar, krijg je een e-mailmelding.',
        fr: 'Une fois prêt, vous serez notifié par e-mail.',
        en: 'Once ready, you will be notified by email.'
      },
      'pleaseContactPartnerForMoreInformation': {
        nl: 'Neem contact op met',
        fr: 'Veuillez contacter',
        en: 'Please contact'
      },
      'forMoreInformation': {
        nl: 'voor meer informatie.',
        fr: 'pour plus d\'informations.',
        en: 'for more information.'
      },
      'yourPolicyHasBeenSubmittedForReview': {
        nl: 'Je policy is ingediend voor beoordeling!',
        fr: 'Votre politique a été soumise pour examen !',
        en: 'Your policy has been submitted for review!'
      },
      'itWillBeReviewedByPartnerAndYouWillBeNotifiedByEmail': {
        nl: 'Het wordt beoordeeld door',
        fr: 'Il sera examiné par',
        en: 'It will be reviewed by'
      },
      'onceReady': {
        nl: 'en je krijgt een e-mailmelding zodra het klaar is.',
        fr: 'et vous serez notifié par e-mail une fois prêt.',
        en: 'and you will be notified by email once ready.'
      },
      // Complete sentences for better formatting
      'yourPolicyHasBeenSubmittedForReviewComplete': {
        nl: 'Je policy is ingediend voor beoordeling! Het wordt beoordeeld door',
        fr: 'Votre politique a été soumise pour examen ! Il sera examiné par',
        en: 'Your policy has been submitted for review! It will be reviewed by'
      },
      'andYouWillBeNotifiedByEmailOnceReady': {
        nl: 'en je krijgt een e-mailmelding zodra het klaar is.',
        fr: 'et vous serez notifié par e-mail une fois prêt.',
        en: 'and you will be notified by email once ready.'
      },
      'yourPolicyIsBeingReviewedByPartnerComplete': {
        nl: 'Je policy wordt beoordeeld door',
        fr: 'Votre politique est examinée par',
        en: 'Your policy is being reviewed by'
      },
      'onceReadyYouWillBeNotifiedByEmailComplete': {
        nl: 'Zodra klaar, krijg je een e-mailmelding.',
        fr: 'Une fois prêt, vous serez notifié par e-mail.',
        en: 'Once ready, you will be notified by email.'
      },
      'yourPolicyNeedsRevisionsComplete': {
        nl: 'Je policy heeft revisies nodig. Neem contact op met',
        fr: 'Votre politique nécessite des révisions. Veuillez contacter',
        en: 'Your policy needs revisions. Please contact'
      },
      'forMoreInformationComplete': {
        nl: 'voor meer informatie.',
        fr: 'pour plus d\'informations.',
        en: 'for more information.'
      },
      // Partner Login translations
      'accessYourClientSessions': {
        nl: 'Toegang tot je klant sessies',
        fr: 'Accédez à vos sessions clients',
        en: 'Access your client sessions'
      },
      'enterYourPartnerEmail': {
        nl: 'Voer je partner e-mail in',
        fr: 'Entrez votre e-mail partenaire',
        en: 'Enter your partner email'
      },
      'accessPartnerDashboard': {
        nl: 'Toegang tot Partner Dashboard',
        fr: 'Accéder au tableau de bord partenaire',
        en: 'Access Partner Dashboard'
      },
      'loggingIn': {
        nl: 'Inloggen...',
        fr: 'Connexion...',
        en: 'Logging in...'
      },
      'needHelpContactOurSupportTeam': {
        nl: 'Hulp nodig? Neem contact op met ons support team op support&#64;mobility.be',
        fr: 'Besoin d\'aide ? Contactez notre équipe de support à support&#64;mobility.be',
        en: 'Need help? Contact our support team at support&#64;mobility.be'
      },
      // Partner Dashboard translations
      'loggedInAs': {
        nl: 'Ingelogd als:',
        fr: 'Connecté en tant que :',
        en: 'Logged in as:'
      },

      'clientPoliciesOverview': {
        nl: 'Klant Policy Overzicht',
        fr: 'Aperçu des politiques clients',
        en: 'Client Policies Overview'
      },
      'manageAndReviewAllYourClientsMobilityBudgetPolicies': {
        nl: 'Beheer en beoordeel alle mobiliteitsbudget policies van je klanten',
        fr: 'Gérez et examinez toutes les politiques de budget mobilité de vos clients',
        en: 'Manage and review all your clients\' mobility budget policies'
      },
      'loadingClientPolicies': {
        nl: 'Klant policies laden...',
        fr: 'Chargement des politiques clients...',
        en: 'Loading client policies...'
      },
      'tryAgain': {
        nl: 'Opnieuw proberen',
        fr: 'Réessayer',
        en: 'Try Again'
      },
      'filterByCompanyName': {
        nl: 'Filter op bedrijfsnaam...',
        fr: 'Filtrer par nom d\'entreprise...',
        en: 'Filter by company name...'
      },
      'clearFilter': {
        nl: 'Filter wissen',
        fr: 'Effacer le filtre',
        en: 'Clear filter'
      },
      'unknownContact': {
        nl: 'Onbekend Contact',
        fr: 'Contact inconnu',
        en: 'Unknown Contact'
      },
      'noEmail': {
        nl: 'Geen e-mail',
        fr: 'Aucun e-mail',
        en: 'No email'
      },
      'step': {
        nl: 'Stap',
        fr: 'Étape',
        en: 'Step'
      },
      'categoryCount': {
        nl: 'categorieën',
        fr: 'catégories',
        en: 'categories'
      },
      'completed': {
        nl: 'voltooid',
        fr: 'terminé',
        en: 'completed'
      },
      'openSession': {
        nl: 'Sessie Openen',
        fr: 'Ouvrir la session',
        en: 'Open Session'
      },
      'delete': {
        nl: 'Verwijderen',
        fr: 'Supprimer',
        en: 'Delete'
      },
      'deleting': {
        nl: 'Verwijderen...',
        fr: 'Suppression...',
        en: 'Deleting...'
      },
      'policy': {
        nl: 'Policy',
        fr: 'Politique',
        en: 'Policy'
      },
      'policies': {
        nl: 'Policies',
        fr: 'Politiques',
        en: 'Policies'
      },
      'noClientPoliciesFound': {
        nl: 'Geen Klant Policies Gevonden',
        fr: 'Aucune politique client trouvée',
        en: 'No Client Policies Found'
      },
      'youDontHaveAnyClientPoliciesYet': {
        nl: 'Je hebt nog geen klant policies. Policies verschijnen hier zodra je klanten beginnen met het maken van mobiliteitsbudget policies.',
        fr: 'Vous n\'avez pas encore de politiques clients. Les politiques apparaîtront ici une fois que vos clients commenceront à créer des politiques de budget mobilité.',
        en: 'You don\'t have any client policies yet. Policies will appear here once your clients start creating mobility budget policies.'
      },
      'generatingPolicyDocuments': {
        nl: 'Policy documenten worden gegenereerd...',
        fr: 'Génération des documents de politique...',
        en: 'Generating policy documents...'
      },
      'errorLoadingDocument': {
        nl: 'Fout bij het laden van het document',
        fr: 'Erreur lors du chargement du document',
        en: 'Error loading document'
      },
      'errorGeneratingDocument': {
        nl: 'Fout bij het genereren van het document',
        fr: 'Erreur lors de la génération du document',
        en: 'Error generating document'
      },
    'completedPolicy': {
      nl: 'Voltooide policy',
      fr: 'Politique terminée',
      en: 'Completed policy'
    },
    'completedPolicies': {
      nl: 'Voltooide policies',
      fr: 'Politiques terminées',
      en: 'Completed policies'
    },
    'inProgressPolicy': {
      nl: 'Policy in uitvoering',
      fr: 'Politique en cours',
      en: 'In progress policy'
    },
    'inProgressPolicies': {
      nl: 'Policies in uitvoering',
      fr: 'Politiques en cours',
      en: 'In progress policies'
    },
    'draftPolicy': {
      nl: 'Concept policy',
      fr: 'Politique brouillon',
      en: 'Draft policy'
    },
    'draftPolicies': {
      nl: 'Concept policies',
      fr: 'Politiques brouillon',
      en: 'Draft policies'
    },
    'nextStep': {
      nl: 'Volgende stap',
      fr: 'Étape suivante',
      en: 'Next step'
    }
  };

  constructor() {
    this.loadSavedLanguage();
  }

  private loadSavedLanguage(): void {
    const savedLanguage = localStorage.getItem('preferredLanguage') as Language;
    
    if (savedLanguage && ['nl', 'fr', 'en'].includes(savedLanguage)) {
      this.setLanguage(savedLanguage);
    } else {
      this.detectBrowserLanguage();
    }
  }

  private detectBrowserLanguage(): void {
    const browserLang = navigator.language.toLowerCase();
    
    if (browserLang.startsWith('nl') || browserLang.startsWith('be-nl')) {
      this.setLanguage('nl');
    } else if (browserLang.startsWith('fr') || browserLang.startsWith('be-fr')) {
      this.setLanguage('fr');
    } else {
      this.setLanguage('en');
    }
  }

  public setLanguage(language: Language): void {
    this.currentLanguageSubject.next(language);
    localStorage.setItem('preferredLanguage', language);
  }

  public getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  public translate(key: string): string {
    const translation = this.translations[key];
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    const currentLang = this.getCurrentLanguage();
    return translation[currentLang] || translation['en'];
  }

  public getAvailableLanguages(): { code: Language; name: string; flag: string }[] {
    return [
      { code: 'nl', name: 'Nl', flag: '🇧🇪' },
      { code: 'fr', name: 'Fr', flag: '🇧🇪' },
      { code: 'en', name: 'En', flag: '🇬🇧' }
    ];
  }
} 