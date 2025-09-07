import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('🔐 AuthInterceptor - Request URL:', req.url);
  console.log('🔐 AuthInterceptor - Backend URL:', environment.backendUrl);
  
  // Always add auth headers for now to debug
  const credentials = btoa(`${environment.auth.username}:${environment.auth.password}`);
  console.log('🔐 AuthInterceptor - Adding auth headers for:', req.url);
  
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Basic ${credentials}`
    }
  });
  
  return next(authReq);
};
