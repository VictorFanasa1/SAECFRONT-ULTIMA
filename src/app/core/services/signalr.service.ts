import { Injectable } from '@angular/core';
import * as signalr from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  constructor() { }

  hubconnection!: signalr.HubConnection;

  startConnection = () => {

    this.hubconnection = new signalr.HubConnectionBuilder()
    .withUrl(environment.apiURL + 'saechub', {
      skipNegotiation: true,
      transport: signalr.HttpTransportType.WebSockets,
    }).build();

    this.hubconnection.start()
    .then(() => {
    }).catch(err => {
      console.log('Error al conectar al Hub: ' + err);
    });
  }
}
