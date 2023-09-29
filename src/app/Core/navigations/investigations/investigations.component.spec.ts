import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationsComponent } from './investigations.component';

describe('InvestigationsComponent', () => {
  let component: InvestigationsComponent;
  let fixture: ComponentFixture<InvestigationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestigationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
