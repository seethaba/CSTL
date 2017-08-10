import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoggedInHomePage } from './logged-in-home';

@NgModule({
  declarations: [
    LoggedInHomePage,
  ],
  imports: [
    IonicPageModule.forChild(LoggedInHomePage),
  ],
})
export class LoggedInHomePageModule {}
