import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsdataComponent } from './gpsdata.component';

describe('GpsdataComponent', () => {
  let component: GpsdataComponent;
  let fixture: ComponentFixture<GpsdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GpsdataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpsdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
