import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PathSelectionStep } from 'src/app/enums/path-selection-step.enum';
import { Cell } from 'src/app/interfaces/cell.interface';
import { PathingService } from 'src/app/services/pathing.service';

@Component({
  selector: 'dij-path-controls',
  templateUrl: './path-controls.component.html',
  styleUrls: ['./path-controls.component.scss']
})
export class PathControlsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  public controlRows = [
    {
      name: 'drone',
      imagePath: '../../../assets/icons/drone.png',
      imageDescription: 'an icon of a drone'
    },
    {
      name: 'package',
      imagePath: '../../../assets/icons/box.png',
      imageDescription: 'an icon of a package'
    },
    {
      name: 'house',
      imagePath: '../../../assets/icons/home.png',
      imageDescription: 'an icon of a house'
    },
  ];
  public form: FormGroup = new FormGroup(
    {
      drone_letter: new FormControl(''),
      drone_number: new FormControl(''),
      package_letter: new FormControl(''),
      package_number: new FormControl(''),
      house_letter: new FormControl(''),
      house_number: new FormControl(''),
    }
  )

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
      this.pathingService.getPathingSelectionStep().subscribe(resp => {
        if (resp === PathSelectionStep.Drone_Selection) {
          this.form.reset();
          this.form.enable();
        }
      })
    );
  }

  public hoverCell(cell: Cell): void {
    if (this.pathingService.getCurrentStep() === PathSelectionStep.Drone_Selection) {
      this.form.get('drone_letter')?.setValue(cell.y);
      this.form.get('drone_number')?.setValue(cell.x);
    }
    if (this.pathingService.getCurrentStep() === PathSelectionStep.Package_Selection) {
      this.form.get('package_letter')?.setValue(cell.y);
      this.form.get('package_number')?.setValue(cell.x);
    }
    if (this.pathingService.getCurrentStep() === PathSelectionStep.House_Selection) {
      this.form.get('house_letter')?.setValue(cell.y);
      this.form.get('house_number')?.setValue(cell.x);
    }
  }

  public clickCell(cell: Cell): void {
    if (this.pathingService.getCurrentStep() === PathSelectionStep.Drone_Selection) {
      this.pathingService.setDroneCell(cell);
      this.form.get('drone_letter')?.setValue(cell.y);
      this.form.get('drone_number')?.setValue(cell.x);
      this.form.get('drone_letter')?.disable();
      this.form.get('drone_number')?.disable();
    }
    if (this.pathingService.getCurrentStep() === PathSelectionStep.Package_Selection) {
      this.pathingService.setPackageCell(cell);
      this.form.get('package_letter')?.setValue(cell.y);
      this.form.get('package_number')?.setValue(cell.x);
      this.form.get('package_letter')?.disable();
      this.form.get('package_number')?.disable();
    }
    if (this.pathingService.getCurrentStep() === PathSelectionStep.House_Selection) {
      this.pathingService.setHouseCell(cell);
      this.form.get('house_letter')?.setValue(cell.y);
      this.form.get('house_number')?.setValue(cell.x);
      this.form.get('house_letter')?.disable();
      this.form.get('house_number')?.disable();
    }
    this.pathingService.incrementStep();
  }  
}
