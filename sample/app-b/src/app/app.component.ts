import { Component } from '@angular/core';
import { RoutedApp } from 'meta-spa-router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  
  // Do make this work with DI, define a InjectionToken
  // and bind it to a factory that creates an instance
  // of this.
  private routedApp: RoutedApp = new RoutedApp();

  constructor() {
    this.initRoutedApp();
  }

  
  initRoutedApp() {
    this.routedApp.config({ appId: 'b' });
    this.routedApp.init();
  }
}
