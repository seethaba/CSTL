import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Profile } from "../../models/profile";
import { Team } from "../../models/team";
import { Match } from "../../models/match";
import { Setpoints } from "../../models/setpoints";

/**
 * Generated class for the MatchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-match',
  templateUrl: 'match.html',
})
export class MatchPage {

  matchesRef$: FirebaseListObservable<Match[]>
  matchRef$: FirebaseObjectObservable<Match>

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private nativePageTransitions: NativePageTransitions,
    private afDatabase: AngularFireDatabase) {

    this.matchesRef$ = this.afDatabase.list('matches');
  }

  ionViewWillLeave() {
     let options: NativeTransitionOptions = {
      duration: 500
     };

    this.nativePageTransitions.flip(options);
  }

  routeToScorematchPage(match) {
    this.navCtrl.push("ScorematchPage", {currentSetURL: `matches/${match.$key}/set1`, matchURL: `matches/${match.$key}`, 'src': 'fromMatches'});
  }
}
