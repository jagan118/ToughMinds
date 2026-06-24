import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Universe3dComponent } from './universe3d-component';

describe('Universe3dComponent', () => {
  let component: Universe3dComponent;
  let fixture: ComponentFixture<Universe3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Universe3dComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Universe3dComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
