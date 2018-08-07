import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuTopComponent } from './menu-top/menu-top.component';
import { Trim } from './pipes/trim.pipe';
import { MenuService } from './menu.service';

@NgModule({
  imports: [CommonModule],
  declarations: [MenuTopComponent, Trim],
  exports: [MenuTopComponent],
  providers: [MenuService]
})
export class MenuModule {}
