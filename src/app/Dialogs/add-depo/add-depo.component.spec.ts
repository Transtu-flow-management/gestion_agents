import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDepoComponent } from './add-depo.component';

describe('AddDepoComponent', () => {
  let component: AddDepoComponent;
  let fixture: ComponentFixture<AddDepoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDepoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDepoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
