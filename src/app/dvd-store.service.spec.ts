import { TestBed } from '@angular/core/testing';

import { DvdStoreService } from './dvd-store.service';

describe('DvdStoreService', () => {
  let service: DvdStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DvdStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
