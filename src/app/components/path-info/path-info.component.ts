import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PathSelectionStep } from 'src/app/enums/path-selection-step.enum';
import { PathingService } from 'src/app/services/pathing.service';

@Component({
  selector: 'dij-path-info',
  templateUrl: './path-info.component.html',
  styleUrls: ['./path-info.component.scss']
})
export class PathInfoComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  
  public algorithmSpeed: string = ''
  public timeToTravel: string = ''
  public pathTaken: string = ''

  constructor(
    protected pathingService: PathingService
  ) { }

  ngOnInit(): void {
    this.subscribeToPathEvents();
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  subscribeToPathEvents(): void {
    this.subscriptions.push(
      this.pathingService.getPathInfo().subscribe(resp => {
        this.timeToTravel = `The total time to travel was ${resp.time}s`;
      }),
      this.pathingService.getPath().subscribe(resp => {
        this.pathTaken = `The full path is: ${resp.toString().replaceAll(',', ' -> ')}`;
      }),
      this.pathingService.getTimeToRun().subscribe(resp => {
        this.algorithmSpeed = `Finding the optimal drone path took ${resp} milliseconds`;
      }),
      this.pathingService.getPathingSelectionStep().subscribe(resp => {
        if (resp === PathSelectionStep.Drone_Selection) {
          this.timeToTravel = '';
          this.pathTaken = '';
          this.algorithmSpeed = '';
        }
      })
    );
  }
}
