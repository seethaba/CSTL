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
  			title: "Point By Point Analysis",
  			description: "Turning Points - Visual Plot",
  			pageLink: "MatchstatsPage"
  		},
  		{
  			title: "Finishing Index",
  			description: "Finishing Skills Comparison",
  			pageLink: "MatchstatsdetailsPage"
  		},
  		{
  			title: "Consistency Index",
  			description: "Biggest streak and lead Comparison",
  			pageLink: "KillerinstinctreportPage"
  		},
  		{
  			title: "Scoring Areas",
  			description: "Distribution of scoring methods",
  			pageLink: "ScoremethodreportPage"	
  		},
  		{
  			title: "Problem Areas",
  			description: "Distribution of errors",
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
