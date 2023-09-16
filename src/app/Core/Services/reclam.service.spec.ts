import { TestBed } from '@angular/core/testing';

import { ReclamService } from './reclam.service';

describe('ReclamService', () => {
  let service: ReclamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReclamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
