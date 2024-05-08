import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend/backend.service';
import { NgIf } from '@angular/common';
import { User } from '../services/auth.service';

@Component({
  selector: 'app-hello',
  standalone: true,
  imports: [NgIf], 
  templateUrl: './hello.component.html',
})
export class HelloComponent {
  //responseContent es un parámetro que se puede utilizar en la template asociada al componente
  responseContent: Array<User>;

  constructor(private backendService: BackendService) { 
    this.responseContent = new Array;
  }

   /**
   * Initializes the component and retrieves the hello message from the backend service.
   *
   * @return {void} This function does not return anything.
   */
  ngOnInit(): void {
    this.backendService.getUsers().subscribe(
      (data: Array<User>) => {
        
        this.responseContent = data;
        console.log(data);
      },
      (error) => {
        console.error('Error al obtener datos del servidor:', error);
      }
    );
  }
}
