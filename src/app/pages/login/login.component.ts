import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavigationExtras, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  navigationExtras: NavigationExtras | undefined;

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  submitted = false;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) { 
    const navigation = this.router.getCurrentNavigation();    
		if (navigation && navigation.extras && navigation.extras.state) {
			this.navigationExtras = navigation.extras;
		}
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
      }
    );

    if (this.authService.isAuth()) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit(): void {
    let values = this.form.value;

    if (this.navigationExtras?.state){
      let path = '/request/' + this.navigationExtras.state['groupId'] + '/' + this.navigationExtras.state['token'];
      this.authService.login(values.username, values.password, [path]); 
    } else this.authService.login(values.username, values.password); 
  }


}
