import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { PathSelectionStep } from 'src/app/enums/path-selection-step.enum';
import { Cell } from 'src/app/interfaces/cell.interface';
import { PathingService } from 'src/app/services/pathing.service';

@Component({
  selector: 'dij-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnDestroy {  
  @Input() droneLocation: Cell | undefined;
  @Input() packageLocation: Cell | undefined;
  @Input() houseLocation: Cell | undefined;

  @Output() onCellHover: EventEmitter<Cell> = new EventEmitter<Cell>();
  @Output() onCellClick: EventEmitter<Cell> = new EventEmitter<Cell>();
  
  private subscriptions: Subscription[] = [];
  private fullPath: string[] = [];

  public math = Math;
  public numberOfRows = 8;
  public numberOfColumns = 8;
  public columns = Array(this.numberOfColumns).fill(0).map((x,i) => this.numberOfColumns - i);
  public allLetters = Array(26).fill(0).map((x,i) => String.fromCharCode(i + 65));

  constructor(
    private pathingService: PathingService,
  ) {
    this.subscribeToPathEvents();
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  private subscribeToPathEvents(): void {
    this.subscriptions.push(
      this.pathingService.getDroneCell().subscribe(resp => {
        this.droneLocation = resp;
      }),
      this.pathingService.getPackageCell().subscribe(resp => {
        this.packageLocation = resp;
      }),
      this.pathingService.getHouseCell().subscribe(resp => {
        this.houseLocation = resp;
      }),
      this.pathingService.getPath().subscribe(resp => {
        this.fullPath = resp;
      })
    );
  }

  getCellClass(row: number, column: number, letter: string): string {
    let klass = (row + column) % 2 ? 'light-square' : 'dark-square';

    const cell = `${letter}${column}`;
    if (this.fullPath.some(x => x === cell)) {
      klass += ' visited-square';
    }

    return klass;
  }

  cellClicked(x: number, y: string): void {
    this.onCellClick.emit({x, y});
  }

  cellHovered(x: number, y: string): void {
    this.onCellHover.emit({x, y});
  }
}
