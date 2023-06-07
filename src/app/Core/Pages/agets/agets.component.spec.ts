import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgetsComponent } from './agets.component';

describe('AgetsComponent', () => {
  let component: AgetsComponent;
  let fixture: ComponentFixture<AgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
