import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagorComponent } from './magor.component';

describe('MagorComponent', () => {
  let component: MagorComponent;
  let fixture: ComponentFixture<MagorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MagorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MagorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
