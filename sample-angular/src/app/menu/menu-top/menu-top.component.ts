import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Menu } from 'src/app/menu/models/menu.model';
import { MetaRouter } from 'meta-spa-router';
import { MenuService } from 'src/app/menu/menu.service';

const DEFAULT_MENU = 'Home';
const BTN_DRAWER_CLS = 'mdl-layout__drawer-button';

@Component({
  selector: 'portal-menu-top',
  templateUrl: './menu-top.component.html',
  styleUrls: ['./menu-top.component.scss']
})
export class MenuTopComponent implements OnInit {
  @Input() router: MetaRouter;
  menues: Menu[] = [];
  isSplitted: boolean = false;
  selected: string = DEFAULT_MENU;
  subSelected: string;
  subItemSelected: string;
  userName: string;

  readonly version: string = environment.version;

  constructor(private elem: ElementRef, private menuService: MenuService) {
    const home = {
      Name: 'Home',
      Icon: 'fa-book',
      Path: DEFAULT_MENU
    };

    if (environment.auth === true) {
      this.menuService.getPermits().subscribe(auth => {
        this.userName = auth.User.Name;
        this.menues = [
          home,
          ...this.menuService.mergePermitsMenu(auth.Privileges, environment.sites.Children)
        ];
      });
    } else {
      this.menues = [home, ...environment.sites.Children];
    }
  }

  ngOnInit() {
    const url = this.extractName(window.location.href);
    this.selected = url.split('-')[0];
    this.subItemSelected = this.getSubUrl(url);
  }

  getSubUrl(url: string): string {
    return url.split('-').length > 1 ? url.trim() : '';
  }

  splitIt(menu: Menu, child: Menu) {
    this.cleanIframes();
    const query = this.getQuery();
    const splittedQuery = this.getSplittedQuery(menu, child);
    const active = this.selectDomItem(query);
    this.router.go(splittedQuery);
    const splitItem = this.selectDomItem(splittedQuery);
    this.activeIframe(active, splitItem);
    this.close();
  }

  onClickMenu(menu: Menu = null, child: Menu = null) {
    this.cleanIframes();
    if (menu) {
      this.selected = menu.Name;
      if (!menu.Children) {
        this.subItemSelected = '';
      }
    } else {
      this.selected = DEFAULT_MENU;
    }
    if (child) {
      this.subItemSelected = this.generateChildKey(menu, child);
    }
    this.selected = this.cleanSpaces(this.selected);
    this.resetSubSelect();
    this.close();
  }

  onSelectSubMenu(menu: Menu = null) {
    if (menu) {
      this.subSelected = this.subSelected === menu.Name ? '' : menu.Name;
    } else {
      this.resetSubSelect();
    }
  }

  resetSubSelect() {
    this.subSelected = '';
  }

  close() {
    let button = <HTMLElement>this.elem.nativeElement.querySelectorAll(`.${BTN_DRAWER_CLS}`);
    button && button[0].click();
  }

  cleanIframes() {
    const iframes = this.elem.nativeElement.querySelectorAll(`iframe`);
    for (const iframe of iframes) {
      iframe.classList.remove('splitted-left');
      iframe.classList.remove('splitted-right');
    }
    this.isSplitted = false;
  }

  defautltIframes() {
    const iframeRight = this.elem.nativeElement.querySelectorAll(`.splitted-right`)[0];
    const iframeLeft = this.elem.nativeElement.querySelectorAll(`.splitted-left`)[0];
    iframeRight.classList.remove('splitted-right');
    iframeRight.style.display = 'none';
    iframeLeft.style.display = 'block';
    iframeLeft.classList.remove('splitted-left');
    this.isSplitted = false;
  }

  extractName(url) {
    const rx = /.*#(.*){1}/g;
    const arr = rx.exec(url);
    if (!arr) {
      return null;
    }
    return arr.length > 0 ? arr[1] : null;
  }

  selectDomItem(query): HTMLElement {
    return <HTMLElement>this.elem.nativeElement.querySelectorAll(`#${query}`)[0];
  }

  activeIframe(active, splitItem) {
    if (active.id !== splitItem.id) {
      this.isSplitted = true;
      active.classList.add('splitted-left');
      splitItem.classList.add('splitted-right');
    } else {
      this.isSplitted = false;
    }
  }

  getQuery(): string {
    if (this.subItemSelected) {
      return this.subItemSelected;
    } else {
      return this.selected;
    }
  }

  getSplittedQuery(menu: Menu, child: Menu): string {
    return this.generateChildKey(menu, child);
  }

  generateChildKey(menu: Menu, child: Menu): string {
    return this.cleanSpaces(menu.Name) + '-' + this.cleanSpaces(child.Name);
  }
  cleanSpaces(element: string): string {
    return element.replace(/\s/g, '');
  }
}
