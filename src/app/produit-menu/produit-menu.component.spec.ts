import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitMenuComponent } from './produit-menu.component';

describe('ProduitMenuComponent', () => {
  let component: ProduitMenuComponent;
  let fixture: ComponentFixture<ProduitMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProduitMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduitMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
