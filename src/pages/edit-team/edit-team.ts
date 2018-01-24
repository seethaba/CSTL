import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable } from "angularfire2/database-deprecated";
import { Team } from "../../models/team";
import { Subscription } from "rxjs/Subscription";

/**
 * Generated class for the EditTeamPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-team',
  templateUrl: 'edit-team.html',
})
export class EditTeamPage {

  teamSubscription: Subscription;
  teamRef$: FirebaseObjectObservable<Team>;
  team = {}  as Team;

  constructor(private afDatabase: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {

  	const teamId = this.navParams.get('teamId');

  	this.teamRef$ = this.afDatabase.object(`${this.navParams.get('tournamentName')}/team/${teamId}`)
  	this.teamSubscription = this.teamRef$.subscribe(team => this.team = team);
  }

  editTeam(team: Team) {
  	this.teamRef$.update(team);
  	this.navCtrl.pop();
  }

  ionViewWillLeave() {
  	this.teamSubscription.unsubscribe();
  }

}
