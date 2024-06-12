import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // Importa RouterModule
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FlexLayoutModule } from "@angular/flex-layout";
import { StatisticsComponent } from './components/statisticsDialog/statistics.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule, // Agrega CommonModule a la lista de imports
    HttpClientModule,
    FlexLayoutModule,
    RouterModule // Agrega RouterModule y pasa las rutas definidas a forRoot

  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }