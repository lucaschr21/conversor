import { TestBed } from '@angular/core/testing';

import { CurrencyApi } from './currency-api';

describe('CurrencyApi', () => {
  let service: CurrencyApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencyApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
