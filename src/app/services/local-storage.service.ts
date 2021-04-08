import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenModel } from '../models/tokenModel';
import { UserModel } from '../models/userModel';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }



  setToken(tokenModel: TokenModel) {
    localStorage.setItem("token", tokenModel.token);
    localStorage.setItem("expiration", tokenModel.expiration);
  }

  getToken() {
    return localStorage.getItem("token")
  }

  getExpiration() {
    return localStorage.getItem("expiration")
  }

  setUser(userModel: UserModel) {
    localStorage.setItem("uid", (userModel.id+888).toString());
    localStorage.setItem("name", userModel.firstName+' '+userModel.lastName);
    localStorage.setItem("email", userModel.email);
  }
  
  setName(name:string){
    localStorage.setItem("name", name);
  }
  
  getEmail() {
    return localStorage.getItem("email")
  }

  getName() {
    return localStorage.getItem("name")
  }

  getUserId() {
    return Number(localStorage.getItem("uid"))-888;
    
  }

  isThereItem(key: string) {
    if (localStorage.getItem(key)) {
      return true;
    } else {
      return false;
    }
  }

  get(key: string) {
    return localStorage.getItem(key);
  }


  set(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }

}
