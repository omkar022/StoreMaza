import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowProductImgesDialogComponent } from './show-product-imges-dialog.component';

describe('ShowProductImgesDialogComponent', () => {
  let component: ShowProductImgesDialogComponent;
  let fixture: ComponentFixture<ShowProductImgesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowProductImgesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowProductImgesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
