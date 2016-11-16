/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EnvironmentGuardService } from './environment-guard.service';

describe('Service: EnvironmentGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnvironmentGuardService]
    });
  });

  it('should ...', inject([EnvironmentGuardService], (service: EnvironmentGuardService) => {
    expect(service).toBeTruthy();
  }));
});
