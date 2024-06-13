import { Injectable } from '@angular/core';
import { Group } from '../../classes/group';
import { BalanceService } from '../services/balance.service';
import { GroupService } from '../services/group.service';
import { SnackbarService } from '../services/snackbar.service';
import { lastValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class NonForcedDeleteService {
  constructor(
    private groupService: GroupService,
    private balanceService: BalanceService,
    private snackBarService: SnackbarService,
  ) {}
  async verifyAndDelete(group: Group) : Promise<boolean>{
        if (!group.is_deleted){
            return false;
        }

        let balanceIsNull = await lastValueFrom(this.balanceService.balanceIsNull(group.id_group)) as number;
        if (balanceIsNull == 0){
          return false;
        } 

        await lastValueFrom(this.groupService.deleteGroup(group.id_group)) as Group;
        this.snackBarService.open('Se finalizó la eliminación no forzada del grupo dado que se terminaron de saldar las deudas.', 5000);
        return true;
  }
}



