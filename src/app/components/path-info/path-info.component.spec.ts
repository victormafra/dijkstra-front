import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathInfoComponent } from './path-info.component';

describe('PathInfoComponent', () => {
  let component: PathInfoComponent;
  let fixture: ComponentFixture<PathInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PathInfoComponent]
    });
    fixture = TestBed.createComponent(PathInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
