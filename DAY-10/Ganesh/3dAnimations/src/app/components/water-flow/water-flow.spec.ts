import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterFlow } from './water-flow';

describe('WaterFlow', () => {
  let component: WaterFlow;
  let fixture: ComponentFixture<WaterFlow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaterFlow],
    }).compileComponents();

    fixture = TestBed.createComponent(WaterFlow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
