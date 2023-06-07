import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Core/Pages/home/home.component';
import { SigninComponent } from './signin/signin.component';
import { AddUserComponent } from './Core/Pages/add-user/add-user.component';
import { AgetsComponent } from './Core/Pages/agets/agets.component';
import { RolesComponent } from './Core/Pages/roles/roles.component';
import { PermissionsComponent } from './Core/Pages/permissions/permissions.component';

const approute: Routes = [
  {path:'',redirectTo:'home',pathMatch:'full'},
  {path: 'home', component: HomeComponent},
  {path:'signin',component: SigninComponent},//canActivate:[AuthGuard]
  {path: 'add_user',component:AddUserComponent},
  {path:'permissions',component:PermissionsComponent},
  {path:'agents',component:AgetsComponent},
  {path:'roles',component:RolesComponent},
]
@NgModule({
  imports: [RouterModule.forRoot(approute)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
