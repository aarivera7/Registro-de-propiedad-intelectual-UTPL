import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyrightDatabaseComponent } from './copyright-database.component';

describe('CopyrightDatabaseComponent', () => {
  let component: CopyrightDatabaseComponent;
  let fixture: ComponentFixture<CopyrightDatabaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CopyrightDatabaseComponent]
    });
    fixture = TestBed.createComponent(CopyrightDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
