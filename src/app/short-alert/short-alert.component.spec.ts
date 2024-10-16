import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortAlertComponent } from './short-alert.component';

describe('ShortAlertComponent', () => {
  let component: ShortAlertComponent;
  let fixture: ComponentFixture<ShortAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShortAlertComponent]
    });
    fixture = TestBed.createComponent(ShortAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
