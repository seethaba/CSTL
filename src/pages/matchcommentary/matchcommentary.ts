import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Matchservice } from '../../providers/matchservice/matchservice';
import { AngularFireDatabase } from 'angularfire2/database';

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
  

  constructor(private afDatabase: AngularFireDatabase, 
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public matchService: Matchservice) {
  	this.matchUrl = this.navParams.get('matchURL');
    

    // Call Provider Methods
    this.matchService.initializeMatchData(this.matchUrl);
    this.matchService.initializeTeamsInformation();
    this.matchService.getMatchSetPoints(this.matchUrl, this.matchService.match.team1Name, this.matchService.match.team2Name);
    this.matchSets = [['set1', this.matchService.set1points], ['set2', this.matchService.set2points], ['set3', this.matchService.set3points]];

    this.matchcommentary = "set1";
  }

}
