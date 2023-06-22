import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Core/Pages/home/home.component';
import { SigninComponent } from './Core/Pages/signin/signin.component';
import { AddUserComponent } from './Core/Pages/add-user/add-user.component';
import { AgetsComponent } from './Core/Pages/agets/agets.component';
import { RolesComponent } from './Core/Pages/roles/roles.component';
import { PermissionsComponent } from './Core/Pages/permissions/permissions.component';
import { EntropotComponent } from './Core/Pages/entropot/entropot.component';
import { ReseauComponent } from './Core/Pages/reseau/reseau.component';
import { AddDepoComponent } from './Dialogs/add-depo/add-depo.component';
import { AddBrandComponent } from './Dialogs/add-brand/add-brand.component';
import { BrandsComponent } from './Core/Pages/brands/brands.component';

const approute: Routes = [
  {path:'',redirectTo:'home',pathMatch:'full'},
  {path: 'home', component: HomeComponent},
  {path:'signin',component: SigninComponent},//canActivate:[AuthGuard]
  {path: 'add_user',component:AddUserComponent},
  {path:'permissions',component:PermissionsComponent},
  {path:'agents',component:AgetsComponent},
  {path:'roles',component:RolesComponent},
  {path:'entropot',component:EntropotComponent},
  {path:'reseau',component:AddDepoComponent},
  {path:'marque',component:BrandsComponent}
]
@NgModule({
  imports: [RouterModule.forRoot(approute)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
