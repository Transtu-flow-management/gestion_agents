import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Core/Pages/home/home.component';
import { SigninComponent } from './Core/Pages/signin/signin.component';
import { AddUserComponent } from './Dialogs/add-user/add-user.component';
import { AgetsComponent } from './Core/Pages/agets/agets.component';
import { RolesComponent } from './Core/Pages/roles/roles.component';
import { PermissionsComponent } from './Core/Pages/permissions/permissions.component';
import { EntropotComponent } from './Core/Pages/entropot/entropot.component';
import { AddDepoComponent } from './Dialogs/add-depo/add-depo.component';
import { AddBrandComponent } from './Dialogs/add-brand/add-brand.component';
import { BrandsComponent } from './Core/Pages/brands/brands.component';
import { ConductorsComponent } from './Core/Pages/conductors/conductors.component';
import { ConditionsComponent } from './Core/Pages/conditions/conditions.component';
import { TestComponent } from './Core/Pages/test/test.component';
import { NotfoundComponent } from './Core/Pages/errors/notfound/notfound.component';
import { LinesComponent } from './Core/Pages/lines/lines.component';
import { AddConditionComponent } from './Dialogs/add-condition/add-condition.component';
import { RoleModalComponent } from './Dialogs/role-modal/role-modal.component';
import { UpdateroleComponent } from './Dialogs/updaterole/updaterole.component';
import { PathsComponent } from './Core/Pages/paths/paths.component';
import { AddPathComponent } from './Core/navigations/add-path/add-path.component';
import { UpdatePathComponent } from './Core/navigations/update-path/update-path.component';
import { AddStopComponent } from './Core/navigations/add-stop/add-stop.component';
import { CarsComponent } from './Core/Pages/cars/cars.component';

const approute: Routes = [
  {path:'',redirectTo:'home',pathMatch:'full'},
  {path: 'home', component: HomeComponent},
  {path:'signin',component: SigninComponent},//canActivate:[AuthGuard]
  {path: 'add_user',component:AddUserComponent},
  {path:'permissions',component:PermissionsComponent},
  {path:'agents',component:AgetsComponent},
  {path:'roles',component:RolesComponent},
  {path:'entropots',component:EntropotComponent},
  {path:'conductors',component:ConductorsComponent},
  {path:'brands',component:BrandsComponent},
  {path:'conditions',component:ConditionsComponent},
  {path:'add',component:TestComponent},
  {path:'lines',component:LinesComponent},
  {path:'paths',component:PathsComponent},
  {path:'addpath',component:AddPathComponent},
  {path:'updatepath',component:UpdatePathComponent},
  {path:'addstop',component:AddStopComponent},
  {path:'cars',component:CarsComponent},
  {path:'**',component:NotfoundComponent},
]
@NgModule({
  imports: [RouterModule.forRoot(approute)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
