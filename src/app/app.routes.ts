import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TcoConverterComponent } from './tco-converter/tco-converter.component';
import { UserSessionsComponent } from './user-sessions/user-sessions.component';
import { PartnerLoginComponent } from './partner-login/partner-login.component';
import { PartnerDashboardComponent } from './partner-dashboard/partner-dashboard.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'tco-converter', component: TcoConverterComponent },
  { path: 'user-sessions', component: UserSessionsComponent },
  { path: 'partner-login', component: PartnerLoginComponent },
  { path: 'partner-dashboard', component: PartnerDashboardComponent },
  { path: '**', redirectTo: '' }
];
