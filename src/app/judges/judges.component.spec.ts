import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgesComponent } from './judges.component';

describe('JudgesComponent', () => {
  let component: JudgesComponent;
  let fixture: ComponentFixture<JudgesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JudgesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JudgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
