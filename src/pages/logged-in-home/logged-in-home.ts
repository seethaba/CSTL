import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import {Match} from '../../models/match';

/**
 * Generated class for the LoggedInHomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-logged-in-home',
  templateUrl: 'logged-in-home.html',
})
export class LoggedInHomePage {

  adminUser = false;
  matchRef$: FirebaseListObservable<Match[]>

  constructor(private afDatabase: AngularFireDatabase, 
    private afAuth: AngularFireAuth, 
    private toast: ToastController,
  	public navCtrl: NavController, 
    public navParams: NavParams,
    private nativePageTransitions: NativePageTransitions) {
    
    this.afAuth.authState.take(1).subscribe(data => {
      this.afDatabase.object(`profile/${data.uid}`).take(1).subscribe(profileData => {
        this.adminUser = profileData.admin;
      });
    }); 

    this.matchRef$ = this.afDatabase.list('matches');
  }

  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(data => {
    	if(data)
    	{
        this.toast.create({
	    		message: `${data.email}, Welcome to CSTL app`,
	    		duration: 3000,
	    		cssClass: "toast-success"
	    	}).present();	
    	}
    	else {
	    	this.navCtrl.push('LoginPage');
    	}
    	
    })
  }

  ionViewWillLeave() {
     let options: NativeTransitionOptions = {
      duration: 500
     };

    this.nativePageTransitions.flip(options);
  }

  logout() {
    this.afAuth.auth.signOut();
    this.navCtrl.setRoot("LoginPage");  
  }

  routeToPage(page) {
    this.navCtrl.push(page);
  }

  startNewMatch() {
    var matchRef = this.matchRef$.push({"matchCreated": 1});
    this.navCtrl.push("StartmatchPage", {matchId: matchRef.key});
  }
}
