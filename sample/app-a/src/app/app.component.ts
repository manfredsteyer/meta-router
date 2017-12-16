import { Router, NavigationEnd } from '@angular/router';
import { Component, Inject } from '@angular/core';
import { filter } from 'rxjs/operators';
import { RoutedApp } from 'meta-spa-router';
import { ROUTED_APP } from './app.tokens';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(
    @Inject(ROUTED_APP) private routedApp: RoutedApp, 
    private router: Router) {
    this.initRoutedApp();
  }
  
  initRoutedApp() {
    
    this.routedApp.config({ appId: 'a' });
    this.routedApp.init();

    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
      this.routedApp.sendRoute(e.url);
    });

    this.routedApp.registerForRouteChange(url => this.router.navigateByUrl(url));
  }

}
