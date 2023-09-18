import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { HomeComponent } from 'src/app/Core/Pages/home/home.component';
import { AddUserComponent } from 'src/app/Dialogs/add-user/add-user.component';
import { AgetsComponent } from 'src/app/Core/Pages/agets/agets.component';
import { AgentdialogComponent } from 'src/app/Dialogs/agentdialog/agentdialog.component';
import { ErrorsComponent } from 'src/app/Dialogs/errors/errors.component';
import { RolesComponent } from 'src/app/Core/Pages/roles/roles.component';
import { RoleModalComponent } from 'src/app/Dialogs/role-modal/role-modal.component';
import { UpdateroleComponent } from 'src/app/Dialogs/updaterole/updaterole.component';
import { PermissionsComponent } from 'src/app/Core/Pages/permissions/permissions.component';
import { AssignRoledialogComponent } from 'src/app/Dialogs/assign-roledialog/assign-roledialog.component';
import { EntropotComponent } from 'src/app/Core/Pages/entropot/entropot.component';
import { AddDepoComponent } from 'src/app/Dialogs/add-depo/add-depo.component';
import { UpdateDepotComponent } from 'src/app/Dialogs/update-depot/update-depot.component';
import { FailedToastComponent } from 'src/app/alerts/failed-toast/failed-toast.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { BrandsComponent } from 'src/app/Core/Pages/brands/brands.component';
import { AddBrandComponent } from 'src/app/Dialogs/add-brand/add-brand.component';
import { UpdateBrandComponent } from 'src/app/Dialogs/update-brand/update-brand.component';
import { UpdateToastComponent } from 'src/app/alerts/update-toast/update-toast.component';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { WarningToastComponent } from 'src/app/alerts/warning-toast/warning-toast.component';
import { ConductorsComponent } from 'src/app/Core/Pages/conductors/conductors.component';
import { AddConductorComponent } from 'src/app/Dialogs/add-conductor/add-conductor.component';
import { SearchPipe } from 'src/app/pipes/search.pipe';
import { UpdateConductorComponent } from 'src/app/Dialogs/update-conductor/update-conductor.component';
import { ConditionsComponent } from 'src/app/Core/Pages/conditions/conditions.component';
import { TestComponent } from 'src/app/Core/Pages/test/test.component';
import { LinesComponent } from 'src/app/Core/Pages/lines/lines.component';
import { PathsComponent } from 'src/app/Core/Pages/paths/paths.component';
import { AddStopComponent } from 'src/app/Core/navigations/add-stop/add-stop.component';
import { DynamicPopupComponent } from 'src/app/Core/Pages/dynamic-popup/dynamic-popup.component';
import { CarsComponent } from 'src/app/Core/Pages/cars/cars.component';
import { StopPopupComponent } from 'src/app/Core/navigations/stop-popup/stop-popup.component';
import { GpsdataComponent } from 'src/app/Core/Pages/gpsdata/gpsdata.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { SidebarComponent } from 'src/app/sidebar/sidebar.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';
import { NotfoundComponent } from 'src/app/Core/Pages/errors/notfound/notfound.component';
import { UpdatePathComponent } from 'src/app/Core/navigations/update-path/update-path.component';
import { AddPathComponent } from 'src/app/Core/navigations/add-path/add-path.component';
import { UpdateconditionComponent } from 'src/app/Dialogs/updatecondition/updatecondition.component';
import { AddConditionComponent } from 'src/app/Dialogs/add-condition/add-condition.component';
import { AddLineComponent } from 'src/app/Dialogs/add-line/add-line.component';
import { UpdateLineComponent } from 'src/app/Dialogs/update-line/update-line.component';
import { WarningComponent } from 'src/app/alerts/warning/warning.component';
import { AddCarComponent } from 'src/app/Dialogs/add-car/add-car.component';
import { UpdateCarComponent } from 'src/app/Dialogs/update-car/update-car.component';
import { PermissionsGuard } from 'src/app/permissions.guard';
import { ReclammationComponent } from 'src/app/Core/Pages/reclammation/reclammation.component';
import { RecArchiveComponent } from 'src/app/Core/Pages/rec-archive/rec-archive.component';
import { AccessdeniedComponent } from 'src/app/accessdenied/accessdenied.component';
import { TypeTextPipe } from 'src/app/type-text.pipe';


