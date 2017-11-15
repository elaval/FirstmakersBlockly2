import { TestBed, inject } from '@angular/core/testing';

import { BoardagentService } from './boardagent.service';

describe('BoardagentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoardagentService]
    });
  });

  it('should be created', inject([BoardagentService], (service: BoardagentService) => {
    expect(service).toBeTruthy();
  }));
});
