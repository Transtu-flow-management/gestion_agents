import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const approute: Routes = [
  {
    path: 'signin',
    loadChildren: () =>
      import('./signin/login.module').then((m) => m.LoginModule),
    
  },
  
  {
    path: '',
    loadChildren: () => import('./main/main/main.module').then((m) => m.MainModule),
  },

 
];
@NgModule({
  imports: [RouterModule.forRoot(approute)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
