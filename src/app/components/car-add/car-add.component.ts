import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { Car } from 'src/app/models/car';
import { Color } from 'src/app/models/color';
import { BrandService } from 'src/app/services/brand.service';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-car-add',
  templateUrl: './car-add.component.html',
  styleUrls: ['./car-add.component.css'],
})
export class CarAddComponent implements OnInit {
  carAddForm: FormGroup;
  car: Car;
  brands: Brand[];
  colors: Color[];

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private brandService: BrandService,
    private colorService: ColorService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.createCarAddForm();
    this.getBrands();
    this.getColors();
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.getCarById(params['id']);
      }
    });
  }

  createCarAddForm() {
    this.carAddForm = this.formBuilder.group({
      brandId: ['', Validators.required],
      colorId: ['', Validators.required],
      description: ['', Validators.required],
      modelYear: ['', Validators.required],
      minFindeksScore: ['', Validators.required],
      dailyPrice: ['', Validators.required],
    });
  }

  getCarById(id: number) {
    this.carService.getCarById(id).subscribe((response) => {
      this.car = response.data;
      this.carAddForm.patchValue(this.car);
    });
  }

  getBrands() {
    this.brandService.getBrands().subscribe((response) => {
      this.brands = response.data;
    });
  }

  getColors() {
    this.colorService.getColors().subscribe((response) => {
      this.colors = response.data;
    });
  }

  add() {
    let carModel = Object.assign({}, this.carAddForm.value);    
    this.carService.add(carModel).subscribe(
      (response) => {
        this.router.navigate(['/cars']);
        this.toastrService.success(
          'Araba Adı:' +
            carModel.description +
            '\n Model Yılı:' +
            carModel.modelYear
        );
        this.toastrService.success(response.message, 'Başarılı');
      },
      (responseError) => {
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
          this.toastrService.error(responseError.error.Message, 'Hata Oluştu!');
        }
      }
    );
  }

  update() {
    let carModel = Object.assign({}, this.carAddForm.value);
    carModel.id = this.car.id;
    this.carService.update(carModel).subscribe(
      (response) => {
        this.router.navigate(['/cars/car-detail/' + this.car.id]);
        this.toastrService.success(
          'Araba Adı:' +
            carModel.description +
            '\n Model Yılı:' +
            carModel.modelYear
        );
        this.toastrService.success(response.message, 'Başarılı');
      },
      (responseError) => {
        if (
          responseError.error.Errors &&
          responseError.error.Errors.length > 0
        ) {
          for (let i = 0; i < responseError.error.Errors.length; i++) {
            this.toastrService.error(
              responseError.error.Errors[i].ErrorMessage,
              'Doğrulama hatası'
            );
          }
        } else {          
          this.toastrService.error(responseError.error.Message, 'Hata Oluştu!');
        }
      }
    );
  }

  carAdd() {
    
    if (this.carAddForm.valid) {
      if (this.car) {
        this.update();
      } else {
        this.add();
      }
    } else {
      this.toastrService.error('Formunuz eksik', 'Dikkat');
    }
  }
}
