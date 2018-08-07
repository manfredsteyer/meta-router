import { Component, OnInit } from '@angular/core';
import { MetaRouter, MetaRoute } from 'meta-spa-router';
import { environment } from '../environments/environment';
import { Menu } from './menu/models/menu.model';

@Component({
  selector: 'portal-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  router: MetaRouter;
  readonly menues: Menu[] = environment.sites.Children;

  ngOnInit() {
    const states: MetaRoute[] = [
      {
        path: 'Home',
        app: environment.sites.Path,
        outlet: 'outlet'
      },
      ...this.generateStates()
    ];

    this.router = new MetaRouter();
    this.router.config(states);
    this.router.init();
  }

  generateStates(): MetaRoute[] {
    let states: MetaRoute[] = [];

    this.menues.map(menu => {
      if (!menu.Children) {
        const id = menu.Name.replace(/\s/g, '');
        states = [
          ...states,
          {
            path: id,
            app: menu.Path,
            outlet: 'outlet'
          }
        ];
      } else {
        const children = menu.Children;
        children.map(child => {
          const id = menu.Name.replace(/\s/g, '');
          const sid = child.Name.replace(/\s/g, '');
          states = [
            ...states,
            {
              path: `${id}-${sid}`,
              app: child.Path,
              outlet: 'outlet'
            }
          ];
        });
      }
    });

    return states;
  }
}
