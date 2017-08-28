import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Team } from "../../models/team";
import { Profile } from "../../models/profile";
import { Substitution } from "../../models/substitution";
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';


/**
 * Generated class for the SubstitutionsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-substitutions',
  templateUrl: 'substitutions.html',
})
export class SubstitutionsPage {

	subsUrl = "";
	team1 = {} as Team;
	team2 = {} as Team;
	currentSet = "";
	substitution1 = {} as Substitution;
	substitution2 = {} as Substitution;
	team1points = 0;
	team2points = 0;

	team1ProfileRef$: FirebaseListObservable<Profile[]>;
	team2ProfileRef$: FirebaseListObservable<Profile[]>;
	team1subsRef$: FirebaseListObservable<Substitution[]>;
	team2subsRef$: FirebaseListObservable<Substitution[]>;

  constructor(public navCtrl: NavController, 
  	public navParams: NavParams,
  	private afDatabase: AngularFireDatabase) {
  	this.subsUrl = this.navParams.get('subsUrl');
  	this.team1 = this.navParams.get('team1');
  	this.team2 = this.navParams.get('team2');
  	this.currentSet = this.navParams.get('currentSet');

  	// Get Team Names
  	this.team1ProfileRef$ = this.afDatabase.list('profile', {
  	  query: {
  	    orderByChild: "teamKey",
  	    equalTo: this.team1.$key
  	  }
  	})

  	// Get Opponent Names
  	this.team2ProfileRef$ = this.afDatabase.list('profile', {
  	  query: {
  	    orderByChild: "teamKey",
  	    equalTo: this.team2.$key
  	  }
  	})

  	this.team1subsRef$ = this.afDatabase.list(`${this.subsUrl}/team1/subs`);
  	this.team2subsRef$ = this.afDatabase.list(`${this.subsUrl}/team2/subs`);

  	this.team1points = this.navParams.get('team1points') || 0;
  	this.team2points = this.navParams.get('team2points') || 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubstitutionsPage');
  }

  createSub(team, substitution: Substitution) {
  	if(team == 'team1') {
  		this.team1subsRef$.push({point: `${this.team1points} - ${this.team2points}`,
  		playerOut: this.substitution1.playerOut,
  		playerIn: this.substitution1.playerIn});
  	} else if (team == 'team2') {
  		this.team2subsRef$.push({point: `${this.team2points} - ${this.team1points}`,
  		playerOut: this.substitution2.playerOut,
  		playerIn: this.substitution2.playerIn});
  	}
  	this.navCtrl.pop();
  }

}
