import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';
import{NgxPaginationModule} from 'ngx-pagination'
import { environment } from './environment';
import { HttpClientModule } from '@angular/common/http';

import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { SearchPipe } from './pipes/search.pipe';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MatPaginatorModule } from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';

import {MatExpansionModule} from '@angular/material/expansion';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatStepperModule} from '@angular/material/stepper';
import { SpinnerComponent } from './Core/spinner/spinner.component';
import { AccessdeniedComponent } from './accessdenied/accessdenied.component';
import { AuthInterceptor } from './Core/Services/auth.interceptor';
import { RecArchiveComponent } from './Core/Pages/rec-archive/rec-archive.component';
import { ReportComponent } from './Dialogs/report/report.component';


export const API_URL = new InjectionToken<String>('API_URL');



@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    AccessdeniedComponent,
    ReportComponent,
 
  ],
  imports: [
    MatRadioModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule ,
    FormsModule,
    HttpClientModule,
    MatToolbarModule,
      MatListModule,
      MatIconModule,
      BrowserAnimationsModule,
      MatSelectModule,
      MatTableModule,
      MatDialogModule,
      MatFormFieldModule,
      MatInputModule,
      MatSnackBarModule,
      NgxPaginationModule,
      MatAutocompleteModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatPaginatorModule ,
      MatButtonModule,
      MatExpansionModule,
      MatSlideToggleModule,
      MatStepperModule,
      MatProgressSpinnerModule
  ],

  
  providers: [{provide: API_URL, useValue: environment.apiUrl ,useClass: AuthInterceptor,multi:true},SearchPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
