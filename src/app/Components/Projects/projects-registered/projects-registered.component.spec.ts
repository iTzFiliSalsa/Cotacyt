import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsRegisteredComponent } from './projects-registered.component';

describe('ProjectsRegisteredComponent', () => {
  let component: ProjectsRegisteredComponent;
  let fixture: ComponentFixture<ProjectsRegisteredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsRegisteredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsRegisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
