import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarDto } from 'src/app/models/carDto';
import { CarImage } from 'src/app/models/carImage';
import { CarImageService } from 'src/app/services/car-image.service';
import { CarService } from 'src/app/services/car.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css'],
})
export class CarDetailComponent implements OnInit {
  car: CarDto;
  carImages: CarImage[] = [];
  dataLoaded = false;
  imagePath: string = 'https://localhost:44356/images/';
  rentable: boolean = false;

  constructor(
    private carImageService: CarImageService,
    private carService: CarService,
    private rentalService: RentalService,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['carId']) {
        this.getCarImagesByCarId(params['carId']);
      }
    });
  }

  getCarImagesByCarId(carId: number) {
    this.carService.getCarDetailsById(carId).subscribe((response) => {
      this.car = response.data;
    });

    this.carRentable(carId);

    this.carImageService.getCarImagesByCarId(carId).subscribe((response) => {
      this.carImages = response.data;
    });
    this.dataLoaded = true;
  }

  getSliderClassName(index: Number) {
    if (index == 0) {
      return 'carousel-item active';
    } else {
      return 'carousel-item';
    }
  }

  carRentable(carId: number) {
    this.rentalService.carRentable(carId).subscribe((response) => {
      this.rentable = response.success;
    });
  }

  rentalAdd() {
    this.toastrService.info(
      'Kiralama sayfas??na y??nlendiriliyorsunuz...',
      this.car.carName + ' Arac?? kiralan??yor.'
    );
  }

  carUpdate() {
    this.toastrService.info(
      'Ara?? bilgilerini d??zenleme sayfas??na y??nlendiriliyorsunuz...',
      this.car.carName + ' Ara?? bilgileri d??zenlenecek.'
    );
  }
}
