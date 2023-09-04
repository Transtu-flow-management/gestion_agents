import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopPopupComponent } from './stop-popup.component';

describe('StopPopupComponent', () => {
  let component: StopPopupComponent;
  let fixture: ComponentFixture<StopPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StopPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StopPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
