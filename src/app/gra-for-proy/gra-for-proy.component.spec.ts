import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraForProyComponent } from './gra-for-proy.component';

describe('GraForProyComponent', () => {
  let component: GraForProyComponent;
  let fixture: ComponentFixture<GraForProyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraForProyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraForProyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
