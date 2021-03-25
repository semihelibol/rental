import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Color } from 'src/app/models/color';
import { BrandService } from 'src/app/services/brand.service';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.css']
})
export class ColorComponent implements OnInit {

  colors:Color[]=[];
  currentColor :Color;
  dataLoaded = false;
  allColor=true;
  filterText="";

  constructor(private colorService:ColorService,private brandService:BrandService,private router:Router) { }

  ngOnInit(): void {
    this.getColors();
  }

  getColors() {    
    this.colorService.getColors().subscribe(response=>{
      this.colors = response.data
      this.dataLoaded = true;
    });
  }

  setCurrentColor(color:Color){
    this.colorService.currentColorId=color.id;
    this.currentColor = color;
    this.allColor=false;
    this.router.navigate(['/cars/brandcolor/'+this.brandService.currentBrandId+'/'+color.id]);
  }

  setAllColor(){
    this.colorService.currentColorId=0;
    this.allColor=true;
    this.router.navigate(['/cars/brandcolor/'+this.brandService.currentBrandId+'/0']);
  }
  getCurrentColorClass(color:Color){
    if(color ==this.currentColor && !this.allColor){
      return "list-group-item active"
    }else{
      return "list-group-item"
    }
  }
  
  getAllColorClass(){
    if(this.allColor){
     return "list-group-item active"
    }
    else{
     return "list-group-item"
    }
  }  
}