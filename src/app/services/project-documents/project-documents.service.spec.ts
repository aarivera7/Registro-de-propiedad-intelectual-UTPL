import { TestBed } from '@angular/core/testing';

import { ProjectDocumentsService } from './project-documents.service';

describe('ProjectDocumentsService', () => {
  let service: ProjectDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectDocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
