import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Core/Pages/home/home.component';
import { HeaderComponent } from './Core/Pages/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from './Core/Pages/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { SigninComponent } from './signin/signin.component';
import { ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddUserComponent } from './Core/Pages/add-user/add-user.component';
import { MatSelectModule } from '@angular/material/select';
import { AgetsComponent } from './Core/Pages/agets/agets.component';
import {MatTableModule} from '@angular/material/table';
import { AuthGuard } from './auth.guard';
import { MatDialogModule } from '@angular/material/dialog';
import { AgentdialogComponent } from './Dialogs/agentdialog/agentdialog.component';
import { ErrorsComponent } from './Dialogs/errors/errors.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { RolesComponent } from './Core/Pages/roles/roles.component';
import { AddRoleComponent } from './Core/Pages/add-role/add-role.component';
import { RoleModalComponent } from './Dialogs/role-modal/role-modal.component';
import { UpdateroleComponent } from './Dialogs/updaterole/updaterole.component';
import { PermissionsComponent } from './Core/Pages/permissions/permissions.component';
import { AdduserDialogComponent } from './Dialogs/adduser-dialog/adduser-dialog.component';
import { AssignRoledialogComponent } from './Dialogs/assign-roledialog/assign-roledialog.component';
import {MatRadioModule} from '@angular/material/radio';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    SigninComponent,
    SidebarComponent,
    AddUserComponent,
    AgetsComponent,
    AgentdialogComponent,
    ErrorsComponent,
    RolesComponent,
    AddRoleComponent,
    RoleModalComponent,
    UpdateroleComponent,
    PermissionsComponent,
    AdduserDialogComponent,
    AssignRoledialogComponent,
  ],
  imports: [
    MatRadioModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule ,
    FormsModule,
    MatToolbarModule,
      MatSidenavModule,
      MatListModule,
      MatIconModule,
      BrowserAnimationsModule,
      MatSelectModule,
      MatTableModule,
      MatDialogModule,
      MatFormFieldModule,
      MatInputModule,
      MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
