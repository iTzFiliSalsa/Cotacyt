import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraForSGComponent } from './gra-for-sg.component';

describe('GraForSGComponent', () => {
  let component: GraForSGComponent;
  let fixture: ComponentFixture<GraForSGComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraForSGComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraForSGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
