import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRoledialogComponent } from './assign-roledialog.component';

describe('AssignRoledialogComponent', () => {
  let component: AssignRoledialogComponent;
  let fixture: ComponentFixture<AssignRoledialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignRoledialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignRoledialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
