import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntropotComponent } from './entropot.component';

describe('EntropotComponent', () => {
  let component: EntropotComponent;
  let fixture: ComponentFixture<EntropotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntropotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntropotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
