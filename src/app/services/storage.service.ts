import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getData(key: string): any {
    const localStorageData = window.localStorage.getItem(key);
    return localStorageData ? JSON.parse(localStorageData) : undefined;  
  }

  setData(key: string, data: any): undefined {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
