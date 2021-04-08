import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/responseModel';
import { HttpClient } from '@angular/common/http';
import { CreditCard } from '../models/creditCard';
import { PayByCreditCardDto } from '../models/payByCreditCardDto';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  apiUrl = 'https://localhost:44356/api/';
  constructor(private httpClient: HttpClient) { }
  

  creditCardControl(creditCard:CreditCard): Observable<ResponseModel> {
    let newPath = this.apiUrl + "payments/checkifcreditcard";
    return this.httpClient.post<ResponseModel>(newPath,creditCard);
  }
  payByCreditCard(payByCreditCardDto:PayByCreditCardDto): Observable<ResponseModel> {
    let newPath = this.apiUrl + "payments/paybycreditcard";
    return this.httpClient.post<ResponseModel>(newPath,payByCreditCardDto);
  }
}
