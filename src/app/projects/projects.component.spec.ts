import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectsComponent } from './projects.component';

describe('ProyectsComponent', () => {
  let component: ProyectsComponent;
  let fixture: ComponentFixture<ProyectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
