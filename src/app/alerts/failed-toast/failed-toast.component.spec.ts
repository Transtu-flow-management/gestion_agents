import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedToastComponent } from './failed-toast.component';

describe('FailedToastComponent', () => {
  let component: FailedToastComponent;
  let fixture: ComponentFixture<FailedToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailedToastComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FailedToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
