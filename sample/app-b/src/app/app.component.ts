import { Component } from '@angular/core';
import { RoutedApp } from 'meta-router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private routedApp: RoutedApp) {
    this.initRoutedApp();
  }

  
  initRoutedApp() {
    this.routedApp.config({ appId: 'b' });
    this.routedApp.init();
  }
}
