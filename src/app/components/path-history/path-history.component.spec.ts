import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathHistoryComponent } from './path-history.component';

describe('PathHistoryComponent', () => {
  let component: PathHistoryComponent;
  let fixture: ComponentFixture<PathHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PathHistoryComponent]
    });
    fixture = TestBed.createComponent(PathHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
