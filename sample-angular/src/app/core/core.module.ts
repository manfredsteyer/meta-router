import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [ApiService],
  declarations: []
})
export class CoreModule {}
