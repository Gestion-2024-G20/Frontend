import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegateAdminDialogComponent } from './delegate-admin-dialog.component';

describe('DelegateAdminDialogComponent', () => {
  let component: DelegateAdminDialogComponent;
  let fixture: ComponentFixture<DelegateAdminDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelegateAdminDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DelegateAdminDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
