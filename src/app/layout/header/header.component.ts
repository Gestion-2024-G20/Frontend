import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { UserService } from '../../services/user.service';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProfileUpdateService } from '../../services/profile-update.service';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @Output() sidebarEvent = new EventEmitter<any>();
  fotoPerfilURL = '';

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private userService: UserService,
    private profileUpdateService: ProfileUpdateService
  ) {
  }

  async ngOnInit(): Promise<void> {
    let filenameFotoPerfil = await lastValueFrom(this.userService.getProfilePhotoURL(this.authService.loggedUserId())) as string;
    this.fotoPerfilURL = "assets/images/" + filenameFotoPerfil;

    //El método subscribe es para que si hay cambios, se actualice
    this.profileUpdateService.profilePhotoUpdated$.subscribe(url => {
      if(url){
        this.fotoPerfilURL = url;
      }
    });
  }

  toggleSidebar(){
    this.sidebarEvent.emit();
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUsername(){
    return this.authService.getUsername()
  }

  goToProfileSettings() {
    this.router.navigate(['/profile-settings']);
  }

}
