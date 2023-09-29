import { Component ,OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup , Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Core/Services/auth.service';
import { loginDTO } from '../DTO/login';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent{
  isLoading = false; 
  isconencted = false;
  constructor (private authservice : AuthService, private formBuilder: FormBuilder,private router: Router ) { 
    this.nameForm = this.formBuilder.group({
      username: '',
      password: '',
  });
}
 
public nameForm = new FormGroup({
  username: new FormControl('', [Validators.required, Validators.minLength(3),Validators.email]),
  password: new FormControl('', [Validators.required, Validators.minLength(6)]),
});



  onsubmit() {
    
    if (this.nameForm.valid) {
      this.isLoading = true;
      const username = this.nameForm.get('username').value;
      const password = this.nameForm.get('password').value;
      const credentials: loginDTO = { username, password };
  
      this.authservice.authenticate(credentials).subscribe(
        (response) => {
          this.authservice.saveUser(response);
          this.router.navigate(['/home']);
        },
        error => {
          console.error('Login failed:', error);
         this.isconencted = true;
        }
      );
      this.isLoading = false;
    }
  
  }
}
