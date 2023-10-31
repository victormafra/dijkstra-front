import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, combineLatest, firstValueFrom } from 'rxjs';
import { PathSelectionStep } from '../enums/path-selection-step.enum';
import { Cell } from '../interfaces/cell.interface';
import { Node } from '../interfaces/node.interface';
import { TimeRequiredRelation } from '../interfaces/time-required-relation.interface';

@Injectable({
  providedIn: 'root'
})
export class PathingService implements OnDestroy {
  private currentStep = PathSelectionStep.Drone_Selection;

  private pathTimmings!: TimeRequiredRelation;
  private visitedNodes: Node[] = [];
  private priorityQ: Node[] = [];
  private allLetters = Array(26).fill(0).map((x,i) => String.fromCharCode(i + 65));
  private subscriptions: Subscription[] = [];

  private droneCell: EventEmitter<Cell> = new EventEmitter<Cell>();
  private packageCell: EventEmitter<Cell> = new EventEmitter<Cell>();
  private houseCell: EventEmitter<Cell> = new EventEmitter<Cell>();
  private path: EventEmitter<string[]> = new EventEmitter<string[]>();
  private pathInfo: EventEmitter<any> = new EventEmitter<any>();
  private timeToRun: EventEmitter<string> = new EventEmitter<string>();
  private pathingSelectionStep: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    protected httpClient: HttpClient
  ) {
    this.subscribeToAllEvents();
    this.getPathTimmings();
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public subscribeToAllEvents(): void {
    this.subscriptions.push(
      combineLatest(
        {
          droneCell: this.getDroneCell(),
          packageCell: this.getPackageCell(),
          houseCell: this.getHouseCell(),
        }
      ).subscribe(value => {
        this.findDronePath(
          {
            drone: value.droneCell,
            package: value.packageCell,
            house: value.houseCell
          }
        );
      })
    );
  }
  
  public getCurrentStep(): number {
    return this.currentStep;
  }

  public resetPathSelectionStep(): void {
    this.currentStep = 0;
    this.droneCell.emit(undefined);
    this.packageCell.emit(undefined);
    this.houseCell.emit(undefined);
    this.path.emit([]);
    this.pathingSelectionStep.emit(this.currentStep);
  }

  public incrementStep(): void {
    this.currentStep = Math.min(this.currentStep + 1, 3);
    this.pathingSelectionStep.emit(this.currentStep);
  }

  public setDroneCell(cell: Cell): void {
    this.droneCell.emit(cell);
  }
  public setPackageCell(cell: Cell): void {
    this.packageCell.emit(cell);
  }
  public setHouseCell(cell: Cell): void {
    this.houseCell.emit(cell);
  }

  public getDroneCell(): Observable<Cell> {
    return this.droneCell;
  }
  public getPackageCell(): Observable<Cell> {
    return this.packageCell;
  }
  public getHouseCell(): Observable<Cell> {
    return this.houseCell;
  }
  public getPath(): Observable<string[]> {
    return this.path;
  }
  public getPathInfo(): Observable<any> {
    return this.pathInfo;
  }
  public getTimeToRun(): Observable<any> {
    return this.timeToRun;
  }
  public getPathingSelectionStep(): Observable<any> {
    return this.pathingSelectionStep;
  }

  private async getPathTimmings(): Promise<TimeRequiredRelation> {
    const url = 'https://mocki.io/v1/10404696-fd43-4481-a7ed-f9369073252f';
    return firstValueFrom(this.httpClient.get<TimeRequiredRelation>(url));
  }

  private getCellDistance(cellA: string, cellB: string): number {
    return this.pathTimmings[cellA][cellB];
  }
  
  private getAdjacentCells(cell: string): string[] {
    const letters = [''].concat(this.allLetters);
  
    const adjacents = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    const cellX = cell.charCodeAt(0)-64;
    const cellY = +cell[1];
  
    const adjacentCells = [];
    for (let adjacent of adjacents) {
      if (cellX+adjacent[0] && cellY+adjacent[1] && cellX+adjacent[0] < 9 && cellY+adjacent[1] < 9) {
        adjacentCells.push(`${letters[cellX+adjacent[0]]}${cellY+adjacent[1]}`);
      }
    }
  
    return adjacentCells;
  }
  
  private compare(a: Node, b: Node) {
    return b.time - a.time;
  }
  private checkAdjacentCells(node: Node): void {
    const adjacentCells = this.getAdjacentCells(node.node);
  
    for (let adjacent of adjacentCells) {
      if (!this.visitedNodes.find(x => x.node === adjacent)) {
        this.priorityQ.push(
          {
            time: this.getCellDistance(node.node, adjacent) + node.time,
            node: adjacent,
            path: node.path ? node.path.concat(node) : [node]
          }
        );
      }
    }
  }

  private findShortestPath(startCell: Cell, endCell: Cell): Node[] {    
    const startNode: string = `${startCell.y}${startCell.x}`;
    const endNode: string = `${endCell.y}${endCell.x}`;

    this.visitedNodes = [];
    this.priorityQ = [];
  
    let nextNode: Node = {time: 0, node: startNode};
    this.visitedNodes.push(nextNode);
  
    while(nextNode.node !== endNode) {
      this.checkAdjacentCells(nextNode);
  
      this.priorityQ.sort(this.compare);
      nextNode = this.priorityQ.pop()!;
      this.visitedNodes.push(nextNode);
    }
  
    return nextNode.path!.concat([{time: nextNode.time, node: nextNode.node}]);
  }

  public async findDronePath(path: {drone: Cell, package: Cell, house: Cell}): Promise<void> {
    if (!this.pathTimmings) {
      this.pathTimmings = await this.getPathTimmings();
    }

    const startTime = performance.now();

    const firstPath = this.findShortestPath(path.drone, path.package);
    const secondPath = this.findShortestPath(path.package, path.house);
    
    const endTime = performance.now();

    const timeToRun = (endTime - startTime).toFixed(2);
    this.timeToRun.emit(timeToRun);

    const timeToTravel = (firstPath.at(-1)!.time + secondPath.at(-1)!.time).toFixed(2);
    const pathInfo = {
      droneCell: `${path.drone.y}${path.drone.x}`,
      packageCell: `${path.package.y}${path.package.x}`,
      houseCell: `${path.house.y}${path.house.x}`,
      time: timeToTravel
    }
    this.pathInfo.emit(pathInfo);

    const fullPath = firstPath.map(x => x.node).concat(secondPath.map(x => x.node));
    this.path.emit(fullPath);
  }  
}
