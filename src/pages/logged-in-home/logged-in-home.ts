import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
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
  currentUserKey = ""
  matchRef$: FirebaseListObservable<Match[]>
  pendingMatchesRef$: FirebaseListObservable<Match[]>


  constructor(private afDatabase: AngularFireDatabase, 
    private afAuth: AngularFireAuth,
  	public navCtrl: NavController,
    public alert: AlertController, 
    public navParams: NavParams,
    private nativePageTransitions: NativePageTransitions) {
    
    this.afAuth.authState.take(1).subscribe(data => {
      this.afDatabase.object(`profile/${data.uid}`).take(1).subscribe(profileData => {
        this.adminUser = profileData.admin;
        this.currentUserKey = profileData.$key;

        this.pendingMatchesRef$ = this.afDatabase.list('matches', {
          query: {
            orderByChild: "profileKey",
            equalTo: profileData.$key
          }
        })
      });
    }); 

    this.matchRef$ = this.afDatabase.list('matches');
  }

  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(data => {
    	if(data)
    	{
        // Do Nothing
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
    var matchRef = this.matchRef$.push({"profileKey": this.currentUserKey, 
      "currentSet": "set1", 
      "set1": {"number": 1},
      "status": "Live",
      "dateTime": new Date().toISOString()
    });
    this.navCtrl.push("StartmatchPage", {matchId: matchRef.key});  
  }

  openLiveMatch(pendingMatch: Match) {
    this.navCtrl.push("ScorematchPage", {currentSetURL: `matches/${pendingMatch.$key}/${pendingMatch.currentSet}`, matchURL: `matches/${pendingMatch.$key}`});
  }
}
