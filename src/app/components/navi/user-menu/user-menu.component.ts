import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent implements OnInit {

  userName:string |null=this.localStorageService.getName();;
  
  constructor(
    private localStorageService:LocalStorageService,
    private router:Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(  ): void {   }

  
  logout(){
    this.userName="";
    this.toastrService.success("Çıkış Yapıldı.","Başarılı");
    this.localStorageService.clear();
    this.router.navigate(["login"]);
  }

  userUpdateClick(){
    let id=this.localStorageService.getUserId();
    this.toastrService.info("Profil düzenleme sayfasına Yönlendiriliyorsunuz...","Kullanıcı İşlemleri");
    this.router.navigate(["user/"+id]);
  }
  userProfileClick(){
    let id=this.localStorageService.getUserId();
    this.toastrService.info("Profil düzenleme sayfasına Yönlendiriliyorsunuz...","Kullanıcı İşlemleri");
    this.router.navigate(["register/"+id]);
  }
  
}
