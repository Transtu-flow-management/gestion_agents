import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentdialogComponent } from './agentdialog.component';

describe('AgentdialogComponent', () => {
  let component: AgentdialogComponent;
  let fixture: ComponentFixture<AgentdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentdialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
