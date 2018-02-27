import { Component, OnInit, Inject } from '@angular/core';
import { RoutedApp } from 'meta-spa-router';
import { ROUTED_APP } from '../app.tokens';

@Component({
  selector: 'app-a',
  templateUrl: './a.component.html',
  styleUrls: ['./a.component.css']
})
export class AComponent implements OnInit {

  constructor(@Inject(ROUTED_APP) private routedApp: RoutedApp) { 
  }

  ngOnInit() {
  }

  sendNotification(): void {
    this.routedApp.notifyShell('test', { info: 123 });
    this.routedApp.broadcast('test broadcast', { info: 456 });
  }

}
