import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  /* Creating a variable that is going to be used to connect to the hub. */
  private HUB     : string = 'GroupHub'
  private API_HUB : string = 'http://localhost:5018/' + this.HUB;

  /* A private variable that is being initialized with a type of ConnectionHub. The `!` is a non-null
  assertion operator. It is used to tell the compiler that the variable will not be null. */
  private ConnectionHub!: HubConnection;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   */
  constructor() { }

  public StartConnection(): Observable<boolean> 
  {
    this.ConnectionHub = new HubConnectionBuilder()
                        .withUrl(this.API_HUB)
                        .build();

    return new Observable<boolean>(observer => {
      this.ConnectionHub.start()
        .then(() => {
          console.log('Conexión iniciada');
          observer.next(true);
        })
        .catch(err => observer.error(err));
    });
  }

  public AddNewUserListener(): Observable<string> {
    return new Observable<string>(observer => {
      this.ConnectionHub.on('NewUser', (groupname, username) => {
        observer.next(groupname + username);
      });
    });
  }

  public InvokeJoinGroup(groupname : string, username : string): void {
    this.ConnectionHub.invoke('JoinGroup', groupname, username);
  }
}
