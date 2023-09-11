import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, interval, switchMap } from 'rxjs';
import { GPS } from '../Models/Gps';
import { webSocket,WebSocketSubject  } from 'rxjs/webSocket';
@Injectable({
  providedIn: 'root'
})
export class GpsServiceService {
  private url = 'http://localhost:5600';
  public socket$: WebSocketSubject<any>;
  constructor(private http: HttpClient) {
    this.socket$ = webSocket('ws://localhost:5600/track');
   }
  getGPSData(id:string) {
    return interval(1000).pipe(
      switchMap(() =>this.http.get(`${this.url}/track/${id}`))
    );
  
}

send(message: any) {
  this.socket$.next(message);
}
receive() {
  return this.socket$.asObservable();
}
close() {
  this.socket$.complete();
}

websocketmessage(id:string){
  const websocket = webSocket(`ws://localhost:5600/track?vehicleID=${id}`)
}

}
