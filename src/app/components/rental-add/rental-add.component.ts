import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { CarDto } from 'src/app/models/carDto';
import { CustomerDto } from 'src/app/models/customerDto';
import { Rental } from 'src/app/models/rental';
import { TmpRentals } from 'src/app/models/tmpRental';
import { CarService } from 'src/app/services/car.service';
import { CustomerService } from 'src/app/services/customer.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RentalService } from 'src/app/services/rental.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-rental-add',
  templateUrl: './rental-add.component.html',
  styleUrls: ['./rental-add.component.css'],
})
export class RentalAddComponent implements OnInit {
  //userId: number;// = 2002; //giriş yapmadığımız için el ile bir userId verdim.

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private rentalService: RentalService,
    private carService: CarService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private toastrService: ToastrService
  ) { }

  rentalSuccess = false;
  rentalAddForm: FormGroup;
  customers: CustomerDto[];
  customerId: number;
  customerFindeksScore: number;
  rentDate: Date;
  returnDate: Date;
  car: CarDto;
  imagePath: string = 'https://localhost:44356/images/';
  rentable: boolean = false;
  customerFindeksVisible = false;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['carId']) {
        this.getCarDetailsById(params['carId']);
      }
    });
  }

  getCarDetailsById(carId: number) {
    this.carService.getCarDetailsById(carId).subscribe((response) => {
      this.car = response.data;
      this.createRentalAddForm();
    });
  }

  getByMail(email: string) {
    this.userService.getByMail(email).subscribe((response) => {
      if (response.data.id) {
        this.getCustomersByUserId(response.data.id);
      }
    }, (responseError) => {
      this.toastrService.error(responseError.message);
    });
  }

  createRentalAddForm() {
    this.rentalAddForm = this.formBuilder.group({
      carId: ['', Validators.required],
      customerId: ['', Validators.required],
      rentDate: ['', Validators.required],
      returnDate: ['', Validators.required],
      dailyPrice: ['', Validators.required],
    });
    let userId = this.localStorageService.getUserId();
    if (userId) {
      this.getCustomersByUserId(userId);
    }else{
      this.toastrService.error("Giriş Yapılmamış","Hata");
      this.localStorageService.clear();
      this.router.navigate(["login"]);
    }
  }

  getCustomersByUserId(userId: number) { 
    this.customerService
      .getCustomersByUserId(userId)
      .subscribe((response) => {
        this.customers = response.data;
        this.customerId = this.customers[0].id;

      });
  }

  getCustomerFindeksScoreByCustomerId(customerId: number) {
    this.customerFindeksVisible = true;
    this.customerService
      .getCustomerFindeksScoreByCustomerId(customerId)
      .subscribe((response) => {
        this.customerFindeksScore = response.data;
        if (this.rentable)
          this.payment();
      }, responseError => {
        this.customerFindeksScore = responseError.data;
      });
  }

  payment() {
    if (this.car.minFindeksScore <= this.customerFindeksScore) {
      this.toastrService.info(
        'Ödeme sayfasına yönlendiriliyorsunuz...',
        'Ödeme İşlemleri'
      );
      this.router.navigate(['/payment/creditcard/']);
    } else {
      this.toastrService.error('Müşteri findeks puanı yeterli değil.', 'Dikkat');
    }
  }

  getMinDate() {
    var today = new Date();
    return today.toISOString().slice(0, 10);
  }

  customerChange() {
    this.customerFindeksScore = 0;
    this.customerFindeksVisible = false;
  }

  carRentableByRentDate(carId: number, rentDate: Date) {
    this.rentalService.carRentableByRentDate(carId, rentDate).subscribe(
      (response) => {
        this.rentable = true;
        this.getCustomerFindeksScoreByCustomerId(this.customerId);
      }, responseError => {
        this.toastrService.error(responseError.error.message +
          ' Araç, seçilen tarihte zaten kirada olduğu için kiralanamaz.',
          'Dikkat'
        );
      }
    );
  }

  rentalAdd() {
    let rentalModel = Object.assign({}, this.rentalAddForm.value);
    rentalModel.carId = this.car.id;
    this.rentalService.add(rentalModel).subscribe(response => {
      this.toastrService.success('Kiralama İşlemi Tamamlandı.', 'Başarılı');
      this.rentalSuccess = true;
    }, responseError => {
      if (responseError.error.Errors && responseError.error.Errors.length > 0) {
        for (let i = 0; i < responseError.error.Errors.length; i++) {
          this.toastrService.error(responseError.error.Errors[i].ErrorMessage
            , "Doğrulama hatası")
        }
      }
      else {
        this.toastrService.error(responseError.error.message
          , "Hata Oluştu")
      }
    });
  }

  checkIfDates() {
    if (this.rentDate && (!this.returnDate || this.returnDate >= this.rentDate)) {
      return true;
    } else {
      this.toastrService.warning(
        'Teslim tarihi Kiralama tarihinden küçük olamaz.',
        'Dikkat'
      );
      return false;
    }
  }

  checkIfCustomerExists() {
    if (this.customerId != null) {
      return true;
    } else {
      this.toastrService.warning('Müşteri Seçiniz.', 'Dikkat');
      return false;
    }
  }

  rentalClick() {
    this.rentalService.tempRental = {
      rentDate: this.rentDate,
      returnDate: this.returnDate,
      carId: this.car.id,
      customerId: this.customerId,
    };
    if (this.checkIfCustomerExists() && this.rentalAddForm) {
      if (!this.returnDate) {
        this.rentalAdd();
      } else if (this.checkIfDates()) {
        this.carRentableByRentDate(this.car.id, this.rentDate);
      }
    } else {
      this.toastrService.warning('Formu kontrol ediniz.', 'Dikkat');
    }
  }
}
