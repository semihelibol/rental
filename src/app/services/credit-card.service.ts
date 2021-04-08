import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreditCard } from '../models/creditCard';
import { DataResponseModel } from '../models/dataResponseModel';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {

  apiUrl = 'https://localhost:44356/api/';
  constructor(private httpClient: HttpClient) { }

  getCreditCardsByCustomerId(customerId:number): Observable<ListResponseModel<CreditCard>>{
    let newPath = this.apiUrl + "creditcards/getcreditcardbycustomerid?customerId="+customerId;
    return this.httpClient.get<ListResponseModel<CreditCard>>(newPath);
  }

  getCreditCardById(id:number):Observable<DataResponseModel<CreditCard>> {
    let newPath = this.apiUrl + "creditcards/getbyid?id="+id
    return this.httpClient.get<DataResponseModel<CreditCard>>(newPath);
  }

  add(creditCard:CreditCard):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl+"creditcards/add",creditCard)
  }

  delete(creditCard:CreditCard):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl+"creditcards/delete",creditCard)
  }

}
