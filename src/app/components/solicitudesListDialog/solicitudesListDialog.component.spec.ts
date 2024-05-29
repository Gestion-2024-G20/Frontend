import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudesListDialogComponent } from './solicitudesListDialog.component';

describe('SolicitudesListDialogComponent', () => {
  let component: SolicitudesListDialogComponent;
  let fixture: ComponentFixture<SolicitudesListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesListDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolicitudesListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
