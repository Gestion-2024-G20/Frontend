import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // Importa RouterModule
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { routes } from './app.routes'; // Importa las rutas definidas

import { HelloComponent } from './hello/hello.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule, // Agrega CommonModule a la lista de imports
    HttpClientModule,
    RouterModule.forRoot(routes) // Agrega RouterModule y pasa las rutas definidas a forRoot
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }