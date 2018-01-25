import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
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
  matchesRef$: FirebaseListObservable<Match[]>;
  MatchSubscription: Subscription;
  profile = {} as Profile;
  match = {} as Match;
  pool = [];
  events = [];
  tossChoices = [];
  matchId = "";
  reguNumbers = [];

  constructor(private afDatabase: AngularFireDatabase,
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private geoLocation: Geolocation,
    private http: Http,
    public viewCtrl: ViewController
  ) {

    this.matchId = this.navParams.get('matchId');
  	this.TeamRef$ = this.afDatabase.list(`${this.navParams.get('tournamentName')}/team`); 
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
		this.events = ["Regu", "Doubles", "Team"];
    this.tossChoices = ["Side", "Service"];
    this.reguNumbers = [1,2,3];
    
    this.matchRef$ = this.afDatabase.object(`${this.navParams.get('tournamentName')}/matches/${this.matchId}`);
    this.MatchSubscription = this.matchRef$.subscribe(match => {
      this.match = match
      this.match.orderKey = match.$key;
    });
  }

  startMatch(match) {
    this.matchRef$.update(match);
    
    this.afDatabase.object(`${this.navParams.get('tournamentName')}/team/${match.team1Key}`).subscribe(team1 => {
      this.matchRef$.update({"team1Name": team1.name});
    })
    this.afDatabase.object(`${this.navParams.get('tournamentName')}/team/${match.team2Key}`).subscribe(team2 => {
      this.matchRef$.update({"team2Name": team2.name});
    })

    this.navCtrl.push("ScorematchPage", {tournamentName: this.navParams.get('tournamentName'), currentSetURL: `${this.navParams.get('tournamentName')}/matches/${match.$key}/set1`, matchURL: `${this.navParams.get('tournamentName')}/matches/${match.$key}`}).then(() => {
      // first we find the index of the current view controller:
      const index = this.viewCtrl.index;
      // then we remove it from the navigation stack
      this.navCtrl.remove(index);
    });;
  }

  ionViewWillLeave() {
    this.MatchSubscription.unsubscribe();
  }

  changeTeam(team, teamKey, teamName, event) {
  	this.navCtrl.push('ChooseplayersPage', {tournamentName: this.navParams.get('tournamentName'), teamUri: `${this.navParams.get('tournamentName')}/matches/${this.matchId}/${team}`, teamKey: teamKey, teamName: teamName, eventType: event});
  }

  setOrderKey(reguNum) {
    if(reguNum == 1) {
      this.match.orderKey = `${this.match.$key}_2`;
    }

    if(reguNum != 1) {
      this.afDatabase.list(`${this.navParams.get('tournamentName')}/matches`,  {
        query: {
          orderByChild: `matchType`,
          equalTo: 'Team'
        }
      }).subscribe(matches => {
        for(let a of matches) {
          
          let matchTeams = [this.match.team1Key, this.match.team2Key]
          let arrTeams = [a.team1Key, a.team2Key]

          if(matchTeams.sort().join(',') === arrTeams.sort().join(',') && a.pool == this.match.pool && a.reguNumber == "1") {
            this.match.orderKey = `${a.$key}_${3%Number(reguNum)}`
            break;
          }
        };
      })
    }
  }

}
