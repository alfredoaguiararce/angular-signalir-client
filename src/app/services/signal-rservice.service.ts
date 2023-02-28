import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  IHttpConnectionOptions,
} from '@microsoft/signalr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  /* Creating a variable that is going to be used to connect to the hub. */
  private HUB: string = 'RightsHub';
  private API_HUB: string = 'http://localhost:5041/' + this.HUB;
  /* A private variable that is being initialized with a type of ConnectionHub. The `!` is a non-null
  assertion operator. It is used to tell the compiler that the variable will not be null. */
  private ConnectionHub!: HubConnection;
  /* Setting the headers for the connection. */
  private options: IHttpConnectionOptions = {
    headers: { 'API-KEY': 'SecretKey1' },
  };
  

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   */
  constructor() {}

  public StartConnection(): Observable<boolean> {
    this.ConnectionHub = new HubConnectionBuilder()
                        .withUrl(this.API_HUB, this.options)
                        .withAutomaticReconnect()
                        .build();

    return new Observable<boolean>((observer) => {
      this.ConnectionHub.start()
        .then(() => {
          console.log('Conexión iniciada');
          observer.next(true);
        })
        .catch((err) => observer.error(err));
    });
  }

  /**
   * It returns an Observable that will emit a boolean value when the SignalR hub receives a message
   * from the server
   * @param {number} UserId - The user id of the user you want to listen to.
   * @returns An Observable that will emit a boolean value.
   */
  public RightsListener(UserId: number): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.ConnectionHub.on(`ReceiveRightsMessage-${UserId}`, () => {
        observer.next(true);
      });
    });
  };

  /* Listening to the hub for a message that is going to be sent from the server. */
  public ProcessAreaListener(ProcessAreaId: number): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.ConnectionHub.on(`ReceiveProcessAreaMessage-${ProcessAreaId}`, () => {
        observer.next(true);
      });
    });
  };

  /* Listening to the hub for a message that is going to be sent from the server. */
  public JobAreaListener(JobId: number): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.ConnectionHub.on(`ReceiveJobMessage-${JobId}`, () => {
        observer.next(true);
      });
    });
  };


  // Methods
  /* Invoking the method `UpdateRights` in the hub. */
  public UpdateRights(UserId: number): void {
    this.ConnectionHub.invoke('UpdateRights', UserId);
  };
  /* Invoking the method `UpdateProcessArea` in the hub. */
  public UpdateProcessArea(ProcessAreaId: number): void {
    this.ConnectionHub.invoke('UpdateProcessArea', ProcessAreaId);
  };
  /* Invoking the method `UpdateJobArea` in the hub. */
  public UpdateJobArea(JobId: number): void {
    this.ConnectionHub.invoke('UpdateJobArea', JobId);
  };
}
