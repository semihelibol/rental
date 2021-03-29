import { Component, OnInit } from '@angular/core'; import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Color } from 'src/app/models/color';
import { ColorService } from 'src/app/services/color.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-color-add',
  templateUrl: './color-add.component.html',
  styleUrls: ['./color-add.component.css']
})
export class ColorAddComponent implements OnInit {

  colorAddForm: FormGroup;
  color: Color;

  constructor(private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private colorService: ColorService,
    private toastrService: ToastrService,
    private location: Location
    ) { }

  ngOnInit(): void {
    this.createColorAddForm();
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.getColorById(params['id']);
      }
    });
    }
    createColorAddForm() {
      this.colorAddForm = this.formBuilder.group({
        name: ['', Validators.required]
      });
    }
  
    getColorById(id: number) {
      this.colorService.getColorById(id).subscribe((response) => {
        this.color = response.data;
        this.colorAddForm.patchValue(this.color);
      });
    }
  
    add() {
      let colorModel = Object.assign({}, this.colorAddForm.value);
      this.colorService.add(colorModel).subscribe(response => {
        location.href = "/colors";
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
      let colorModel =Object.assign({}, this.colorAddForm.value);
      colorModel.id=this.color.id;
      this.colorService.update(colorModel).subscribe(response => {
        location.href = "/colors";
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
  
    colorAdd() {
      if (this.colorAddForm.valid) {     
        if (this.color) {
          this.update()
        } else {        
          this.add()
        }
      } else {
        this.toastrService.error("Formunuz eksik", "Dikkat")
      }
    }
  }
  