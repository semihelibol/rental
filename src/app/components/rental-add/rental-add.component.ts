import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarDto } from 'src/app/models/carDto';
import { CustomerDto } from 'src/app/models/customerDto';
import { Rental } from 'src/app/models/rental';
import { TmpRentals } from 'src/app/models/tmpRental';
import { CarService } from 'src/app/services/car.service';
import { CustomerService } from 'src/app/services/customer.service';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-rental-add',
  templateUrl: './rental-add.component.html',
  styleUrls: ['./rental-add.component.css'],
})
export class RentalAddComponent implements OnInit {
  userId: number = 2002; //giriş yapmadığımız için el ile bir userId verdim.

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private rentalService: RentalService,
    private carService: CarService,
    private toastr: ToastrService
  ) {}

  rentalSuccess = false;
  rentalAddForm: FormGroup;
  customers: CustomerDto[];
  customerId: number;
  rentDate: Date;
  returnDate: Date;
  car: CarDto;
  imagePath: string = 'https://localhost:44356/images/';
  rentable: boolean = false;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['carId']) {
        this.getCarDetailsById(params['carId']);
        this.createRentalAddForm();
        this.getCustomersByUserId();
      }
    });
  }

  getCarDetailsById(carId: number) {
    this.carService.getCarDetailsById(carId).subscribe((response) => {
      this.car = response.data;
    });
  }

  createRentalAddForm() {
    this.rentalAddForm = this.formBuilder.group({
      customerId: ['', Validators.required],
      rentDate: ['', Validators.required],
      returnDate: ['', Validators.required],
      dailyPrice: ['', Validators.required],
    });
  }

  getCustomersByUserId() {
    this.customerService
      .getCustomersByUserId(this.userId)
      .subscribe((response) => {
        this.customers = response.data;
        this.customerId = this.customers[0].id;
      });
  }

  getMinDate() {
    var today = new Date();
    return today.toISOString().slice(0, 10);
  }

  carRentableByRentDate(carId: number, rentDate: Date) {
    this.rentalService.carRentableByRentDate(carId, rentDate).subscribe(
      (response) => {
        this.rentable = true;
        if (!this.returnDate) {
          this.toastr.success('Kiralama İşlemi Tamamlandı.', 'Başarılı');
          this.rentalSuccess = true;
        } else {
          this.toastr.info(
            'Ödeme sayfasına yönlendiriliyorsunuz...',
            'Ödeme İşlemleri'
          );
          this.router.navigate(['/payment/creditcard/']);
        }
      },
      (error) => {
        this.rentable = false;
        this.toastr.warning(
          'Araç, seçilen tarihte zaten kirada olduğu için kiralanamaz.',
          'Dikkat'
        );
      }
    );
  }
  

  dateControl() {
    if (!this.returnDate || this.returnDate >= this.rentDate) {
      return true;
    } else {
      this.toastr.warning(
        'Teslim tarihi Kiralama tarihinden küçük olamaz.',
        'Dikkat'
      );
      return false;
    }
  }

  customerControl() {
    if (this.customerId != null) {
      return true;
    } else {
      this.toastr.warning('Müşteri Seçiniz.', 'Dikkat');
      return false;
    }
  }

  rentalAdd() {
    this.rentalService.tempRental = {
      rentDate: this.rentDate,
      returnDate: this.returnDate,
      carId: this.car.id,
      customerId: this.customerId,
    };

    if (this.customerControl()) {
      this.carRentableByRentDate(this.car.id, this.rentDate);
    } else {
      this.toastr.warning('Formu kontrol ediniz.', 'Dikkat');
    }    
  }
}
