import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePathComponent } from './update-path.component';

describe('UpdatePathComponent', () => {
  let component: UpdatePathComponent;
  let fixture: ComponentFixture<UpdatePathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePathComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
