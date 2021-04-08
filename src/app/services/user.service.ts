import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserMenuComponent } from '../components/navi/user-menu/user-menu.component';
import { DataResponseModel } from '../models/dataResponseModel';
import { ResponseModel } from '../models/responseModel';
import { UserModel } from '../models/userModel';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = 'https://localhost:44356/api/';

  constructor(private httpClient:HttpClient,private authService:AuthService) { }

  getByMail(email:string):Observable<DataResponseModel<UserModel>>{
    return this.httpClient.get<DataResponseModel<UserModel>>(this.apiUrl+"users/getbymail?email="+email);
  }

  getById(id:number):Observable<DataResponseModel<UserModel>>{
    return this.httpClient.get<DataResponseModel<UserModel>>(this.apiUrl+"users/getbyid?id="+id);
  }

  update(user:UserModel):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl+"users/update",user)
  }
}
