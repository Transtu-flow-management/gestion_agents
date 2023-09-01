import { TestBed } from '@angular/core/testing';

import { SelectedStopService } from './selected-stop.service';

describe('SelectedStopService', () => {
  let service: SelectedStopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedStopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
