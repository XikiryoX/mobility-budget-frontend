import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TcoConverterComponent } from './tco-converter/tco-converter.component';
import { ViesFreeService } from './services/vies-free.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    HttpClientModule,
    LoginComponent,
    SignupComponent,
    TcoConverterComponent
  ],
  providers: [
    ViesFreeService
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'mobility-app';
}
