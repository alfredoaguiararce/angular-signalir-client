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
  
  constructor(private SignalService: SignalService) {    };

  ngOnInit() {
    this.SignalService.StartConnection()
      .subscribe(() => {
        console.log('Conexión establecida');
        this.SignalService.AddNewUserListener()
          .subscribe((data) => {
            this.ChangedText = data;
            console.log("🚀 ~ file: app.component.ts:20 ~ AppComponent ~ .subscribe ~ data:", data)
            // Aquí se puede manejar la información recibida de la conexión SignalR
          });

      }, (error) => {
        console.error(error);
      });
  }

  AddUser()
  {
    this.SignalService.InvokeJoinGroup("110", "ALFREDO SISTEMA");
  }
}
