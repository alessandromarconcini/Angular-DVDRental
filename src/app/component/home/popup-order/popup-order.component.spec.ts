import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupOrderComponent } from './popup-order.component';

describe('PopupOrderComponent', () => {
  let component: PopupOrderComponent;
  let fixture: ComponentFixture<PopupOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupOrderComponent]
    });
    fixture = TestBed.createComponent(PopupOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
