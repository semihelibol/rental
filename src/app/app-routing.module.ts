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
import { LoginComponent } from './components/login/login.component';
import { NaviComponent } from './components/navi/navi.component';
import { UserMenuComponent } from './components/navi/user-menu/user-menu.component';
import { PaymentCreditcardComponent } from './components/payment-creditcard/payment-creditcard.component';
import { RegisterComponent } from './components/register/register.component';
import { RentalAddComponent } from './components/rental-add/rental-add.component';
import { RentalComponent } from './components/rental/rental.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserUpdateComponent } from './components/user-update/user-update.component';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: "", pathMatch: "full", component: CarComponent },
  { path: "brands", component: BrandComponent },
  { path: "cars/brand/:brandId", component: CarComponent },
  { path: "colors", component: ColorComponent },
  { path: "cars/color/:colorId", component: CarComponent },
  { path: "cars/car-detail/:carId", component: CarDetailComponent },
  { path: "cars/brandcolor/:brandId/:colorId", component: CarComponent },
  { path: "rentals/rental-add/:carId", component: RentalAddComponent , canActivate: [LoginGuard] },
  { path: "payment/creditcard", component: PaymentCreditcardComponent, canActivate: [LoginGuard]  },
  { path: "brands/add", component: BrandAddComponent, canActivate: [LoginGuard]  },
  { path: "brands/update/:id", component: BrandAddComponent, canActivate: [LoginGuard]  },
  { path: "colors/add", component: ColorAddComponent, canActivate: [LoginGuard]  },
  { path: "colors/update/:id", component: ColorAddComponent , canActivate: [LoginGuard] },
  { path: "customers", component: CustomerComponent , canActivate: [LoginGuard] },
  { path: "cars", component: CarComponent },
  { path: "cars/add", component: CarAddComponent, canActivate: [LoginGuard] },
  { path: "cars/update/:id", component: CarAddComponent, canActivate: [LoginGuard]  },
  { path: "rentals", component: RentalComponent },
  { path: "login", component: LoginComponent },
  { path: "logout", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "register/:id", component: UserProfileComponent, canActivate: [LoginGuard]  },
  { path: "user/:id", component: UserUpdateComponent, canActivate: [LoginGuard]  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
