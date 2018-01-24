import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Matchservice } from '../../providers/matchservice/matchservice';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Substitution } from "../../models/substitution";
import { Timeout } from "../../models/timeout";

/**
 * Generated class for the MatchcommentaryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-matchcommentary',
  templateUrl: 'matchcommentary.html',
  providers: [Matchservice]
})
export class MatchcommentaryPage {

	matchUrl = ""
	matchSets = []
	matchcommentary = ""

  set1subs = {};
  set2subs = {};
  set3subs = {};
  
  set1timeouts = {};
  set2timeouts = {};
  set3timeouts = {};
  

  constructor(private afDatabase: AngularFireDatabase, 
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public matchService: Matchservice) {
  	this.matchUrl = this.navParams.get('matchURL');
    

    // Call Provider Methods
    this.matchService.initializeMatchData(this.matchUrl);
    this.matchService.initializeTeamsInformation(this.navParams.get('tournamentName'));
    this.matchService.getMatchSetPoints(this.matchUrl, this.matchService.match.team1Name, this.matchService.match.team2Name);
    this.matchSets = [['set1', this.matchService.set1points, this.set1subs, this.set1timeouts], 
                      ['set2', this.matchService.set2points, this.set2subs, this.set2timeouts], 
                      ['set3', this.matchService.set3points, this.set3subs, this.set3timeouts]];

    this.matchcommentary = "set1";

    this.afDatabase.list(`${this.matchUrl}/set1/team1/subs`).subscribe(subs => {
      for(let sub of subs) {
        let substitution = this.getSubstitutionWithTeam("Team1", sub)
        this.set1subs[sub.point] = (this.set1subs[sub.point] || []).concat([substitution])
      }
    });

    this.afDatabase.list(`${this.matchUrl}/set2/team1/subs`).subscribe(subs => {
      for(let sub of subs) {
        let substitution = this.getSubstitutionWithTeam("Team1", sub)
        this.set2subs[sub.point] = (this.set2subs[sub.point] || []).concat([substitution])
      }
    });

    this.afDatabase.list(`${this.matchUrl}/set3/team1/subs`).subscribe(subs => {
      for(let sub of subs) {
        let substitution = this.getSubstitutionWithTeam("Team1", sub)
        this.set3subs[sub.point] = (this.set3subs[sub.point] || []).concat([substitution])
      }
    });


    this.afDatabase.list(`${this.matchUrl}/set1/team2/subs`).subscribe(subs => {
      for(let sub of subs) {
        let substitution = this.getSubstitutionWithTeam("Team2", sub)
        let point = this.rearrangeTeam2Point(sub.point)
        this.set1subs[point] = (this.set1subs[point] || []).concat([substitution])
      }
    });

    this.afDatabase.list(`${this.matchUrl}/set2/team2/subs`).subscribe(subs => {
      for(let sub of subs) {
        let substitution = this.getSubstitutionWithTeam("Team2", sub)
        let point = this.rearrangeTeam2Point(sub.point)
        this.set2subs[point] = (this.set2subs[point] || []).concat([substitution])
      }
    });

    this.afDatabase.list(`${this.matchUrl}/set3/team2/subs`).subscribe(subs => {
      for(let sub of subs) {
        let substitution = this.getSubstitutionWithTeam("Team2", sub)
        let point = this.rearrangeTeam2Point(sub.point)
        this.set3subs[point] = (this.set3subs[point] || []).concat([substitution])
      }
    });

    this.afDatabase.list(`${this.matchUrl}/set1/team1/timeouts`).subscribe(timeouts => {
      for(let timeout of timeouts) {
        this.set1timeouts[timeout.point] = (this.set1timeouts[timeout.point] || []).concat(['Team1'])
      }
    });
    this.afDatabase.list(`${this.matchUrl}/set2/team1/timeouts`).subscribe(timeouts => {
      for(let timeout of timeouts) {
        this.set2timeouts[timeout.point] = (this.set2timeouts[timeout.point] || []).concat(['Team1'])
      }
    });
    this.afDatabase.list(`${this.matchUrl}/set3/team1/timeouts`).subscribe(timeouts => {
      for(let timeout of timeouts) {
        this.set3timeouts[timeout.point] = (this.set3timeouts[timeout.point] || []).concat(['Team1'])
      }
    });

    this.afDatabase.list(`${this.matchUrl}/set1/team2/timeouts`).subscribe(timeouts => {
      for(let timeout of timeouts) {
        let point = this.rearrangeTeam2Point(timeout.point)
        this.set1timeouts[point] = (this.set1timeouts[point] || []).concat(['Team2'])
      }
    });
    this.afDatabase.list(`${this.matchUrl}/set2/team2/timeouts`).subscribe(timeouts => {
      for(let timeout of timeouts) {
        let point = this.rearrangeTeam2Point(timeout.point)
        this.set2timeouts[point] = (this.set2timeouts[point] || []).concat(['Team2'])
      }
    });
    this.afDatabase.list(`${this.matchUrl}/set3/team2/timeouts`).subscribe(timeouts => {
      for(let timeout of timeouts) {
        let point = this.rearrangeTeam2Point(timeout.point)
        this.set3timeouts[point] = (this.set3timeouts[point] || []).concat(['Team2'])
      }
    });
  }

  rearrangeTeam2Point(point) {
    let points = point.split(" - ")
    return `${points[1]} - ${points[0]}`
  }

  getSubstitutionWithTeam(team, sub) {
    return {
      playerOut: sub.playerOut,
      playerIn: sub.playerIn,
      team: team
    }
  }

  pointStructure(point1,point2) {
    return `${point1} - ${point2}`
  }

}
