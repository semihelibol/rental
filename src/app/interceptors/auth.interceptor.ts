import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.authService.isAuthenticated()) {
      let newRequest: HttpRequest<any>;
      newRequest = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + this.localStorageService.getToken()),
      });
      return next.handle(newRequest);
    }
    return next.handle(request);
  }
}
