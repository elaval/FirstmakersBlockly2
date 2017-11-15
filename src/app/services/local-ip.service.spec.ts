import { TestBed, inject } from '@angular/core/testing';

import { LocalIpService } from './local-ip.service';

describe('LocalIpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalIpService]
    });
  });

  it('should be created', inject([LocalIpService], (service: LocalIpService) => {
    expect(service).toBeTruthy();
  }));
});
