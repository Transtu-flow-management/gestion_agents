import { TestBed } from '@angular/core/testing';

import { StopserviceService } from './stopservice.service';

describe('StopserviceService', () => {
  let service: StopserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StopserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
