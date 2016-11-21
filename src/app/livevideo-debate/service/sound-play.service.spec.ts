/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SoundPlayService } from './sound-play.service';

describe('Service: SoundPlay', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SoundPlayService]
    });
  });

  it('should ...', inject([SoundPlayService], (service: SoundPlayService) => {
    expect(service).toBeTruthy();
  }));
});
