import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandComponent } from './components/brand/brand.component';
import { CarDetailComponent } from './components/car-detail/car-detail.component';
import { CarComponent } from './components/car/car.component';
import { ColorComponent } from './components/color/color.component';
import { CustomerComponent } from './components/customer/customer.component';
import { PaymentCreditcardComponent } from './components/payment-creditcard/payment-creditcard.component';
import { RentalAddComponent } from './components/rental-add/rental-add.component';
import { RentalComponent } from './components/rental/rental.component';

const routes: Routes = [
  {path:"",pathMatch:"full", component:CarComponent},
  {path:"brands", component:CarComponent},
  {path:"cars/brand/:brandId", component:CarComponent},
  {path:"colors", component:ColorComponent},
  {path:"cars/color/:colorId", component:CarComponent},
  {path:"cars/car-detail/:carId", component:CarDetailComponent},
  {path:"cars/brandcolor/:brandId/:colorId", component:CarComponent},
  {path:"rentals/rental-add/:carId", component:RentalAddComponent},
  {path:"payment/creditcard",component:PaymentCreditcardComponent},
  {path:"customers", component:CustomerComponent},
  {path:"cars", component:CarComponent},
  {path:"rentals", component:RentalComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
