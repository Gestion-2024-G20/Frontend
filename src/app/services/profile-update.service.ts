// profile-update.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileUpdateService {
  //Defino mi variable de tipo BehaviorSubject
  private profilePhotoUpdatedSource = new BehaviorSubject<string>('');
  //Creo un observable para mi variable de tipo BehaviorSubject
  profilePhotoUpdated$ = this.profilePhotoUpdatedSource.asObservable();

  // Cuando se llame a .next(url) , todas las suscripciones a profilePhotoUpdated$, reciben como valor de url el valor que se le paso a .next(url)
  updateProfilePhoto(url: string) {
    this.profilePhotoUpdatedSource.next(url);
  }
}
