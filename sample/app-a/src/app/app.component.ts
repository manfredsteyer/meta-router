import { Router, NavigationEnd } from '@angular/router';
import { Component } from '@angular/core';
import { filter } from 'rxjs/operators';
import { RoutedApp } from 'meta-router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private router: Router, private routedApp: RoutedApp) {
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
