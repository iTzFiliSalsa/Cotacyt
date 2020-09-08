import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdvisersComponent } from './add-advisers.component';

describe('AddAdvisersComponent', () => {
  let component: AddAdvisersComponent;
  let fixture: ComponentFixture<AddAdvisersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAdvisersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdvisersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
