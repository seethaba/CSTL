import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import {Match} from '../../models/match';

/**
 * Generated class for the CstlPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cstl',
  templateUrl: 'cstl.html',
})
export class CstlPage {

  adminUser = false;
  currentUserKey = ""
  matchRef$: FirebaseListObservable<Match[]>
  pendingMatchesRef$: FirebaseListObservable<Match[]>
  pageTitle =""


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

        this.pendingMatchesRef$ = this.afDatabase.list(`${this.navParams.get('tournamentName')}/matches`, {
          query: {
            orderByChild: "profileKey",
            equalTo: profileData.$key
          }
        })
      });
    }); 

    this.matchRef$ = this.afDatabase.list(`${this.navParams.get('tournamentName')}/matches`);
    this.pageTitle = this.navParams.get('pageTitle');
  }

  ionViewWillLeave() {
     let options: NativeTransitionOptions = {
      duration: 200
     };

    this.nativePageTransitions.fade(options);
  }

  routeToPage(page) {
    this.navCtrl.push(page, {tournamentName: this.navParams.get('tournamentName')});
  }

  startNewMatch() {
    var matchRef = this.matchRef$.push({"profileKey": this.currentUserKey, 
      "currentSet": "set1", 
      "set1": {"number": 1},
      "status": "Live",
      "dateTime": new Date().toISOString()
    });
    this.navCtrl.push("StartmatchPage", {tournamentName: `${this.navParams.get('tournamentName')}`, matchId: matchRef.key});
  }

  openLiveMatch(pendingMatch: Match) {
    this.navCtrl.push("ScorematchPage", {tournamentName: `${this.navParams.get('tournamentName')}`, currentSetURL: `${this.navParams.get('tournamentName')}/matches/${pendingMatch.$key}/${pendingMatch.currentSet}`, matchURL: `${this.navParams.get('tournamentName')}/matches/${pendingMatch.$key}`});
  }

  getAbbr(name) {
    let output = "";
    
    if(name) {
      let data = name.split(' ');

      for ( var i = 0; i < data.length; i++) {
          output += data[i].substring(0,1);
      }
    }
    
    return output;
  }
}
