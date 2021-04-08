import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validator, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterModel } from 'src/app/models/registerModel';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private toastrService: ToastrService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.localStorageService.clear();
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.email, Validators.required]],
      password: ["", Validators.required]
    })
  }

  register(registerModel: RegisterModel) {
    this.authService.register(registerModel).subscribe(response => {
      this.toastrService.success("Kayıt işlemi gerçekleştirildi.", "Başarılı");
      this.localStorageService.setToken(response.data);
      this.getUserByMail(registerModel.email);
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

  getUserByMail(email: string) {
    this.userService.getByMail(email).subscribe(response => {
      this.localStorageService.setUser(response.data);
      window.location.assign("#");
      this.toastrService.success(response.data.firstName + " " + response.data.lastName, "Hoşgeldiniz.");
    }, responseError => {
      this.toastrService.error(responseError.error)
      this.registerForm.patchValue({ password: "" });
    })
  }

  registerClick() {
    if (this.registerForm.valid) {
      let registerModel = Object.assign({}, this.registerForm.value);
      this.localStorageService.clear();
      this.register(registerModel);
    } else {
      this.registerForm.patchValue({ password: "" });
      this.toastrService.error("Formunuz eksik.", "Dikkat");
    }
  }
}
