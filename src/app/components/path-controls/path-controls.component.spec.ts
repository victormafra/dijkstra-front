import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathControlsComponent } from './path-controls.component';

describe('PathControlsComponent', () => {
  let component: PathControlsComponent;
  let fixture: ComponentFixture<PathControlsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PathControlsComponent]
    });
    fixture = TestBed.createComponent(PathControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
