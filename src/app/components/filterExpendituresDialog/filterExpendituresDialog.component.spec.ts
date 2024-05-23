/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterExpendituresDialogComponent } from './filterExpendituresDialog.component';

describe('FilterExpendituresDialogComponent', () => {
  let component: FilterExpendituresDialogComponent;
  let fixture: ComponentFixture<FilterExpendituresDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterExpendituresDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterExpendituresDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
