import { TestBed, inject } from '@angular/core/testing';

import { D3SimulationService } from './d3-simulation.service';

describe('D3SimulationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [D3SimulationService]
    });
  });

  it('should be created', inject([D3SimulationService], (service: D3SimulationService) => {
    expect(service).toBeTruthy();
  }));
});
