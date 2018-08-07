import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MenuModule } from 'src/app/menu/menu.module';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MenuModule, CoreModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
