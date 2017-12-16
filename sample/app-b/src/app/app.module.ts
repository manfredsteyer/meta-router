import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RoutedApp } from 'meta-router';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [RoutedApp],
  bootstrap: [AppComponent]
})
export class AppModule { }
