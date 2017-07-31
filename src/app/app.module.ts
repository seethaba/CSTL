import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import {AngularFireModule} from 'angularfire2';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp({
    apiKey: "AIzaSyAxTSgy4aFwWMe_6x6y1IMFD_qESSGEcYM",
    authDomain: "sportivation-12308.firebaseapp.com",
    databaseURL: "https://sportivation-12308.firebaseio.com",
    projectId: "sportivation-12308",
    storageBucket: "sportivation-12308.appspot.com",
    messagingSenderId: "543075299402"
  })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
