import { Component, OnInit } from '@angular/core'; import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { BrandService } from 'src/app/services/brand.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-brand-add',
  templateUrl: './brand-add.component.html',
  styleUrls: ['./brand-add.component.css']
})
export class BrandAddComponent implements OnInit {

  brandAddForm: FormGroup;
  brand: Brand;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private brandService: BrandService,
    private toastrService: ToastrService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.createBrandAddForm();
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.getBrandById(params['id']);
      }
    });
  }

  createBrandAddForm() {
    this.brandAddForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  getBrandById(id: number) {
    this.brandService.getBrandById(id).subscribe((response) => {
      this.brand = response.data;
      this.brandAddForm.patchValue(this.brand);
    });
  }

  add() {
    let brandModel = Object.assign({}, this.brandAddForm.value);
    this.brandService.add(brandModel).subscribe(response => {
      location.href = "/brands";
      this.toastrService.success(response.message, "Başarılı")
    }, responseError => {
      if (responseError.error.Errors.length > 0) {
        for (let i = 0; i < responseError.error.Errors.length; i++) {
          this.toastrService.error(responseError.error.Errors[i].ErrorMessage
            , "Doğrulama hatası")
        }
      }
      else {
        this.toastrService.error(responseError.ErrorMessage
          , "Hata Oluştu")
      }
    });
  }

  update() {
    let brandModel =Object.assign({}, this.brandAddForm.value);
    brandModel.id=this.brand.id;
    this.brandService.update(brandModel).subscribe(response => {
      location.href = "/brands";
      this.toastrService.success(response.message, "Başarılı");
    }, responseError => {
      if (responseError.error.Errors.length > 0) {
        for (let i = 0; i < responseError.error.Errors.length; i++) {
          this.toastrService.error(responseError.error.Errors[i].ErrorMessage
            , "Doğrulama hatası")
        }
      }
      else {
        this.toastrService.error(responseError.ErrorMessage
          , "Hata Oluştu.")
      }
    });
  }

  brandAdd() {
    if (this.brandAddForm.valid) {     
      if (this.brand) {
        this.update()
      } else {        
        this.add()
      }
    } else {
      this.toastrService.error("Formunuz eksik", "Dikkat")
    }
  }
}
