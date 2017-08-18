import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Team } from "../../models/team";
import { Timeout } from "../../models/timeout";
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';


/**
 * Generated class for the TimeoutsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-timeouts',
  templateUrl: 'timeouts.html',
})
export class TimeoutsPage {

  timeoutsUrl = "";
	team1 = {} as Team;
	team2 = {} as Team;
	currentSet = "";
	timeout1 = {} as Timeout;
	timeout2 = {} as Timeout;
	team1points = 0;
	team2points = 0;

	team1timeoutsRef$: FirebaseListObservable<Timeout[]>;
	team2timeoutsRef$: FirebaseListObservable<Timeout[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	private afDatabase: AngularFireDatabase) {
  	this.timeoutsUrl = this.navParams.get('timeoutsUrl');
  	this.team1 = this.navParams.get('team1');
  	this.team2 = this.navParams.get('team2');
  	this.currentSet = this.navParams.get('currentSet');


  	this.team1timeoutsRef$ = this.afDatabase.list(`${this.timeoutsUrl}/team1/timeouts`);
  	this.team2timeoutsRef$ = this.afDatabase.list(`${this.timeoutsUrl}/team2/timeouts`);

  	this.team1points = this.navParams.get('team1points') || 0;
  	this.team2points = this.navParams.get('team2points') || 0;
  }

  createTimeout(team, timeout: Timeout) {
  	if(team == 'team1') {
  		this.team1timeoutsRef$.push({point: `${this.team1points} - ${this.team2points}`});
  	} else if (team == 'team2') {
  		this.team2timeoutsRef$.push({point: `${this.team2points} - ${this.team1points}`});
  	}
  	this.navCtrl.pop();
  }

}
