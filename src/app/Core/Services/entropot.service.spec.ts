import { TestBed } from '@angular/core/testing';

import { EntropotService } from './entropot.service';

describe('EntropotService', () => {
  let service: EntropotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntropotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
