import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Stop } from '../Models/Stop';

@Injectable({
  providedIn: 'root'
})
export class SelectedStopService {
  stopMarkers: L.Marker[] = [];

  constructor() { }
  private selectedStopSubject = new BehaviorSubject<Stop | null>(null);
  selectedStop$ = this.selectedStopSubject.asObservable();
  setSelectedStop(stop: Stop) {
    this.selectedStopSubject.next(stop);
  }

  removeMarker(stopId: string): void {
    const marker = this.stopMarkers[stopId];
    if (marker) {
      delete this.stopMarkers[stopId];
    }
  }
}
