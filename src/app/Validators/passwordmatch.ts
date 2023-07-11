import { AbstractControl } from "@angular/forms";


export function passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.value;
    // Regular expression to check for a valid password (at least 8 characters)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  
    if (password && !passwordRegex.test(password)) {
      return { invalidPassword: true };
    }
    return null;
  }

  export function passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('con_password')?.value;
  
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

 

