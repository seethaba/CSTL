import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseplayersPage } from './chooseplayers';

@NgModule({
  declarations: [
    ChooseplayersPage,
  ],
  imports: [
    IonicPageModule.forChild(ChooseplayersPage),
  ],
})
export class ChooseplayersPageModule {}
