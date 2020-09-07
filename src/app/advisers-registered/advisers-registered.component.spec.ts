import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisersRegisteredComponent } from './advisers-registered.component';

describe('AdvisersRegisteredComponent', () => {
  let component: AdvisersRegisteredComponent;
  let fixture: ComponentFixture<AdvisersRegisteredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvisersRegisteredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisersRegisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
