import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable } from "angularfire2/database-deprecated";
import { Matchplayers } from "../../models/matchplayers";
import { Subscription } from "rxjs/Subscription";

/**
 * Generated class for the EditMatchplayerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-matchplayer',
  templateUrl: 'edit-matchplayer.html',
})
export class EditMatchplayerPage {

  MatchplayerSubscription: Subscription;
  matchplayersRef$: FirebaseObjectObservable<Matchplayers>;
  matchplayer = {}  as Matchplayers;

  constructor(private afDatabase: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {

  	const matchplayerId = this.navParams.get('matchplayerId');
  	const teamUri = this.navParams.get('teamUri');

  	this.matchplayersRef$ = this.afDatabase.object(`${teamUri}/${matchplayerId}`);
  	this.MatchplayerSubscription = this.matchplayersRef$.subscribe(matchplayers => this.matchplayer = matchplayers);
  	
  }

  editMatchplayer(matchplayer: Matchplayers) {
  	this.matchplayersRef$.update(matchplayer);
  	this.navCtrl.pop();
  }

  ionViewWillLeave() {
  	this.MatchplayerSubscription.unsubscribe();
  }

}
