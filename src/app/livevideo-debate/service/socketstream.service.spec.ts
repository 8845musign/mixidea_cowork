/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SocketstreamService } from './socketstream.service';

describe('Service: Socketstream', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketstreamService]
    });
  });

  it('should ...', inject([SocketstreamService], (service: SocketstreamService) => {
    expect(service).toBeTruthy();
  }));
});
