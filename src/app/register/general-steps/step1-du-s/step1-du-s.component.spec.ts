import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step1DuSComponent } from './step1-du-s.component';

describe('Step1CSoftwareComponent', () => {
  let component: Step1DuSComponent;
  let fixture: ComponentFixture<Step1DuSComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Step1DuSComponent]
    });
    fixture = TestBed.createComponent(Step1DuSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
