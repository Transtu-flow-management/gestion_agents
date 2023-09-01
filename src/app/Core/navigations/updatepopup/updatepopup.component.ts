import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Stop } from '../../Models/Stop';
import { SelectedStopService } from '../../Services/selected-stop.service';
import { StopserviceService } from '../../Services/stopservice.service';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';

@Component({
  selector: 'app-updatepopup',
  templateUrl: './updatepopup.component.html',
  styleUrls: ['./updatepopup.component.css']
})
export class UpdatepopupComponent {

  stops :Stop[] = [];
  map :L.Map;
  selected: Stop | undefined;
constructor(private selectedstop : SelectedStopService,private stopservice : StopserviceService,private snackBar:MatSnackBar
  ,private dialog:MatDialog){
  this.selectedstop.selectedStop$.subscribe(stop=>{
    this.selected =stop;
  })
}

openDelToast(message: string) {
  this.snackBar.openFromComponent(SuccessToastComponent, {
    data: { message: message },
    duration: 5000,
    horizontalPosition: "end",
    verticalPosition: "top",
    panelClass: ['snack-green', 'snack-size', 'snack-position']
  })
}

openfailToast(message: string): void {
  this.snackBar.openFromComponent(FailedToastComponent, {
    data: { message: message }, duration: 5000,
    horizontalPosition: "end",
    verticalPosition: "bottom",
    panelClass: ['snack-red', 'snack-size']
  });
}
  
  updateStop() {
    if (this.selected){
      this.selectedstop.setSelectedStop(this.selected);
    }
  }

  

  deleteStop(id :string) {

  const message = "Effacer l\'arrêt?";
    const title = "Delete stop"
    const deletedialog = this.dialog.open(ConfirmationComponent, {
      data: { message: message, title: title },
    });
    deletedialog.afterClosed().subscribe((res) => {
      if (res == 'confirm')
        this.stopservice.deletestop(id).subscribe(()=>{
          const marker = this.selectedstop.stopMarkers[id];
          if (marker) {
            this.map.removeLayer(marker); // Remove marker from the map
            this.selectedstop.removeMarker(id);}
      
       
            this.openDelToast("L\'arrêt a ete supprimé avec success");
        },()=>{
          this.openfailToast("Erreur l\'ors de supprission");
        }
        )
    })
}
}
