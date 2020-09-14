import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticsComponent } from './estadistics.component';

describe('EstadisticsComponent', () => {
  let component: EstadisticsComponent;
  let fixture: ComponentFixture<EstadisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
