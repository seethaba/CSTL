import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Profile } from "../../models/profile";
import { Team } from "../../models/team";
import { Match } from "../../models/match";
import { Geolocation } from '@ionic-native/geolocation';
import {Http} from '@angular/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

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

  TeamRef$: FirebaseListObservable<Team[]>
  profileRef$: FirebaseListObservable<Profile[]>
  profile = {} as Profile;
  match = {} as Match;
  pool = [];
  events = [];
  tossChoices = [];
  matchId = "";

  constructor(private afDatabase: AngularFireDatabase, 
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
		this.pool = ["League (Pool A)", "League (Pool B)", "Quarter-Final", "Semi-Final", "Hardline (3rd - 4th Pos)", "Final (1st - 2nd Pos)", "Plate-Semi-Final", "Plate-Hardline (7th - 8th Pos)", "Plate-Final (5th - 6th Pos)"];
		this.events = ["Regu", "Doubles"];
		this.tossChoices = ["side", "service"];
		this.match.status = "Live";
		this.match.dateTime = new Date().toISOString();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartmatchPage');
  }

  startMatch() {

  }

  changeTeam(team, teamKey, teamName) {
  	this.navCtrl.push('ChooseplayersPage', {teamUri: `matches/${this.matchId}/${team}`, teamKey: teamKey, teamName: teamName});
  }

}
