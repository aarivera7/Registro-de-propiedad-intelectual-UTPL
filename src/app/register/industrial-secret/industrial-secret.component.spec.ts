import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustrialSecretComponent } from './industrial-secret.component';

describe('IndustrialSecretComponent', () => {
  let component: IndustrialSecretComponent;
  let fixture: ComponentFixture<IndustrialSecretComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndustrialSecretComponent]
    });
    fixture = TestBed.createComponent(IndustrialSecretComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
