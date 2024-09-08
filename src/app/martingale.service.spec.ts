import { TestBed } from '@angular/core/testing';

import { MartingaleService } from './martingale.service';

describe('MartingaleService', () => {
  let service: MartingaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MartingaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
