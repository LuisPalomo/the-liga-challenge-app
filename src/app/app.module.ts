import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpModule } from '@angular/http';
import { CdkTableModule } from '@angular/cdk';
import { MdTableModule, MdSortModule } from '@angular/material';

import { AppComponent } from './app.component';

import { PlayerService } from './player.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    CdkTableModule,
    MdTableModule,
    MdSortModule
  ],
  providers: [ PlayerService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
