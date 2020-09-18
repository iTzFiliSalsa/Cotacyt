import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraForPartComponent } from './gra-for-part.component';

describe('GraForPartComponent', () => {
  let component: GraForPartComponent;
  let fixture: ComponentFixture<GraForPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraForPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraForPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
