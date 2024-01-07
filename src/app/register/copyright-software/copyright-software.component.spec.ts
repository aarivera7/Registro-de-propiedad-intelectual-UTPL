import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyrightSoftwareComponent } from './copyright-software.component';

describe('CopyrightSoftwareComponent', () => {
  let component: CopyrightSoftwareComponent;
  let fixture: ComponentFixture<CopyrightSoftwareComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CopyrightSoftwareComponent]
    });
    fixture = TestBed.createComponent(CopyrightSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
