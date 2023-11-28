import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleFileLoadComponent } from './multiple-file-load.component';

describe('MultipleFileLoadComponent', () => {
  let component: MultipleFileLoadComponent;
  let fixture: ComponentFixture<MultipleFileLoadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultipleFileLoadComponent]
    });
    fixture = TestBed.createComponent(MultipleFileLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
