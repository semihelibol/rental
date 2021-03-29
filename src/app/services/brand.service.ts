import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand';
import { ListResponseModel } from '../models/listResponseModel';
import { DataResponseModel } from '../models/dataResponseModel';
import { ResponseModel } from '../models/responseModel';


@Injectable({
  providedIn: 'root'
})
export class BrandService {
  currentBrandId:number=0;
  apiUrl = 'https://localhost:44356/api/';
  constructor(private httpClient: HttpClient) { }
  
  getBrands(): Observable<ListResponseModel<Brand>> {
    let newPath = this.apiUrl + "brands/getall"
    return this.httpClient.get<ListResponseModel<Brand>>(newPath);
  }

  getBrandById(id:number): Observable<DataResponseModel<Brand>> {
    let newPath = this.apiUrl + "brands/getbyid?id="+id;
    return this.httpClient.get<DataResponseModel<Brand>>(newPath);
  }
  
  add(brand:Brand):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl+"brands/add",brand)
  }

  update(brand:Brand):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl+"brands/update",brand)
  }

}
