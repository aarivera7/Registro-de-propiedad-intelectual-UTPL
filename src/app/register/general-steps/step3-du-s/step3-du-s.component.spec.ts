import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step3DuSComponent } from './step3-du-s.component';

describe('Step3CSoftwareComponent', () => {
  let component: Step3DuSComponent;
  let fixture: ComponentFixture<Step3DuSComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Step3DuSComponent]
    });
    fixture = TestBed.createComponent(Step3DuSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
