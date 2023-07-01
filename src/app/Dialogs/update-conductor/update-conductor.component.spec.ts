import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateConductorComponent } from './update-conductor.component';

describe('UpdateConductorComponent', () => {
  let component: UpdateConductorComponent;
  let fixture: ComponentFixture<UpdateConductorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateConductorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateConductorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
