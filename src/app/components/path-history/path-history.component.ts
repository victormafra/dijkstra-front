import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PathingService } from 'src/app/services/pathing.service';
import { StorageService } from 'src/app/services/storage.service';

interface HistoryEntry {
  droneCell: string,
  packageCell: string,
  houseCell: string,
  time: number
}

@Component({
  selector: 'dij-path-history',
  templateUrl: './path-history.component.html',
  styleUrls: ['./path-history.component.scss']
})
export class PathHistoryComponent implements OnInit, OnDestroy {
  private LOCAL_STORAGE_KEY = 'path-history';
  private subscriptions: Subscription[] = [];

  public history: HistoryEntry[] = [];
  public fillerArray: number[] = [];

  constructor (
    protected storageService: StorageService,
    private pathingService: PathingService,
  ) { }

  ngOnInit(): void {
    this.loadHistoryFromLocalStorage();
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
        this.addHistory(resp);
      }),
    );
  }

  private setupFillerArray(): void {
    this.fillerArray = [];
    for (let i = 0; i < 10 - this.history.length; i++) {
      this.fillerArray.push(0);
    }
  }

  private loadHistoryFromLocalStorage(): void {
    const localStorageData = this.storageService.getData(this.LOCAL_STORAGE_KEY);
    if (localStorageData) {
      this.history = localStorageData;
    }
    this.setupFillerArray();
  }

  private saveHistoryToLocalStorage(): void {
    this.storageService.setData(this.LOCAL_STORAGE_KEY, this.history);
  }

  public addHistory(entry: HistoryEntry): void {
    this.history = [entry].concat(this.history).slice(0, 10);
    this.setupFillerArray();
    this.saveHistoryToLocalStorage();
  }
}
