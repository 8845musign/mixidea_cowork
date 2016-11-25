/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RecognitionService } from './recognition.service';

describe('Service: Recognition', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecognitionService]
    });
  });

  it('should ...', inject([RecognitionService], (service: RecognitionService) => {
    expect(service).toBeTruthy();
  }));
});
