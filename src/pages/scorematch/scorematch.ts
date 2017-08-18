import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Profile } from "../../models/profile";
import { Team } from "../../models/team";
import { Match } from "../../models/match";
import { Setpoints } from "../../models/setpoints";
import { Subscription } from "rxjs/Subscription";

/**
 * Generated class for the ScorematchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scorematch',
  templateUrl: 'scorematch.html',
})
export class ScorematchPage {

  //Match Variables
  matchUrl = "";
  matchRef$: FirebaseObjectObservable<Match>;
  match = {} as Match;
  matchSubscription: Subscription;
  srcparam = "";
  
  // Team Variables
  team1Ref$: FirebaseObjectObservable<Team>;
  team2Ref$: FirebaseObjectObservable<Team>;
  team1 = {} as Team;
  team2 = {} as Team;
  team1Subscription: Subscription;
  team2Subscription: Subscription;
  abbrTeam1 = "";
  abbrTeam2 = "";
  abbrToss = ""
  upprTeam1 = "";
  upprTeam2 = "";

  // Set Points Data
  team1set1pointsRef$: FirebaseListObservable<Setpoints[]>;
  team1set2pointsRef$: FirebaseListObservable<Setpoints[]>;
  team1set3pointsRef$: FirebaseListObservable<Setpoints[]>;
  team2set1pointsRef$: FirebaseListObservable<Setpoints[]>;
  team2set2pointsRef$: FirebaseListObservable<Setpoints[]>;
  team2set3pointsRef$: FirebaseListObservable<Setpoints[]>;
  team1set1points = 0;
  team1set2points = 0;
  team1set3points = 0;
  team2set1points = 0;
  team2set2points = 0;
  team2set3points = 0;

  constructor(private afDatabase: AngularFireDatabase, 
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    private alertCtrl: AlertController) {

  	this.matchUrl = this.navParams.get('matchURL');
  	this.matchRef$ = this.afDatabase.object(this.matchUrl);
    this.srcparam = this.navParams.get('src');
    
    this.matchSubscription = this.matchRef$.take(1).subscribe(match => {
    	this.match = match;
      if(match.toss) {
        this.abbrToss = this.getAbbr(match.toss);
      }

    	this.team1Ref$ = this.afDatabase.object(`team/${match.team1Key}`);
    	this.team2Ref$ = this.afDatabase.object(`team/${match.team2Key}`);

    	this.team1Subscription = this.team1Ref$.subscribe(team1 => {
    		this.team1 = team1;
        if(team1.name){
          this.abbrTeam1 = this.getAbbr(team1.name);  
          this.upprTeam1 = team1.name.toUpperCase();  
        }
    	});
    	this.team2Subscription = this.team2Ref$.subscribe(team2 => {
    		this.team2 = team2
        if (team2.name) {
          this.abbrTeam2 = this.getAbbr(team2.name);
          this.upprTeam2 = team2.name.toUpperCase();  
        }
    	});

    });

    this.team1set1pointsRef$ = this.afDatabase.list(`${this.matchUrl}/set1/team1/points`);
    this.team1set2pointsRef$ = this.afDatabase.list(`${this.matchUrl}/set2/team1/points`);
    this.team1set3pointsRef$ = this.afDatabase.list(`${this.matchUrl}/set3/team1/points`);

    this.team2set1pointsRef$ = this.afDatabase.list(`${this.matchUrl}/set1/team2/points`);
    this.team2set2pointsRef$ = this.afDatabase.list(`${this.matchUrl}/set2/team2/points`);
    this.team2set3pointsRef$ = this.afDatabase.list(`${this.matchUrl}/set3/team2/points`);

    this.team1set1pointsRef$.subscribe(setpoints => {
      this.team1set1points = setpoints.map(function(a) {return 1}).length;
    })

    this.team1set2pointsRef$.subscribe(setpoints => {
      this.team1set2points = setpoints.map(function(a) {return 1}).length;
    })

    this.team1set3pointsRef$.subscribe(setpoints => {
      this.team1set3points = setpoints.map(function(a) {return 1}).length;
    })

    this.team2set1pointsRef$.subscribe(setpoints => {
      this.team2set1points = setpoints.map(function(a) {return 1}).length;
    })

    this.team2set2pointsRef$.subscribe(setpoints => {
      this.team2set2points = setpoints.map(function(a) {return 1}).length;
    })

    this.team2set3pointsRef$.subscribe(setpoints => {
      this.team2set3points = setpoints.map(function(a) {return 1}).length;
    })
  }

  ionViewWillLeave() {
    this.matchSubscription.unsubscribe();
    this.team1Subscription.unsubscribe();
    this.team2Subscription.unsubscribe();
  }

  getAbbr(name) {
    let data = name.split(' '), output = "";

	for ( var i = 0; i < data.length; i++) {
    	output += data[i].substring(0,1);
	}

	return output;
  }

  addPoint(winningteam, losingteam) {

    let winningTeamData = (winningteam == "t1" ? this.team1 : this.team2)
    let losingTeamData = (winningteam == "t1" ? this.team2 : this.team1)

    this.navCtrl.push("AddpointPage", {
      'addPointURL': `${this.matchUrl}/${this.match.currentSet}/${winningteam == "t1" ? "team1" : "team2"}/points`,
      'matchURL': `${this.matchUrl}/${this.match.currentSet}`,
      'teamLogoUrl': winningTeamData.logoUrl,
      'teamName': winningTeamData.name,
      'winningTeamKey': winningTeamData.$key,
      'losingTeamKey': losingTeamData.$key
    });
  }

  isSetCompleted(currentSet) {
    switch(currentSet) {
      case "set1":
          return this.isSetWon(this.team1set1points, this.team2set1points);
      case "set2":
          return this.isSetWon(this.team1set2points, this.team2set2points);
      case "set3":
          return this.isSetWon(this.team1set3points, this.team2set3points);
      default:
          return false;
    }
  }

  getPointsByTeamSet(team, currentSet) {
    switch(currentSet) {
      case "set1":
          return (team == 'team1') ? this.team1set1points : this.team2set1points;
      case "set2":
          return (team == 'team1') ? this.team1set2points : this.team2set2points;
      case "set3":
          return (team == 'team1') ? this.team1set3points : this.team2set3points;
      default:
          return false;
    }
  }

  setWonBy(currentSet) {
    switch(currentSet) {
      case "set1":
          return this.team1set1points > this.team2set1points ? "team1" : "team2";
      case "set2":
          return this.team1set2points > this.team2set2points ? "team1" : "team2";
      case "set3":
          return this.team1set3points > this.team2set3points ? "team1" : "team2";
      default:
          return "";
    }
  }

  matchWonBy() {
    let team1Count = 0, team2Count = 0;
    (this.setWonBy("set1") == 'team1') ? team1Count++ : team2Count++;
    (this.setWonBy("set2") == 'team1') ? team1Count++ : team2Count++;
    (this.setWonBy("set3") == 'team1') ? team1Count++ : team2Count++;

    return ((team1Count > team2Count) ? this.team1.name : this.team2.name)
  }


  isMatchCompleted(currentSet) {
    switch(currentSet) {
      case "set2":
          return this.isSetCompleted(currentSet) && (this.setWonBy("set1") == this.setWonBy("set2"))
      case "set3":
          return this.isSetCompleted(currentSet)
      default:
          return false;
    }
  }

  completeSet(currentSet) {
    switch(currentSet) {
      case "set1":
          this.alertSetCompletion("set1", {"currentSet": "set2", "set2": {"number": 2}});
          break;
      case "set2":
          if(this.isMatchCompleted(currentSet)) {
            this.completeMatch();
          } else {
            this.alertSetCompletion("set2", {"currentSet": "set3", "set3": {"number": 3}});  
          }
          break;
      case "set3":
          this.completeMatch();
          break;
      default:
          return false;
    }
  }

  alertSetCompletion(currentSet, updateOptions) {
    let confirm = this.alertCtrl.create({
      title: 'Set Completed',
      message: `The Set was won by ${(this.setWonBy(currentSet) == 'team1') ? this.team1.name : this.team2.name }`,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.matchRef$.update(updateOptions);
            this.matchRef$.subscribe(match => {
              this.match = match;
            })
          }
        }
      ]
    });
    confirm.present();
  }

  completeMatch() {
    this.matchRef$.update({"profileKey": null, "status": "completed"});
    let confirm = this.alertCtrl.create({
      title: 'Match Completed',
      message: `The Match was won by ${this.matchWonBy()}`,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.setRoot('LoggedInHomePage');
          }
        }
      ]
    });
    confirm.present();
  }

  isSetWon(team1points, team2points) {
    return ((team1points >= 21 && (team1points - team2points) >=2) || 
      (team2points >= 21 && (team2points - team1points) >=2) ||
      (team1points == 25) || (team2points == 25));
  }

  routeToSubsPage() {
    let team1points = this.getPointsByTeamSet('team1', this.match.currentSet)
    let team2points = this.getPointsByTeamSet('team2', this.match.currentSet)
    this.navCtrl.push("SubstitutionsPage", {
      "subsUrl": `${this.matchUrl}/${this.match.currentSet}`, 
      'team1': this.team1, 
      'team2': this.team2, 
      'currentSet': this.match.currentSet, 
      'team1points': team1points, 
      'team2points': team2points})
  }

  routeToTimeoutsPage() {
    let team1points = this.getPointsByTeamSet('team1', this.match.currentSet)
    let team2points = this.getPointsByTeamSet('team2', this.match.currentSet)
    this.navCtrl.push("TimeoutsPage", {
      "timeoutsUrl": `${this.matchUrl}/${this.match.currentSet}`, 
      'team1': this.team1, 
      'team2': this.team2, 
      'currentSet': this.match.currentSet, 
      'team1points': team1points, 
      'team2points': team2points})
  }

}
