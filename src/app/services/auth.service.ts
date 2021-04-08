import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginComponent } from '../components/login/login.component';
import { DataResponseModel } from '../models/dataResponseModel';
import { LoginModel } from '../models/loginModel';
import { TokenModel } from '../models/tokenModel';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { RegisterModel } from '../models/registerModel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = 'https://localhost:44356/api/';

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) { }

  isAuthenticated() {
    let expariton = this.localStorageService.getExpiration();
    let now = new Date();
    let token = this.localStorageService.getToken();
    if (token && expariton) {
      let exparitonDate = new Date(expariton);
      if (now < exparitonDate) {
        return true;
      }
    }
    return false;
  }

  login(loginModel: LoginModel): Observable<DataResponseModel<TokenModel>> {
    return this.httpClient.post<DataResponseModel<TokenModel>>(
      this.apiUrl + 'auth/login', loginModel);
  }

  register(registerModel: RegisterModel): Observable<DataResponseModel<TokenModel>> {
    return this.httpClient.post<DataResponseModel<TokenModel>>(
      this.apiUrl + 'auth/register', registerModel);
  }

  update(registerModel: RegisterModel): Observable<DataResponseModel<TokenModel>> {
    return this.httpClient.post<DataResponseModel<TokenModel>>(
      this.apiUrl + 'auth/update', registerModel);
  }

}
