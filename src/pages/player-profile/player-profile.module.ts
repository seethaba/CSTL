import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayerProfilePage } from './player-profile';

@NgModule({
  declarations: [
    PlayerProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(PlayerProfilePage),
  ],
})
export class PlayerProfilePageModule {}
