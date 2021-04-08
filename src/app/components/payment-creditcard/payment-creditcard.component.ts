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
import { PayByCreditCardDto } from 'src/app/models/payByCreditCardDto';
import { CreditCardService } from 'src/app/services/credit-card.service';
import { ThisReceiver } from '@angular/compiler';

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
    private toastrService: ToastrService,
    private rentalService: RentalService,
    private creditCardService: CreditCardService
  ) { }

  paymentSuccess = false;
  rental = this.rentalService.tempRental;
  paymentForm: FormGroup;
  car: CarDto;
  payByCreditCardDto: PayByCreditCardDto;
  creditCards:CreditCard[];
  creditCardId:number=0;
  creditCardName:string;
  nameOnCard: string;
  cardNumber: string;
  expirationDateMonth: number;
  expirationDateYear: number;
  securityCode: string;
  paymentAmount: number;
  rentDay: number;


  ngOnInit(): void {
    if (!this.rental) {
      window.history.back();
    }
    this.createPaymentForm();
    this.getCarDetailsById(this.rental.carId);
    this.getCreditCardsByCustomerId(this.rental.customerId);
  }

  getCreditCardById(id: number) {
    this.creditCardService.getCreditCardById(id).subscribe((response) => {
      this.nameOnCard=response.data.nameOnCard;
      this.cardNumber=response.data.cardNumber;
      this.expirationDateMonth=response.data.expirationDateMonth;
      this.expirationDateYear=response.data.expirationDateYear;
      this.securityCode=response.data.securityCode;
    });
  }

  getCarDetailsById(carId: number) {
    this.carService.getCarDetailsById(carId).subscribe((response) => {
      this.car = response.data;
      this.payCalc();
    });
  }

  getMinYear(){
    let year= Number(new Date().getFullYear().toString().slice(2,4));
    return year;
  }

  createPaymentForm() {
    this.expirationDateYear = this.getMinYear();
    this.expirationDateMonth = new Date().getMonth() + 1;

    this.paymentForm = this.formBuilder.group({
      nameOnCard: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expirationDateMonth: ['', Validators.required],
      expirationDateYear: ['', Validators.required],
      securityCode: ['', Validators.required]
    });
  }

  getCreditCardsByCustomerId(customerId: number) { 
    this.creditCardService
      .getCreditCardsByCustomerId(customerId)
      .subscribe((response) => {
        this.creditCards = response.data;
        this.creditCardId = this.creditCards[0].id?this.creditCards[0].id:0;
        this.getCreditCardById(this.creditCardId);
      });
  }

  newCard(){
    this.nameOnCard="";
    this.cardNumber="";
    this.expirationDateYear = this.getMinYear();
    this.expirationDateMonth = new Date().getMonth() + 1;
    this.securityCode="";
    this.creditCardId=0;
  }

  creditCardChange(){
    this.getCreditCardById(this.creditCardId);
    
  }

  saveCardClick(){
    let creditCardModel={
      nameOnCard:this.nameOnCard,
      cardNumber:this.cardNumber,
      expirationDateMonth:this.expirationDateMonth,
      expirationDateYear:this.expirationDateYear,
      securityCode:this.securityCode,
      creditCardName:this.creditCardName ,
      customerId:this.rental.customerId     
    }
    this.creditCardService.add(creditCardModel).subscribe(
      (response) => {
        this.toastrService.success(
          'Kredi Kartı Kaydedildi.',
          'Başarılı.'
        );
        this.router.navigate(["/cars/car-detail/"+this.car.id]);
      }, responseError => {
        if (
          responseError.error.Errors &&
          responseError.error.Errors.length > 0
        ) {
          for (let i = 0; i < responseError.error.Errors.length; i++) {
            this.toastrService.error(
              responseError.error.Errors[i].ErrorMessage,
              'Doğrulama Hatası!'
            );
          }
        } else {
          this.toastrService.error(responseError.error, 'Hata Oluştu!');
        }      
      }
    );
  }

  payByCreditCard(payByCreditCardDto: PayByCreditCardDto) {
    this.paymentService.payByCreditCard(payByCreditCardDto).subscribe(
      (response) => {
        this.rentalAdd();
      },
      (error) => {
        console.log(error)
        this.toastrService.warning(
          'İşlem gerçekleştirilemedi. Kart bilgilerinizi kontrol ediniz.',
          'Kredi Kartı Hatası'
        );
        this.paymentSuccess = false;
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
    let today=new Date();
    let creditCardModel = Object.assign({}, this.paymentForm.value);
    this.payByCreditCardDto = {
      customerId: this.rental.customerId,
      creditCard: creditCardModel,
      paymentDate:today ,
      paymentAmount: this.paymentAmount
    };

    if (this.dateControl()) {
      this.payByCreditCard(this.payByCreditCardDto);
    }
  }

  cancelButton() {
    this.toastrService.warning(
      'Kiralama sayfasına geri dönülüyor...',
      'Ödeme İşlemi İptal Edildi.'
    );
    this.router.navigate(['/rentals/rental-add/' + this.rental.carId]);
  }

  dateControl() {
    var year = this.getMinYear();
    var month = new Date().getMonth() + 1;
    if (
      (this.expirationDateYear <= year && this.expirationDateMonth < month) ||
      !this.expirationDateYear ||
      !this.expirationDateMonth
    ) {
      this.toastrService.warning('Son kullanma tarihini kontrol ediniz.', 'Dikkat');
      return false;
    } else return true;
  }


  rentalAdd() {
    this.rentalService.add(this.rentalService.tempRental).subscribe(response => {
      this.toastrService.success(
        'Kiralama işlemi gerçekleştirildi.',
        'Ödeme İşlemi Gerçekleştirildi.'
      );
      this.paymentSuccess = true;
    }, responseError => {
      if (
        responseError.error.Errors &&
        responseError.error.Errors.length > 0
      ) {
        for (let i = 0; i < responseError.error.Errors.length; i++) {
          this.toastrService.error(responseError.error.Errors[i].ErrorMessage
            , "Doğrulama hatası")
        }
      }
      else {
        this.toastrService.error(responseError.error
          , "Hata Oluştu. Tekrar deneyin.");
          window.history.back();
      }
    });
  }

}
