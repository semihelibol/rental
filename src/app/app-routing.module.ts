import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandAddComponent } from './components/brand-add/brand-add.component';
import { BrandComponent } from './components/brand/brand.component';
import { CarAddComponent } from './components/car-add/car-add.component';
import { CarDetailComponent } from './components/car-detail/car-detail.component';
import { CarComponent } from './components/car/car.component';
import { ColorAddComponent } from './components/color-add/color-add.component';
import { ColorComponent } from './components/color/color.component';
import { CustomerComponent } from './components/customer/customer.component';
import { PaymentCreditcardComponent } from './components/payment-creditcard/payment-creditcard.component';
import { RentalAddComponent } from './components/rental-add/rental-add.component';
import { RentalComponent } from './components/rental/rental.component';

const routes: Routes = [
  {path:"",pathMatch:"full", component:CarComponent},
  {path:"brands", component:BrandComponent},
  {path:"cars/brand/:brandId", component:CarComponent},
  {path:"colors", component:ColorComponent},
  {path:"cars/color/:colorId", component:CarComponent},
  {path:"cars/car-detail/:carId", component:CarDetailComponent},
  {path:"cars/brandcolor/:brandId/:colorId", component:CarComponent},
  {path:"rentals/rental-add/:carId", component:RentalAddComponent},
  {path:"payment/creditcard",component:PaymentCreditcardComponent},
  {path:"brands/add", component:BrandAddComponent},
  {path:"brands/update/:id", component:BrandAddComponent},
  {path:"colors/add", component:ColorAddComponent},
  {path:"colors/update/:id", component:ColorAddComponent},
  {path:"customers", component:CustomerComponent},
  {path:"cars", component:CarComponent},
  {path:"cars/add", component:CarAddComponent},
  {path:"cars/update/:id", component:CarAddComponent},
  {path:"rentals", component:RentalComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
