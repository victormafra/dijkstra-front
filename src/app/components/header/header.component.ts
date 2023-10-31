import { Component } from '@angular/core';
import { PathSelectionStep } from 'src/app/enums/path-selection-step.enum';
import { PathingService } from 'src/app/services/pathing.service';

@Component({
  selector: 'dij-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public get pathSelectionStep(): typeof PathSelectionStep {
    return PathSelectionStep;
  }

  constructor(
    protected pathingService: PathingService
  ) { }
}
