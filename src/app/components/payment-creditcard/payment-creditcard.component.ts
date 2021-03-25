import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarDto } from 'src/app/models/carDto';
import { CreditCard } from 'src/app/models/creditCard';
import { Rental } from 'src/app/models/rental';
import { CarService } from 'src/app/services/car.service';
import { PaymentService } from 'src/app/services/payment.service';
import { RentalService } from 'src/app/services/rental.service';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-payment-creditcard',
  templateUrl: './payment-creditcard.component.html',
  styleUrls: ['./payment-creditcard.component.css'],
})
export class PaymentCreditcardComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private carService: CarService,
    private toastr: ToastrService,
    private rentalService: RentalService
  ) {}

  paymentSuccess = false;
  rental: Rental = this.rentalService.tempRental;
  paymentForm: FormGroup;
  car: CarDto;
  nameOnCard: string;
  cardNumber: string;
  expirationDateMonth: number;
  expirationDateYear: number;
  securityCode: string;
  paymentAmount: number;
  rentDay: number;
  creditCard: CreditCard;

  ngOnInit(): void {
    this.createPaymentForm();
    this.getCarDetailsById(this.rental.carId);
  }
  getCarDetailsById(carId: number) {
    this.carService.getCarDetailsById(carId).subscribe((response) => {
      this.car = response.data;
      this.payCalc();
    });
  }

  createPaymentForm() {
    this.expirationDateYear = new Date().getFullYear();
    this.expirationDateMonth = new Date().getMonth() + 1;

    this.paymentForm = this.formBuilder.group({
      nameOnCard: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expirationDateMonth: ['', Validators.required],
      expirationDateYear: ['', Validators.required],
      securityCode: ['', Validators.required],
    });
  }

  payByCreditCard(creditCard: CreditCard) {
    this.paymentService.creditCardControl(creditCard).subscribe(
      (response) => {
        this.paymentService.payByCreditCard(creditCard).subscribe(
          (response) => {
            this.toastr.success(
              'Kiralama işlemi gerçekleştirildi.',
              'Ödeme İşlemi Gerçekleştirildi.'
            );
            this.paymentSuccess = true;
          },
          (error) => {
            this.toastr.warning(
              'İşlem gerçekleştirilemedi. Kart bilgilerinizi kontrol ediniz.',
              'Kredi Kartı Hatası'
            );
            this.paymentSuccess = false;
          }
        );
      },
      (error) => {
        this.toastr.warning(
          'İşlem gerçekleştirilemedi. Kart bilgilerinizi kontrol ediniz.',
          'Kredi Kartı Hatası'
        );
      }
    );
  }

  payCalc() {
    if (this.rental.returnDate) {
      var rentDate = new Date(this.rental.rentDate.toString());
      var returnDate = new Date(this.rental.returnDate.toString());
      var differenceDay = returnDate.getTime() - rentDate.getTime();
      this.rentDay = Math.ceil(differenceDay / (1000 * 3600 * 24) + 1);
    }
    this.paymentAmount = this.car.dailyPrice * this.rentDay;
  }
  paymentButton() {
    this.creditCard = {
      nameOnCard: this.nameOnCard,
      cardNumber: this.cardNumber,
      expirationDateMonth: this.expirationDateMonth,
      expirationDateYear: this.expirationDateYear,
      securityCode: this.securityCode,
      paymentAmount: this.paymentAmount,
    };
    if (this.dateControl()) {
      this.payByCreditCard(this.creditCard);
    }
  }

  cancelButton() {
    this.toastr.warning(
      'Kiralama sayfasına geri dönülüyor...',
      'Ödeme İşlemi İptal Edildi.'
    );
    this.router.navigate(['/rentals/rental-add/' + this.rental.carId]);
  }

  getMinYear() {
    var year = new Date().getFullYear();
    return year;
  }

  dateControl() {
    var year = new Date().getFullYear();
    var month = new Date().getMonth() + 1;
    if (
      (this.expirationDateYear <= year && this.expirationDateMonth < month) ||
      !this.expirationDateYear ||
      !this.expirationDateMonth
    ) {
      this.toastr.warning('Son kullanma tarihini kontrol ediniz.', 'Dikkat');
      return false;
    } else return true;
  }
}
