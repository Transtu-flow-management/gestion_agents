import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConductorComponent } from './add-conductor.component';

describe('AddConductorComponent', () => {
  let component: AddConductorComponent;
  let fixture: ComponentFixture<AddConductorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddConductorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddConductorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
