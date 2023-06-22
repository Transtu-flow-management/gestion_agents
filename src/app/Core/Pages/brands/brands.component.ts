import { Component, OnInit } from '@angular/core';
import { Brand } from '../../interfaces/brand';
import { BrandService } from '../../Services/brand.service';
import { MatDialog } from '@angular/material/dialog';
import { AddBrandComponent } from 'src/app/Dialogs/add-brand/add-brand.component';
import { UpdateBrandComponent } from 'src/app/Dialogs/update-brand/update-brand.component';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { ErrorsComponent } from 'src/app/Dialogs/errors/errors.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit{
brands :Brand[] =[];

constructor(private _brandservice :BrandService,private dialog :MatDialog,private snackbar : MatSnackBar){}
ngOnInit(): void {
    this.fetchBrands()
}
fetchBrands():void{
  this._brandservice.getAllbrands().subscribe((brand)=>{
    this.brands=brand;
  },(error)=> {
     
    console.log(error)});
}
openAddbrandDialog():void{
  const dialogref = this.dialog.open(AddBrandComponent,{
    height:'60%',
    width:'70%',
    enterAnimationDuration:'1000ms',
    exitAnimationDuration:'200ms',
  });
}
openEditbrandDialog(brand:Brand){
let dialogref = this.dialog.open(UpdateBrandComponent,{
  height:'60%',
  width:'70%',
  enterAnimationDuration:'1000ms',
  exitAnimationDuration:'200ms',
  data :{ brand:brand},

});
}
deletebrand(id:string):void{
  const deldialog = this.dialog.open(ConfirmationComponent,{
    data:{message:'delete brand'},
  });
  deldialog.afterClosed().subscribe((res) =>{
    const message = 'la marque a été supprimé avec succes';
if (res =='confirm')
this._brandservice.deletebrand(id).subscribe({
  next : (res)=> {
    this.snackbar.openFromComponent(SuccessToastComponent, {
      data: {message: message },
      duration:5000,
        horizontalPosition:"end",
        verticalPosition:"top",
        panelClass: ['snack-green','snack-size','snack-position']
    });
   // this.fetchAgents();
  },
})
});
}
openfailToast(message:string,title:string){
  this.dialog.open(ErrorsComponent,{
    data:{message:message,title:title},
  });
  this.dialog.afterOpened.subscribe(()=>{
    setTimeout(()=> 3000,)
  });
}

}
