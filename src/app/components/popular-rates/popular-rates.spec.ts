import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularRates } from './popular-rates';

describe('PopularRates', () => {
  let component: PopularRates;
  let fixture: ComponentFixture<PopularRates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularRates]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopularRates);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
