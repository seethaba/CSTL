import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MatchstatsindexPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-matchstatsindex',
  templateUrl: 'matchstatsindex.html',
})
export class MatchstatsindexPage {
	statsGraph = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.statsGraph = [
  		{
  			title: "How many times did the match turn?",
  			description: "Point by Point analysis",
  			pageLink: "MatchstatsPage"
  		},
  		{
  			title: "How well did the teams finish points?",
  			description: "Comparison of the team's finishing skills",
  			pageLink: "MatchstatsdetailsPage"
  		},
  		{
  			title: "How consistent were the teams?",
  			description: "Comparison of the team's killer instinct",
  			pageLink: "KillerinstinctreportPage"
  		},
  		{
  			title: "How did the teams score the points?",
  			description: "Comparison of the team's scoring methods",
  			pageLink: "ScoremethodreportPage"	
  		},
  		{
  			title: "How did the teams Lose Points?",
  			description: "Comparison of the team's problem areas",
  			pageLink: "ErrormethodreportPage"	
  		}
  	]
  }

  routeToReportPage(page) {
    if(page)
    {
    	this.navCtrl.push(page, {matchURL: this.navParams.get('matchURL'), 'src': 'fromMatches'});
    }
  }

}
