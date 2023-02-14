import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImoAchatComponent } from './imo-achat.component';

describe('ImoAchatComponent', () => {
  let component: ImoAchatComponent;
  let fixture: ComponentFixture<ImoAchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImoAchatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImoAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
