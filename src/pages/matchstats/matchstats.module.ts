import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatchstatsPage } from './matchstats';

@NgModule({
  declarations: [
    MatchstatsPage,
  ],
  imports: [
    IonicPageModule.forChild(MatchstatsPage),
  ],
})
export class MatchstatsPageModule {}
