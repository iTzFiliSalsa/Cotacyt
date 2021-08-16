import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraForAseComponent } from './gra-for-ase.component';

describe('GraForAseComponent', () => {
  let component: GraForAseComponent;
  let fixture: ComponentFixture<GraForAseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraForAseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraForAseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
