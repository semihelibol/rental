import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Brand } from 'src/app/models/brand';
import { BrandService } from 'src/app/services/brand.service';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css'],
})
export class BrandComponent implements OnInit {
  brands: Brand[] = [];
  currentBrand: Brand;
  dataLoaded = false;
  allBrand = true;
  filterText = '';

  constructor(
    private brandService: BrandService,
    private colorService: ColorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getBrands();
  }

  getBrands() {
    this.brandService.getBrands().subscribe((response) => {
      this.brands = response.data;
      this.dataLoaded = true;
    });
  }

  setCurrentBrand(brand: Brand) {
    this.brandService.currentBrandId = brand.id;
    this.currentBrand = brand;
    this.allBrand = false;
    this.router.navigate([
      '/cars/brandcolor/' + brand.id + '/' + this.colorService.currentColorId,
    ]);
  }

  setAllBrand() {
    this.brandService.currentBrandId = 0;
    this.allBrand = true;
    this.router.navigate([
      '/cars/brandcolor/0/' + this.colorService.currentColorId,
    ]);
  }

  getCurrentBrandClass(brand: Brand) {
    if (brand == this.currentBrand && !this.allBrand) {
      return 'list-group-item active';
    } else {
      return 'list-group-item';
    }
  }

  getAllBrandClass() {
    if (this.allBrand) {
      return 'list-group-item active';
    } else {
      return 'list-group-item';
    }
  }
}
