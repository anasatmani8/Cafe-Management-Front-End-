import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtspComponent } from './wtsp.component';

describe('WtspComponent', () => {
  let component: WtspComponent;
  let fixture: ComponentFixture<WtspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WtspComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WtspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
