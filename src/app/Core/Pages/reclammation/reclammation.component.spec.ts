import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclammationComponent } from './reclammation.component';

describe('ReclammationComponent', () => {
  let component: ReclammationComponent;
  let fixture: ComponentFixture<ReclammationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReclammationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReclammationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