const approute: Routes = [
  {path :'',component:MainComponent,children:[
  {path: 'home', component: HomeComponent,canActivate:[AuthGuard]},
  {path:'permissions',component:PermissionsComponent,canActivate:[AuthGuard,PermissionsGuard],data:{authorities:['showPermission']}},
  {path:'agents',component:AgetsComponent,canActivate:[AuthGuard],data:{authorities:['read','readRole']}},
  {path:'roles',component:RolesComponent,canActivate:[AuthGuard,PermissionsGuard],data:{authorities:['writeRole','readRole','updateRole','deleteRole','AssignPermissions']}},
  {path:'reclammation',component:ReclammationComponent,canActivate:[AuthGuard,PermissionsGuard],data:{authorities:['pcr_write']}},
  {path:'archive',component:RecArchiveComponent,canActivate:[AuthGuard,PermissionsGuard],data:{authorities:['pcr_read']}},
  {path:'entropots',component:EntropotComponent,canActivate:[AuthGuard]},
  {path:'conductors',component:ConductorsComponent,canActivate:[AuthGuard,PermissionsGuard],data:{authorities:['readChauffeur']}},
  {path:'brands',component:BrandsComponent,canActivate:[AuthGuard]},
  {path:'conditions',component:ConditionsComponent,canActivate:[AuthGuard]},
  {path:'add',component:TestComponent,canActivate:[AuthGuard]},
  {path:'lines',component:LinesComponent,canActivate:[AuthGuard]},
  {path:'paths',component:PathsComponent,canActivate:[AuthGuard]},
  {path:'addpath',component:AddPathComponent,canActivate:[AuthGuard]},
  {path:'updatepath',component:UpdatePathComponent,canActivate:[AuthGuard]},
  {path:'addstop',component:AddStopComponent,canActivate:[AuthGuard]},
  {path:'cars',component:CarsComponent,canActivate:[AuthGuard,PermissionsGuard],data:{authorities:['readCar']}},
  {path:'gps',component:GpsdataComponent,canActivate:[AuthGuard]},
  {path: 'access-denied',
  component:AccessdeniedComponent 
},
  {path:'**',component:NotfoundComponent}],
}
]

@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    SidebarComponent,
    AgetsComponent,
    RecArchiveComponent,
    RolesComponent,
    EntropotComponent,
    BrandsComponent,
    ConductorsComponent,
    TypeTextPipe,
    ConditionsComponent,
    LinesComponent,
    PathsComponent,
    AddStopComponent,
    CarsComponent,
    StopPopupComponent,
    GpsdataComponent,
    AddUserComponent,
    TestComponent,
    DynamicPopupComponent,
    ReclammationComponent,
    AgentdialogComponent,
    ErrorsComponent,
    RoleModalComponent,
    UpdateroleComponent,
    AssignRoledialogComponent,
    AddDepoComponent,
    UpdateDepotComponent,
    FailedToastComponent,
    ConfirmationComponent,
    AddBrandComponent,
    UpdateBrandComponent,
    UpdateToastComponent,
    SuccessToastComponent,
    PermissionsComponent,
    WarningToastComponent,
    AddConductorComponent,
    SearchPipe,
    UpdateConductorComponent,
    TestComponent,
    UpdateconditionComponent,

    AddConditionComponent,
    AddLineComponent,
    UpdateLineComponent,
    WarningComponent,
    AddPathComponent,
    UpdatePathComponent,
    AddCarComponent,
    UpdateCarComponent,

  ],
  imports: [
    CommonModule,
    MatRadioModule,
    ReactiveFormsModule ,
    FormsModule,
    HttpClientModule,
    MatToolbarModule,
      MatSidenavModule,
      MatListModule,
      MatIconModule,
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
      MatPaginatorModule,
      MatButtonModule,
      MatExpansionModule,
      MatSlideToggleModule,
      MatStepperModule,
      RouterModule.forChild(approute),
  ],
})
export class MainModule { }
