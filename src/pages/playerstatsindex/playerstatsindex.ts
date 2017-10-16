import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PlayerstatsindexPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-playerstatsindex',
  templateUrl: 'playerstatsindex.html',
})
export class PlayerstatsindexPage {
	statsGraph = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  	this.statsGraph = [
      {
        title: "Overall Player Impact",
        description: "Player Finish vs Error Rates",
        pageLink: "PlayerimpactPage"
      },
  		{
  			title: "Tekong Power",
  			description: "Comparison of the centers",
  			pageLink: "ServiceimpactPage",
        conditions: this.navParams.get('doubles')
  		},
  		{
  			title: "Killer Instinct",
  			description: "Comparison of the strikers",
  			pageLink: "StrikeimpactPage"
  		},
  		{
  			title: "Feeder Influence",
  			description: "Comparison of the suppliers",
  			pageLink: "FeederimpactPage"	
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