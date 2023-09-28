import { Component, OnInit, Inject } from '@angular/core';
import { isEqual } from 'lodash';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EntropotService } from 'src/app/Core/Services/entropot.service';
import { LinesService } from 'src/app/Core/Services/lines.service';
import { Depot } from 'src/app/Core/Models/depot';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { UpdateToastComponent } from 'src/app/alerts/update-toast/update-toast.component';
import { WarningToastComponent } from 'src/app/alerts/warning-toast/warning-toast.component';
import { WarningComponent } from 'src/app/alerts/warning/warning.component';

@Component({
  selector: 'app-update-line',
  templateUrl: './update-line.component.html',
  styleUrls: ['./update-line.component.css']
})
export class UpdateLineComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition
  verticalPosition: MatSnackBarVerticalPosition
  entrpt = new FormControl<Depot>(null);
  warehouse: Depot[] = [];
  filteredOptions: Observable<Depot[]>;

  updateForm: FormGroup;
  isFormSubmitted = false;
  showdialg: boolean = true;

  constructor(private dialog: MatDialog,
    private fb: FormBuilder, private snackBar: MatSnackBar,
    private _linesService: LinesService,
    public dialogRef: MatDialogRef<UpdateLineComponent>,
    private _warehouseService: EntropotService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    const line: any = data.line;

    this.updateForm = this.fb.group({
      nameFr: new FormControl(line.nameFr, [Validators.required,]),
      nameAr: new FormControl(line.nameAr, [Validators.required,this.arabicTextValidator()]),
      start_fr: new FormControl(line.start_fr, [Validators.required,]),
      start_ar: new FormControl(line.start_ar, [Validators.required,this.arabicTextValidator()]),
      end_fr: new FormControl(line.end_fr, [Validators.required,]),
      end_ar: new FormControl(line.end_ar, [Validators.required,this.arabicTextValidator]),
      warehouse: new FormControl(this.entrpt.value, [Validators.required]),
      depot : new FormControl(line.warehouse)
    });

    this._warehouseService.getAllentrp().subscribe(warehouses => {
      this.warehouse = warehouses;
    });
  }
  ngOnInit() {
    this.filteredOptions = this.entrpt.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.warehouse.slice();
      })
    );
    this.entrpt.setValue(this.data.line.warehouse);
  }
  arabicTextValidator() {
    return (control) => {
      const arabicTextPattern = /^[\u0600-\u06FF\s]+$/;
      if (!arabicTextPattern.test(control.value)) {
        return { notArabic: true };
      }
      return null;
    };
  }
  displayFn(entropot: Depot): string {
    return entropot && entropot.name ? entropot.name : '';
  }
  private _filter(name: string): Depot[] {
    const filterValue = name.toLowerCase();

    return this.warehouse.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  close() {
    this.dialog.closeAll()
  }
  dismissdialog() {
    this.showdialg = false;
  }
  openToast(message: string): void {
    this.snackBar.openFromComponent(UpdateToastComponent, {
      data: { message: message },
      duration: 3000,
      horizontalPosition: "end",
      verticalPosition: "top",
      panelClass: ['snack-green', 'snack-size', 'snack-position']
    })
  }
  openErrorToast(message: string) {
    this.snackBar.openFromComponent(FailedToastComponent, {
      data: { message: message },
      duration: 3000,
      horizontalPosition: "end",
      verticalPosition: "bottom",
      panelClass: ['snack-red', 'snack-size']
    });
  }
  openWarningToast(message: string): void {
    this.snackBar.openFromComponent(WarningComponent, {
      data: { message: message }, duration: 5000,
      horizontalPosition: "center",
      verticalPosition: "top",
      panelClass: ['snack-yellow', 'snack-size']
    });
  }

  isFormUnchanged() {
    var lineform = this.updateForm.getRawValue();
    const checkvalues = this.data.line;
    const entropotValue: Depot = this.entrpt.value;
    return lineform.nameAr === checkvalues.nameAr &&
    lineform.nameFr === checkvalues.nameFr &&
    lineform.start_fr === checkvalues.start_fr &&
    lineform.start_ar === checkvalues.start_ar &&
    lineform.end_fr === checkvalues.end_fr &&
    lineform.end_ar === checkvalues.end_ar &&
    entropotValue.id === checkvalues.warehouse.id;
    
  }

  public update(): void {
    var line = this.updateForm.getRawValue();
    const entropotValue: Depot = this.entrpt.value;

   
    if (entropotValue.id !== this.data.line.warehouse.id) {
      line.warehouse = entropotValue;
    }
    if (!this.isFormUnchanged()) {
      this._linesService.updateline(this.data.line.id, line).subscribe(() => {
        this.openToast('La ligne a été mis à jour')
        this.dialogRef.close();
      }, (error) => {
        const message = `error updating depot${error.status}`
        this.openErrorToast(message);
      });
    }
    else {
      this.openWarningToast("nothing changed no update will be submit");
      this.dismissdialog();
    }
  }
}
