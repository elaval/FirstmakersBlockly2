import { TestBed, inject } from '@angular/core/testing';

import { JavascriptInterpreterService } from './javascript-interpreter.service';

describe('JavascriptInterpreterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JavascriptInterpreterService]
    });
  });

  it('should be created', inject([JavascriptInterpreterService], (service: JavascriptInterpreterService) => {
    expect(service).toBeTruthy();
  }));
});
