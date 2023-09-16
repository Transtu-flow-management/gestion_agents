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
export class SigninComponent implements OnInit {
  isLoading = false; 
  constructor (private authservice : AuthService, private formBuilder: FormBuilder,private router: Router ) { 
    this.nameForm = this.formBuilder.group({
      username: '',
      password: '',
  });
}
 
public nameForm = new FormGroup({
  username: new FormControl('', [Validators.required, Validators.minLength(3)]),
  password: new FormControl('', [Validators.required, Validators.minLength(6)]),
});

ngOnInit(): void {
    
}

  onsubmit() {
    
    if (this.nameForm.valid) {
      this.isLoading = true;
      const username = this.nameForm.get('username').value;
      const password = this.nameForm.get('password').value;
      const credentials: loginDTO = { username, password };
  
      this.authservice.authenticate(credentials).subscribe(
        () => {

          this.router.navigate(['/home']);
        },
        error => {
          console.error('Login failed:', error);
          // Handle login error (display error message, etc.)
        }
      );
      this.isLoading = false;
    }
  
  }
}
