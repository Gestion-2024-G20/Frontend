import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import {Component} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent{
  menus = [
    {
      displayName: "Home",
      route: "/home",
      iconName: "home"
    }
  ]

  constructor(private router: Router) {
  }

  goTo(route: string){
    this.router.navigate([route]);
  }

}
