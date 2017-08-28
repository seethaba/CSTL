import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule} from 'angularfire2';
import { AngularFireAuthModule} from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { Facebook } from '@ionic-native/facebook';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import firebase from 'firebase';
import { MyApp } from './app.component';
import { TeamlistPage } from "../pages/teamlist/teamlist";
import { AddTeamPage } from "../pages/add-team/add-team";
import { EditTeamPage } from "../pages/edit-team/edit-team";
import { ShowprofilePage } from "../pages/showprofile/showprofile";
import { NewsPage } from "../pages/news/news";
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpModule} from '@angular/http';
import { RemoteServiceProvider } from '../providers/remote-service/remote-service';


const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '98729c12'
  }
};

firebase.initializeApp({
    apiKey: "AIzaSyAxTSgy4aFwWMe_6x6y1IMFD_qESSGEcYM",
    authDomain: "sportivation-12308.firebaseapp.com",
    databaseURL: "https://sportivation-12308.firebaseio.com",
    projectId: "sportivation-12308",
    storageBucket: "sportivation-12308.appspot.com",
    messagingSenderId: "543075299402"
});

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
    }),
    AngularFireModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    CloudModule.forRoot(cloudSettings),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook,
    InAppBrowser,
    Geolocation,
    NativePageTransitions,
    RemoteServiceProvider
  ]
})
export class AppModule {}
