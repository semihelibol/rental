
import { Component,  OnInit  } from '@angular/core';
import { FormGroup, FormControl, Validator, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from 'src/app/models/userModel';


import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup;


  constructor(private formBuilder:FormBuilder,
    private authService:AuthService,
    private userService:UserService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService
    ) { }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()){
      this.localStorageService.clear();
      this.createLoginForm();
    }else{
      window.location.assign("#");  
    }    
  }

  createLoginForm(){
    this.loginForm=this.formBuilder.group({
      email:["",[Validators.email,Validators.required]],
      password:["",Validators.required]
    })
  }

  login(){
    if(this.loginForm.valid){
      let loginModel = Object.assign({},this.loginForm.value)
      this.authService.login(loginModel).subscribe(response=>{
        this.localStorageService.setToken(response.data);
        this.getUserByMail(loginModel.email);
      },responseError=>{
        this.toastrService.error(responseError.error)
        this.loginForm.patchValue({password:""});
      })
    }
  }

  getUserByMail(email:string){    
    this.userService.getByMail(email).subscribe(response=>{      
      if(response.data.status){
        this.toastrService.info("Giriş Yapıldı","Başarılı");     
        this.localStorageService.setUser(response.data);
        window.location.assign("#");    
      }else{
        this.localStorageService.clear();
        this.toastrService.error("Kullanıcı pasif durumdadır. Sistem yetkilisiyle görüşün..","Hata");
        this.loginForm.patchValue({password:""});
      }
    },responseError=>{
      this.toastrService.error(responseError.error)
      this.loginForm.patchValue({password:""});
    })
  }
}
