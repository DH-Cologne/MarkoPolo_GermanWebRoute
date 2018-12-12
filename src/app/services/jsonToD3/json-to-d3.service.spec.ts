import { TestBed, inject } from '@angular/core/testing';

import { JsonToD3Service } from './json-to-d3.service';

describe('JsonToD3Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JsonToD3Service]
    });
  });

  it('should be created', inject([JsonToD3Service], (service: JsonToD3Service) => {
    expect(service).toBeTruthy();
  }));
});
