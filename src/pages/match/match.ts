import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Match } from "../../models/match";

/**
 * Generated class for the MatchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-match',
  templateUrl: 'match.html'
})
export class MatchPage {

  matchesRef$: FirebaseListObservable<Match[]>

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private nativePageTransitions: NativePageTransitions,
    private afDatabase: AngularFireDatabase) {

    this.matchesRef$ = this.afDatabase.list(`${this.navParams.get('tournamentName')}/matches`, {
      query: {
        orderByChild: `orderKey`
      }
    });
  }

  ionViewWillLeave() {
     let options: NativeTransitionOptions = {
      duration: 200
     };

    this.nativePageTransitions.fade(options);
  }

  getAbbr(name) {
    let data = name.split(' '), output = "";

    for ( var i = 0; i < data.length; i++) {
        output += data[i].substring(0,1);
    }

    return output;
  }


  routeToScorematchPage(match, page) {
    this.navCtrl.push(page, {tournamentName: this.navParams.get('tournamentName'), matchURL: `${this.navParams.get('tournamentName')}/matches/${match.$key}`, 'src': 'fromMatches'});
  }
}
