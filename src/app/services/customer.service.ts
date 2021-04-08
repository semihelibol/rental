import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerDto } from '../models/customerDto';
import { DataResponseModel } from '../models/dataResponseModel';
import { ListResponseModel } from '../models/listResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  
  apiUrl = 'https://localhost:44356/api/';
  constructor(private httpClient: HttpClient) { }
  
  getCustomers(): Observable<ListResponseModel<CustomerDto>> {
    let newPath = this.apiUrl + "customers/getcustomerdetails"
    return this.httpClient.get<ListResponseModel<CustomerDto>>(newPath);
  }
  getCustomersByUserId(userId:number): Observable<ListResponseModel<CustomerDto>>{
    let newPath = this.apiUrl + "customers/getcustomerdetailsbyuserid?userId="+userId;
    return this.httpClient.get<ListResponseModel<CustomerDto>>(newPath);
  }
  //https://localhost:44356/api/customers/getcustomerfindeksscorebycustomerid?customerId=1
  getCustomerFindeksScoreByCustomerId(customerId:number): Observable<DataResponseModel<number>>{
    let newPath = this.apiUrl + "customers/getcustomerfindeksscorebycustomerid?customerId="+customerId;
    return this.httpClient.get<DataResponseModel<number>>(newPath);
  }
  
}