import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateFromGpsComponent } from './generate-from-gps.component';

describe('GenerateFromGpsComponent', () => {
  let component: GenerateFromGpsComponent;
  let fixture: ComponentFixture<GenerateFromGpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateFromGpsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateFromGpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
