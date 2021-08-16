import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorsRegisteredComponent } from './authors-registered.component';

describe('AuthorsRegisteredComponent', () => {
  let component: AuthorsRegisteredComponent;
  let fixture: ComponentFixture<AuthorsRegisteredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorsRegisteredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorsRegisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
