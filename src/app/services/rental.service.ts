import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Rental } from '../models/rental';
import { RentalDto } from '../models/rentalDto';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  tempRental:Rental;
  apiUrl = 'https://localhost:44356/api/';
  constructor(private httpClient: HttpClient) { }
  
  getRentals(): Observable<ListResponseModel<RentalDto>> {
    let newPath = this.apiUrl + "rentals/getrentaldetails"
    return this.httpClient.get<ListResponseModel<RentalDto>>(newPath);
  }
  carRentable(carId:number): Observable<ResponseModel> {
    let newPath = this.apiUrl + "rentals/carrentable?carid="+carId
    return this.httpClient.get<ResponseModel>(newPath);
  }
  carRentableByRentDate(carId:number,rentDate:Date): Observable<ResponseModel> {
    let newPath = this.apiUrl + "rentals/carrentablebyrentdate?carid="+carId+"&rentDate="+rentDate
    return this.httpClient.get<ResponseModel>(newPath);
  }
}
