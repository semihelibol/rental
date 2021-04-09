import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations"

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrandComponent } from './components/brand/brand.component';
import { ColorComponent } from './components/color/color.component';
import { CustomerComponent } from './components/customer/customer.component';
import { CarComponent } from './components/car/car.component';
import { RentalComponent } from './components/rental/rental.component';
import { NaviComponent } from './components/navi/navi.component';
import { CarDetailComponent } from './components/car-detail/car-detail.component';
import { FilterBrandPipe } from './pipes/filter-brand.pipe';
import { FilterCarPipe } from './pipes/filter-car.pipe';
import { FilterColorPipe } from './pipes/filter-color.pipe';
import { CarFilterComponent } from './components/car-filter/car-filter.component';
import { RentalAddComponent } from './components/rental-add/rental-add.component';

import {ToastrModule} from "ngx-toastr";
import { PaymentCreditcardComponent } from './components/payment-creditcard/payment-creditcard.component';
import { BrandAddComponent } from './components/brand-add/brand-add.component';
import { ColorAddComponent } from './components/color-add/color-add.component';
import { BrandMenuComponent } from './components/navi/brand-menu/brand-menu.component';
import { ColorMenuComponent } from './components/navi/color-menu/color-menu.component';
import { CarMenuComponent } from './components/navi/car-menu/car-menu.component';
import { CustomerMenuComponent } from './components/navi/customer-menu/customer-menu.component';
import { UserMenuComponent } from './components/navi/user-menu/user-menu.component';
import { CarAddComponent } from './components/car-add/car-add.component';
import { LoginComponent } from './components/login/login.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { RegisterComponent } from './components/register/register.component';
import { UserUpdateComponent } from './components/user-update/user-update.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { TextDirective } from './directives/text.directive';


@NgModule({
  declarations: [
    AppComponent,
    BrandComponent,
    ColorComponent,
    CustomerComponent,
    CarComponent,
    RentalComponent,
    NaviComponent,
    CarDetailComponent,
    FilterBrandPipe,
    FilterCarPipe,
    FilterColorPipe,
    CarFilterComponent,
    RentalAddComponent,
    PaymentCreditcardComponent,
    BrandAddComponent,
    ColorAddComponent,
    BrandMenuComponent,
    ColorMenuComponent,
    CarMenuComponent,
    CustomerMenuComponent,
    UserMenuComponent,
    CarAddComponent,
    LoginComponent,
    RegisterComponent,
    UserUpdateComponent,
    UserProfileComponent,
    TextDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass:"toast-bottom-right"
    })
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS, useClass:AuthInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
