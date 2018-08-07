import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services';
import { Authorization, Privileges } from './models/authorization.model';
import { Menu } from 'src/app/menu/models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private apiService: ApiService) {}

  mergePermitsMenu(privileges: Privileges[], menu: Menu[]): Menu[] {
    const filter = this.filterMenu(this.filterParents.bind(this), this.filterChildren.bind(this));
    return filter(privileges, menu);
  }

  filterMenu = (p, c) => (priv, menu) => c(priv, p(priv, menu));

  getPermits(): Observable<Authorization> {
    return this.apiService.get().pipe(map(data => data));
  }

  findPrivilege(privileges: Privileges[], menuPrivilege: string): boolean {
    if (!privileges) {
      return false;
    }
    return privileges.find(privilege => privilege.Name === menuPrivilege) ? true : false;
  }

  filterParents(privileges: Privileges[], menu: Menu[]): Menu[] {
    return menu.filter(item => {
      return (
        this.findPrivilege(privileges, item.RequiredPrivilege) ||
        (item.Children
          ? item.Children.find(child => this.findPrivilege(privileges, child.RequiredPrivilege))
          : false)
      );
    });
  }

  filterChildren(privileges: Privileges[], menu: Menu[]) {
    return menu.map(item => {
      item.Children = item.Children
        ? item.Children.filter(child => this.findPrivilege(privileges, child.RequiredPrivilege))
        : null;
      return item;
    });
  }
}
