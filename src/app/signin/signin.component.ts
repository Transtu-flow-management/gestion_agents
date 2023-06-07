import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup , Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Core/Services/auth.service';
import { loginDTO } from '../DTO/login';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  constructor (private authservice : AuthService, private formBuilder: FormBuilder,private router: Router ) { 
    this.nameForm = this.formBuilder.group({
      username: '',
      password: '',
  });
}
 
//private fb: FormBuilder = new FormBuilder();
public nameForm = new FormGroup({
  username: new FormControl('', [Validators.required, Validators.minLength(3)]),
  password: new FormControl('', [Validators.required, Validators.minLength(6)]),
});

 // signinform =this.fb.group({
//  username: new FormControl('', [Validators.required, Validators.minLength(3)]),
   // password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  //});
  onsubmit() {
    if (this.nameForm.valid) {
      const username = this.nameForm.get('username').value;
      const password = this.nameForm.get('password').value;
      const credentials: loginDTO = { username, password };
  
      this.authservice.authenticate(credentials).subscribe(
        () => {
          // Authentication successful
          // Redirect to the desired component or route
          this.router.navigate(['/home']);
        },
        error => {
          console.error('Login failed:', error);
          // Handle login error (display error message, etc.)
        }
      );
    }
  }
}
