import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddpointPage } from './addpoint';

@NgModule({
  declarations: [
    AddpointPage,
  ],
  imports: [
    IonicPageModule.forChild(AddpointPage),
  ],
})
export class AddpointPageModule {}
