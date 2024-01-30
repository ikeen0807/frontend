import { TestBed } from '@angular/core/testing';

import { SucsService } from './sucs.service';

describe('SucsService', () => {
  let service: SucsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SucsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
