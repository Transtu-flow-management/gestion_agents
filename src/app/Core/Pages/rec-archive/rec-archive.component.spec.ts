import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecArchiveComponent } from './rec-archive.component';

describe('RecArchiveComponent', () => {
  let component: RecArchiveComponent;
  let fixture: ComponentFixture<RecArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecArchiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
