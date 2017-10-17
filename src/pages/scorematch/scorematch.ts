import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Matchservice } from '../../providers/matchservice/matchservice';

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
  providers: [Matchservice]
})
export class ScorematchPage {

  //Match Variables
  matchUrl = "";
  srcparam = "";
  
  constructor(public navCtrl: NavController, 
  	public navParams: NavParams,
    private alertCtrl: AlertController,
    public matchService: Matchservice) {

  	this.matchUrl = this.navParams.get('matchURL');
    this.srcparam = this.navParams.get('src');

    // Call Provider Methods
    this.matchService.initializeMatchData(this.matchUrl);
    this.matchService.initializeTeamsInformation();
    this.matchService.getMatchSetPoints(this.matchUrl, this.matchService.match.team1Name, this.matchService.match.team2Name);

  }

  ionViewWillLeave() {
    // Call provide unsubscribe
  }

  getAbbr(name) {
    let data = name.split(' '), output = "";

	for ( var i = 0; i < data.length; i++) {
    	output += data[i].substring(0,1);
	}

	return output;
  }

  addPoint(winningteam, losingteam) {

    let winningTeamData = (winningteam == "t1" ? this.matchService.team1 : this.matchService.team2)
    let losingTeamData = (winningteam == "t1" ? this.matchService.team2 : this.matchService.team1)

    this.navCtrl.push("AddpointPage", {
      'addPointURL': `${this.matchUrl}/${this.matchService.match.currentSet}/${winningteam == "t1" ? "team1" : "team2"}/points`,
      'matchURL': `${this.matchUrl}/${this.matchService.match.currentSet}`,
      'teamLogoUrl': winningTeamData.logoUrl,
      'teamName': winningTeamData.name,
      'winningTeamKey': winningTeamData.$key,
      'losingTeamKey': losingTeamData.$key
    });
  }

  completeSet(currentSet) {
    switch(currentSet) {
      case "set1":
          this.alertSetCompletion("set1", {"currentSet": "set2", "set2": {"number": 2}});
          break;
      case "set2":
          if(this.matchService.isMatchCompleted(currentSet)) {
            this.completeMatch("2 - 0");
          } else {
            this.alertSetCompletion("set2", {"currentSet": "set3", "set3": {"number": 3}});  
          }
          break;
      case "set3":
          this.completeMatch("2 - 1");
          break;
      default:
          return false;
    }
  }

  alertSetCompletion(currentSet, updateOptions) {
    let confirm = this.alertCtrl.create({
      title: 'Set Completed',
      message: `The Set was won by ${(this.matchService.setWonBy(currentSet) == 'team1') ? this.matchService.team1.name : this.matchService.team2.name }`,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.matchService.matchRef$.update(updateOptions);
            this.matchService.matchRef$.subscribe(match => {
              this.matchService.match = match;
            })
          }
        }
      ]
    });
    confirm.present();
  }

  completeMatch(setScore) {
    this.matchService.matchRef$.update({"profileKey": null, 
      "status": "completed", 
      "wonBy": this.matchService.matchWonBy(),
      "setCount": setScore
    });
    let confirm = this.alertCtrl.create({
      title: 'Match Completed',
      message: `The Match was won by ${this.matchService.matchWonBy()}`,
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

  routeToSubsPage() {
    let team1points = this.matchService.getPointsByTeamSet('team1', this.matchService.match.currentSet)
    let team2points = this.matchService.getPointsByTeamSet('team2', this.matchService.match.currentSet)
    this.navCtrl.push("SubstitutionsPage", {
      "subsUrl": `${this.matchUrl}/${this.matchService.match.currentSet}`, 
      'team1': this.matchService.team1, 
      'team2': this.matchService.team2, 
      'currentSet': this.matchService.match.currentSet, 
      'team1points': team1points, 
      'team2points': team2points})
  }

  routeToTimeoutsPage() {
    let team1points = this.matchService.getPointsByTeamSet('team1', this.matchService.match.currentSet)
    let team2points = this.matchService.getPointsByTeamSet('team2', this.matchService.match.currentSet)
    this.navCtrl.push("TimeoutsPage", {
      "timeoutsUrl": `${this.matchUrl}/${this.matchService.match.currentSet}`, 
      'team1': this.matchService.team1, 
      'team2': this.matchService.team2, 
      'currentSet': this.matchService.match.currentSet, 
      'team1points': team1points, 
      'team2points': team2points})
  }

  routeToMatchDetailPage(page) {
    this.navCtrl.push(page, {matchURL: this.matchUrl, 'doubles': this.matchService.match.matchType == 'Doubles', 'src': 'fromMatches'});
  }

}
