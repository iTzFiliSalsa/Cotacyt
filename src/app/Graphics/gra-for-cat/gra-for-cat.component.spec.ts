import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraForCatComponent } from './gra-for-cat.component';

describe('GraForCatComponent', () => {
  let component: GraForCatComponent;
  let fixture: ComponentFixture<GraForCatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraForCatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraForCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
