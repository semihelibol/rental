import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Car } from '../models/car';
import { CarDto } from '../models/carDto';
import { DataResponseModel } from '../models/dataResponseModel';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  apiUrl = 'https://localhost:44356/api/';
  constructor(private httpClient: HttpClient) { }
  
  getCarDetails(): Observable<ListResponseModel<CarDto>> {
    let newPath = this.apiUrl + "cars/getcardetails"
    return this.httpClient.get<ListResponseModel<CarDto>>(newPath);    
  }

  getCarDetailsByBrand(brandId:number):Observable<ListResponseModel<CarDto>> {
    let newPath = this.apiUrl + "cars/getcardetailsbybrandid?brandid="+brandId
    return this.httpClient.get<ListResponseModel<CarDto>>(newPath);
  }

  getCarDetailsByColor(colorId:number):Observable<ListResponseModel<CarDto>> {
    let newPath = this.apiUrl + "cars/getcardetailsbycolorid?colorid="+colorId
    return this.httpClient.get<ListResponseModel<CarDto>>(newPath);
  }
  
  getCarDetailsById(id:number):Observable<DataResponseModel<CarDto>> {
    let newPath = this.apiUrl + "cars/getcardetailsbyid?id="+id
    return this.httpClient.get<DataResponseModel<CarDto>>(newPath);
  }
  
  getCarDetailsByBrandColor(brandId:number,colorId:number):Observable<ListResponseModel<CarDto>> {
    let newPath = this.apiUrl + "cars/getcardetailsbybrandidcolorid?brandId="+brandId+"&colorId="+colorId
    return this.httpClient.get<ListResponseModel<CarDto>>(newPath);
  }

  getCarById(id:number):Observable<DataResponseModel<Car>> {
    let newPath = this.apiUrl + "cars/getbyid?id="+id
    return this.httpClient.get<DataResponseModel<Car>>(newPath);
  }

  add(car:Car):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl+"cars/add",car)
  }

  update(car:Car):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl+"cars/update",car)
  }


}