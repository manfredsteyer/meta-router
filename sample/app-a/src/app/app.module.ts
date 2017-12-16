import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AComponent } from './a/a.component';
import { BComponent } from './b/b.component';

import { RoutedApp } from 'meta-router';

@NgModule({
  declarations: [
    AppComponent,
    AComponent,
    BComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: 'a', component: AComponent },
      { path: 'b', component: BComponent },
      { path: '**', redirectTo: 'a' }
    ], { useHash: true })
  ],
  providers: [RoutedApp],
  bootstrap: [AppComponent]
})
export class AppModule { }
