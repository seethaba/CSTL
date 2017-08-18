import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Profile } from "../../models/profile";
import { Team } from "../../models/team";
import { Match } from "../../models/match";
import { Geolocation } from '@ionic-native/geolocation';
import {Http} from '@angular/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Subscription } from "rxjs/Subscription";

/**
 * Generated class for the StartmatchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-startmatch',
  templateUrl: 'startmatch.html',
})
export class StartmatchPage {

  TeamRef$: FirebaseListObservable<Team[]>;
  profileRef$: FirebaseListObservable<Profile[]>;
  matchRef$: FirebaseObjectObservable<Match>;
  MatchSubscription: Subscription;
  profile = {} as Profile;
  match = {} as Match;
  pool = [];
  events = [];
  tossChoices = [];
  matchId = "";

  constructor(private afDatabase: AngularFireDatabase,
    private afAuth: AngularFireAuth, 
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private geoLocation: Geolocation,
  	private http: Http,
  	private modal: ModalController) {

    this.matchId = this.navParams.get('matchId');
  	this.TeamRef$ = this.afDatabase.list('team'); 
  	this.geoLocation.getCurrentPosition().then((resp) => {
	    var lat=resp.coords.latitude;
	    var long=resp.coords.longitude;
	   	this.http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long+'&sensor=true').map(res=>res.json()).subscribe(data => {
	        var address = data.results[0];
	        this.match.location = address.formatted_address;
	       });
		}).catch((error) => {
		  this.match.location = "NICM, Chennai";
		});
		this.pool = ["League (Pool A)", "League (Pool B)", "Quarter-Final", "Semi-Final", "Hardline", "Final", "Plate-Semi-Final", "Plate-Hardline", "Plate-Final"];
		this.events = ["Regu", "Doubles"];
		this.tossChoices = ["Side", "Service"];
		

    this.matchRef$ = this.afDatabase.object(`matches/${this.matchId}`);
    this.MatchSubscription = this.matchRef$.subscribe(match => this.match = match);
  }

  startMatch(match) {
    this.matchRef$.update(match);
    
    this.afDatabase.object(`team/${match.team1Key}`).subscribe(team1 => {
      this.matchRef$.update({"team1Name": team1.name});
    })
    this.afDatabase.object(`team/${match.team2Key}`).subscribe(team2 => {
      this.matchRef$.update({"team2Name": team2.name});
    })

    this.navCtrl.push("ScorematchPage", {currentSetURL: `matches/${match.$key}/set1`, matchURL: `matches/${match.$key}`});
  }

  ionViewWillLeave() {
    this.MatchSubscription.unsubscribe();
  }

  changeTeam(team, teamKey, teamName, event) {
  	this.navCtrl.push('ChooseplayersPage', {teamUri: `matches/${this.matchId}/${team}`, teamKey: teamKey, teamName: teamName, eventType: event});
  }

}
