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
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {

  userForm: FormGroup;
  passwordHash:number|null;
  passwordSalt:number|null;


  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.createUserForm();
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.getUserById(params['id']);
      } else {
        this.localStorageService.clear();
      }
    });
  }

  createUserForm() {
    this.userForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required]
    })
  }

  getUserById(id: number) {
    this.userService.getById(id).subscribe(response => {
      this.userForm.patchValue({
        firstName: response.data.firstName,
        lastName: response.data.lastName
      });
      this.passwordHash=response.data.passwordHash?response.data.passwordHash:null;
      this.passwordSalt=response.data.passwordSalt?response.data.passwordSalt:null;
    }, responseError => {
      this.toastrService.error(responseError.error)
    }
    )
  }

  update(userModel: UserModel) {
    this.userService.update(userModel).subscribe(response => {
      this.toastrService.success("Güncelleme işlemi gerçekleştirildi.", "Başarılı");
      this.localStorageService.setUser(userModel);
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
        this.toastrService.error(responseError.error.Message, 'Hata Oluştu!');
      }
    })
  }

  updateClick() {
    if (this.userForm.valid) {
      let userModel = Object.assign({}, this.userForm.value);
      userModel.id=this.localStorageService.getUserId();
      userModel.email=this.localStorageService.getEmail();
      userModel.passwordSalt=this.passwordSalt;
      userModel.passwordHash=this.passwordHash;
      userModel.status=true;
      this.update(userModel);
    } else {
      this.toastrService.error("Formunuz eksik.", "Dikkat");
    }
  }
}
