import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safe',
  standalone: true
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, type: 'html' | 'url' = 'html'): SafeHtml | SafeResourceUrl {
    if (type === 'html') {
      return this.sanitizer.bypassSecurityTrustHtml(value);
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl(value);
    }
  }
}
