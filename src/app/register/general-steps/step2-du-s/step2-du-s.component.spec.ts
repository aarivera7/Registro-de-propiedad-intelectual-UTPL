import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step2DuSComponent } from './step2-du-scomponent';

describe('Step2CSoftwareComponent', () => {
  let component: Step2DuSComponent;
  let fixture: ComponentFixture<Step2DuSComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Step2DuSComponent]
    });
    fixture = TestBed.createComponent(Step2DuSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
