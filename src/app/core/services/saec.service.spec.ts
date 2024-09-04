import { TestBed } from '@angular/core/testing';

import { SaecService } from './saec.service';

describe('SaecService', () => {
  let service: SaecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
