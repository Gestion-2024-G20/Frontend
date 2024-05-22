import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationListDialogComponent } from './invitation-list-dialog.component';

describe('InvitationListDialogComponent', () => {
  let component: InvitationListDialogComponent;
  let fixture: ComponentFixture<InvitationListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationListDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvitationListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
