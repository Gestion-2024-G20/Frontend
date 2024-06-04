import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { lastValueFrom } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../classes';
import { SnackBarComponent } from '../../components/snackBar/snackBar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../services/snackbar.service';
import { ProfileUpdateService } from '../../services/profile-update.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ ReactiveFormsModule, 
    FormsModule, 
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, 
    NgIf, FlexLayoutModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profileForm = this.formBuilder.group(
    {
      username: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telephone: new FormControl('', [Validators.required]),
      // profilePhoto: new FormControl('')  // Añadir el campo de la foto de perfil

    },
  );

  submitted = false;
  profilePhotoURL = '';

  constructor(
    private authService: AuthService, 
    private formBuilder: FormBuilder, 
    private userService: UserService, 
    private snackBarService: SnackbarService,
    private profileUpdateService: ProfileUpdateService
  ) {
    
  } 

  async ngOnInit() {
    await lastValueFrom(
      this.userService.getUser(this.authService.loggedUserId())
    ).then((user: any) => {
      console.log(user);
      this.profileForm.patchValue({
        username: user.username,
        name: user.name,
        lastname: user.lastname,
        email: user.mail, 
        telephone: user.celular,
      });
    }).catch(err => {
      console.log(err);
    })

    try {
      const profilePhotoURL = await lastValueFrom(
        this.userService.getProfilePhotoURL(this.authService.loggedUserId())
      );
      this.profilePhotoURL = "assets/images/" + profilePhotoURL || '';
    } catch (err) {
      console.log(err);
    }

  }
  
  async updateProfile(){
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;
    }
    const user = new User();
    user.username = this.profileForm.value.username || '';
    user.name = this.profileForm.value.name || '';
    user.lastname = this.profileForm.value.lastname || '';
    user.mail = this.profileForm.value.email || '';
    user.celular = this.profileForm.value.telephone || '';
    const updatedUser = await lastValueFrom(this.userService.updateUser(user, this.authService.loggedUserId())) as User || null;
    console.log(updatedUser);
    
    if (updatedUser) {
      console.log('User updated:', updatedUser);
    } else {
      console.log('Error updating user');
    }
  }

  async actualizarFoto(event: any) {
    const file = event.target.files[0];
    const fileName = file.name;
    const filePath = URL.createObjectURL(file);
    console.log(fileName);
    console.log(event.target)
    const updatedProfilePicture = await lastValueFrom(this.userService.updateProfilePhoto(fileName, this.authService.loggedUserId())) as User;
    console.log(updatedProfilePicture);
    if (updatedProfilePicture) {
      this.profilePhotoURL = "assets/images/" + fileName;
     
      this.profileUpdateService.updateProfilePhoto(this.profilePhotoURL);

      this.snackBarService.open('Profile picture updated successfully', 'success');
      console.log('Profile picture updated:', updatedProfilePicture);
    } else {
      console.log('Error updating profile picture');
    }
  }

}
