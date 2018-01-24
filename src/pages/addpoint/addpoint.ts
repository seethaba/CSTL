import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Setpoints } from "../../models/setpoints";
import { Profile } from "../../models/profile";
import { Subscription } from "rxjs/Subscription";

/**
 * Generated class for the AddpointPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addpoint',
  templateUrl: 'addpoint.html',
})
export class AddpointPage {

  setpointsRef$: FirebaseListObservable<Setpoints[]>;
  winningProfileRef$: FirebaseListObservable<Profile[]>;
  losingProfileRef$: FirebaseListObservable<Profile[]>;

  setpoint = {} as Setpoints;
  teamName = "";
  logoUrl = "";
  matchUrl = "";

  wonMethod = ["Strike", "Service", "Drop", "Placement", "Block", "Opponent Error", "Other"]
  errorMethod = ["Strike Error", "Service Error", "Drop Error", "Placement Error", "Receiving Error", "Net Cross/ Touch", "Foot Fault", "Others"]

  constructor(public navCtrl: NavController, 
  	public navParams: NavParams,
  	private afDatabase: AngularFireDatabase) {

  	this.logoUrl = this.navParams.get('teamLogoUrl');
  	this.teamName = this.navParams.get('teamName');
  	this.matchUrl = this.navParams.get('matchURL');

  	// Get Team Names
  	this.winningProfileRef$ = this.afDatabase.list('profile', {
  	  query: {
				orderByChild: `${this.navParams.get('tournamentName')}`,
  	    equalTo: this.navParams.get('winningTeamKey')
  	  }
  	})

  	// Get Opponent Names
  	this.losingProfileRef$ = this.afDatabase.list('profile', {
  	  query: {
				orderByChild: `${this.navParams.get('tournamentName')}`,
  	    equalTo: this.navParams.get('losingTeamKey')
  	  }
  	})

  	// Add Point URL
  	this.setpointsRef$ = this.afDatabase.list(`${this.navParams.get('addPointURL')}`);
  }

  createPoint(setpoint: Setpoints) {
    this.setpointsRef$.push(this.setpoint);
    this.navCtrl.pop();
	}
	
	resetPoint(setpoint: Setpoints) {
		this.setpoint.wonMethod = null;
		this.setpoint.wonBy = null;
		this.setpoint.assistBy = null;
		this.setpoint.errorMethod = null;
		this.setpoint.errorBy = null;
  }

}
