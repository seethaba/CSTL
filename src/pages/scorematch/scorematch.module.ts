import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScorematchPage } from './scorematch';

@NgModule({
  declarations: [
    ScorematchPage,
  ],
  imports: [
    IonicPageModule.forChild(ScorematchPage),
  ],
})
export class ScorematchPageModule {}
