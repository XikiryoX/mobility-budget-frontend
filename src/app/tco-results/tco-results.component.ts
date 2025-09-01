import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TcoResult {
  vehicle: {
    id: number;
    brand: string;
    model: string;
    description: string;
    fuelType: string;
    co2Emissions: number;
    fuelConsumption: number;
    price: number;
  };
  parameters: {
    yearlyKm: number;
    duration: number;
    estimatedMonthlyLeaseCost: number;
    estimatedMonthlyFuelCost: number;
  };
  tcoBreakdown: Array<{
    label: string;
    annualAmount: number;
    subItems?: Array<{
      label: string;
      annualAmount: number;
    }>;
  }>;
  totalAnnualTCO: number;
  totalMonthlyTCO: number;
  additionalCosts: any[];
  monthlyAdjustments: any[];
}

@Component({
  selector: 'app-tco-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tco-results.component.html',
  styleUrls: ['./tco-results.component.scss']
})
export class TcoResultsComponent implements OnInit, OnChanges {
  @Input() result: TcoResult | null = null;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    console.log('TcoResultsComponent initialized');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('TcoResultsComponent changes - isVisible:', this.isVisible, 'result:', this.result);
    if (changes['isVisible']) {
      console.log('isVisible changed from', changes['isVisible'].previousValue, 'to', changes['isVisible'].currentValue);
    }
  }

  onClose(): void {
    this.close.emit();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('nl-BE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  }

  getFuelTypeDisplay(fuelType: string): string {
    switch (fuelType?.toLowerCase()) {
      case 'diesel':
        return 'Diesel';
      case 'electric':
        return 'Elektrisch';
      case 'petrol':
        return 'Benzine';
      case 'hybrid':
        return 'Hybride';
      default:
        return fuelType || 'Onbekend';
    }
  }
}

