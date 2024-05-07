import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    FormsModule, 
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, 
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  hidePassword = true; 
  hidePasswordRepeat = true; 
  registerForm = this.formBuilder.group(
    {
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required, 
        this.RegexValidator(new RegExp('.*\\d.*'), {'noDigit': true}), 
        this.RegexValidator(new RegExp('.*[a-z].*'), {'noLowercase': true}), 
        this.RegexValidator(new RegExp('.*[A-Z].*'), {'noUppercase': true}), 
        this.RegexValidator(new RegExp('.*[@$!%*#?&^_-].*'), {'noSpecialChar': true}), 
        this.RegexValidator(new RegExp('.{8,}'), {'minLength': true}), 
      ]),
      repeatPassword: new FormControl('', [
        Validators.required, 
      ]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      cellphone: new FormControl('', [Validators.required]),
    }, {
      validators: [this.ConfirmedValidator('password', 'repeatPassword')]
    }
  );

  submitted = false;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) { }
/*
  ngOnInit(): void {

    
    if (this.authService.isAuth()) {
      this.router.navigate(['/home']);
    }
  }
  */
  RegexValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        if (!control.value) {
            return null;
        }
        const valid = regex.test(control.value);
        return valid ? null : error;
    }
}
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['notEqualPasswords']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ 'notEqualPasswords' : true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  onSubmit(): void {
    console.log(this.registerForm.value);
    let values = this.registerForm.value;
    try {
      this.authService.register(
        values.username, 
        values.password,
        values.firstName,
        values.lastName,
        values.email,
        values.cellphone 
      ); 
    } catch (error) {
      // todo show error db
    }
  }
  getPasswordErrorMessage() {
    return this.registerForm.get('password')?.hasError('required') ? 'You must enter a value' :
        this.registerForm.get('password')?.hasError('pattern') ? 
        "Password must contain at least one number, one uppercase and a " + 
        "lowercase letter and at least 8 characters<br />Password cannot" +
        "contain whitespace" :
            '';
  }
  passwordFormatValid(identifier: string) : boolean{
    return !(
      this.registerForm.get(identifier)?.hasError('noDigit') || 
      this.registerForm.get(identifier)?.hasError('noLowercase') || 
      this.registerForm.get(identifier)?.hasError('noSpecialChar') || 
      this.registerForm.get(identifier)?.hasError('noUppercase') || 
      this.registerForm.get(identifier)?.hasError('minLength') 
    ) as boolean ; 
}

}
