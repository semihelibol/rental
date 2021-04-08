import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validator, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterModel } from 'src/app/models/registerModel';
import { UserModel } from 'src/app/models/userModel';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.createRegisterForm();
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.getUserById(params['id']);
      } else {
        this.localStorageService.clear();
      }
    });

  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      password: ["", Validators.required]
    })
  }

  getUserById(id: number) {
    this.userService.getById(id).subscribe(response => {
      this.registerForm.patchValue({
        firstName: response.data.firstName,
        lastName: response.data.lastName
      });
    }, responseError => {
      this.toastrService.error(responseError.error)
    }
    )
  }

  update(registerModel: RegisterModel) {
    this.authService.update(registerModel).subscribe(response => {
      this.toastrService.success("Güncelleme işlemi gerçekleştirildi.", "Başarılı");      
      this.localStorageService.setName(registerModel.firstName+" "+registerModel.lastName);
      this.localStorageService.setToken(response.data);
      window.location.assign("#");
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
      this.registerForm.patchValue({ password: "" });
    })
  }

  updateClick() {
    if (this.registerForm.valid) {
      let registerModel = Object.assign({}, this.registerForm.value);
      registerModel.id=this.localStorageService.getUserId();
      registerModel.email=this.localStorageService.getEmail();
      registerModel.status=true;
      this.update(registerModel);      
    } else {
      this.registerForm.patchValue({ password: "" });
      this.toastrService.error("Formunuz eksik.", "Dikkat");
    }
  }
}
