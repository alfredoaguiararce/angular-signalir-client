import { Component } from '@angular/core';
import { SignalRService as SignalService } from './services/signal-rservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SignalService]
})
export class AppComponent {
  ChangedText: String = "";
  UserLogedId:number = 21066;
  constructor(private SignalService: SignalService) {    };

  ngOnInit() {
    this.SignalService.StartConnection()
      .subscribe(() => {
        console.log('Conexión establecida');
        // Una vez establecida la coneccion registramos los listeners necesarios
        this.SignalService.RightsListener(this.UserLogedId)
          .subscribe((data) => {
            // Aquí se puede manejar la información recibida de la conexión SignalR
            console.log("🚀 ~ file: app.component.ts:23 ~ AppComponent ~ .subscribe ~ RightsListener ~ data:", data);
          });

      }, (error) => {
        console.error(error);
      });
  }

  AddUser()
  {
    this.SignalService.UpdateRights(this.UserLogedId);
  }
}
