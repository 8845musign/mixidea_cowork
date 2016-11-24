/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RecordingService } from './recording.service';

describe('Service: Recording', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecordingService]
    });
  });

  it('should ...', inject([RecordingService], (service: RecordingService) => {
    expect(service).toBeTruthy();
  }));
});
