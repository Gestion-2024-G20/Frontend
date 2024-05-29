import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { GroupMember } from '../../../classes';
import { GroupMemberService } from '../../services/groupMembers.service';
import { NavigationExtras, Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { Request } from '../../../classes/request';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    NgIf
  ],
})
export class RequestComponent implements OnInit {
  userLoggedIn: boolean = false;
  userDetectedIsMember: boolean = false;
  username: string = '';
  userId: number = -1;
  groupId: number = -1;
  token: string = '';

  constructor(private auth: AuthService, private groupMemberService: GroupMemberService, private router: Router,
    private requestService: RequestService, private snackBarService: SnackbarService
  ) {
    if (this.auth.isAuth()) {
      this.userLoggedIn = true;
      this.username = this.auth.getUsername();
      this.userId = this.auth.loggedUserId();
    } else {
      console.log('User not logged in.');
    }
  }

  async ngOnInit() {
    const path = window.location.pathname.split('/');
    this.groupId = Number(path[2]);
    this.token = path[3];

    const members = await lastValueFrom(this.groupMemberService.getGroupMembers(this.groupId)) as [GroupMember];
    if (members.some((member: GroupMember) => member.id_user === this.userId)) {
      this.userDetectedIsMember = true;
    }
  }

  goTo(path: string) {
    const navigationExtras: NavigationExtras = {
      state: { groupId: this.groupId, token: this.token }
    };
    this.router.navigate([path], navigationExtras);
  }

  async sendRequest() {
    try {
      const request: Request = {
        id_request: -1,
        id_group: this.groupId,
        token: this.token,
        time_created: ''
      }
      
      const res = await firstValueFrom(this.requestService.sendRequest(request, this.userId));
      this.snackBarService.open('Your join request has been sent!', 'success');
      this.goTo('/home')  
  
    } catch (error: any) {
      this.snackBarService.open(error, 'error');

    }
  }

}
