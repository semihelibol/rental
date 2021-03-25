import { Pipe, PipeTransform } from '@angular/core';
import { CarDto } from '../models/carDto';

@Pipe({
  name: 'filterCar'
})
export class FilterCarPipe implements PipeTransform {
  transform(value: CarDto[],filterText:string): CarDto[] {
    filterText=filterText?filterText.toLocaleLowerCase():""
    return filterText?value.filter((b:CarDto)=>b.carName.toLocaleLowerCase().indexOf(filterText)!==-1):value;
  }
}