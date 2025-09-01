import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarCategoryInfo } from '../../services/file-upload.service';

@Component({
  selector: 'app-ai-analysis-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-analysis-popup.component.html',
  styleUrls: ['./ai-analysis-popup.component.scss']
})
export class AiAnalysisPopupComponent {
  @Input() isVisible = false;
  @Input() categories: CarCategoryInfo[] = [];
  @Input() fileName = '';
  @Output() close = new EventEmitter<void>();
  @Output() addCategories = new EventEmitter<CarCategoryInfo[]>();

  selectedCategories: CarCategoryInfo[] = [];

  onClose(): void {
    this.close.emit();
  }

  onAddCategories(): void {
    this.addCategories.emit(this.selectedCategories);
    this.close.emit();
  }

  toggleCategorySelection(category: CarCategoryInfo): void {
    const index = this.selectedCategories.findIndex(c => c.categoryName === category.categoryName);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
  }

  isCategorySelected(category: CarCategoryInfo): boolean {
    return this.selectedCategories.some(c => c.categoryName === category.categoryName);
  }

  getConfidenceColor(confidence: number): string {
    if (confidence >= 0.8) return '#28a745';
    if (confidence >= 0.6) return '#ffc107';
    return '#dc3545';
  }

  getConfidenceText(confidence: number): string {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  }
}
