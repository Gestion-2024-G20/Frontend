import { Component, EventEmitter, Output } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() sidebarEvent = new EventEmitter<any>();

  constructor(private authService: AuthService, private router: Router){}

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
}
