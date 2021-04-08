import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarDto } from 'src/app/models/carDto';
import { BrandService } from 'src/app/services/brand.service';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css'],
})
export class CarComponent implements OnInit {
  cars: CarDto[] = [];
  dataLoaded = false;
  imagePath: string = 'https://localhost:44356/images/';
  filterText = '';
  rentable: boolean = false;

  constructor(
    private carService: CarService,
    private rentalService: RentalService,
    private brandService: BrandService,
    private colorService: ColorService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['brandId'] && params['colorId']) {
        this.getCarDetailsByBrandColor(params['brandId'], params['colorId']);
      } else if (params['brandId']) {
        this.getCarDetailsByBrand(params['brandId']);
      } else if (params['colorId']) {
        this.getCarDetailsByColor(params['colorId']);
      } else {
        this.getCarDetails();
      }
    });
  }
  carRentable(carId: number) {
    this.rentalService.carRentable(carId).subscribe((response) => {
      this.rentable = response.success;
    });
  }
  getCarDetails() {
    this.carService.getCarDetails().subscribe((response) => {
      this.cars = response.data;
      this.dataLoaded = true;
    });
  }
  getCarDetailsByBrand(brandId: number) {
    this.carService.getCarDetailsByBrand(brandId).subscribe((response) => {
      this.cars = response.data;
      this.dataLoaded = true;
    });
  }
  getCarDetailsByColor(colorId: number) {
    this.carService.getCarDetailsByColor(colorId).subscribe((response) => {
      this.cars = response.data;
      this.dataLoaded = true;
    });
  }
  getCarDetailsByBrandColor(brandId: number, colorId: number) {
    if (brandId > 0 && colorId > 0) {
      this.carService
        .getCarDetailsByBrandColor(brandId, colorId)
        .subscribe((response) => {
          this.cars = response.data;
          this.dataLoaded = true;
        });
    } else if (brandId > 0) {
      this.getCarDetailsByBrand(brandId);
    } else if (colorId > 0) {
      this.getCarDetailsByColor(colorId);
    } else {
      this.getCarDetails();
    }
  }

  rentalAdd(carId: number, carName: string) {
    this.rentalService.carRentable(carId).subscribe(
      (response) => {
        this.router.navigate(['/rentals/rental-add/' + carId]);
        this.toastrService.info(
          'Kiralama sayfasına yönlendiriliyorsunuz...',
          carName + ' Aracı kiralanıyor.'
        );
      },
      (error) => {
        this.toastrService.warning(
          carName + ' aracı henüz teslim edilmemiş...',
          'Araç zaten kirada.'
        );
      }
    );
  }
}
