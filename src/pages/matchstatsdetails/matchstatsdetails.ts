import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { Matchservice } from '../../providers/matchservice/matchservice';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the MatchstatsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-matchstatsdetails',
  templateUrl: 'matchstatsdetails.html',
  providers: [Matchservice]
})
export class MatchstatsdetailsPage {

	barChart: any;
	
	@ViewChild('barset1Canvas') barset1Canvas;
	@ViewChild('barset2Canvas') barset2Canvas;
	@ViewChild('barset3Canvas') barset3Canvas;

	matchUrl = '';
	matchSets = [];

	constructor(private afDatabase: AngularFireDatabase, 
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public matchService: Matchservice) {
  	this.matchUrl = this.navParams.get('matchURL');
    

    // Call Provider Methods
    this.matchService.initializeMatchData(this.matchUrl);
    this.matchService.initializeTeamsInformation();
    this.matchService.getMatchSetPoints(this.matchUrl, this.matchService.match.team1Name, this.matchService.match.team2Name);
  }

  getSetLineChartObj(currentSet) {
  	switch(currentSet) {
      case "set1":
        return this.barset1Canvas;
      case "set2":
        return this.barset2Canvas;
      case "set3":
        return this.barset3Canvas;
    }
  }

  ionViewDidLoad() {
  	for(let set of ["set1", "set2", "set3"]) {
    	let pointsArr = []
    	let teampoints = this.matchService.getPointsBySet(set);
    	let team1name = this.matchService.team1.name;
    	let team1finish = 0, team1error = 0, team1other = 0, team2finish = 0, team2error = 0, team2other = 0
    	
      teampoints.map(function(a) {
			   if(a.wonMethod == 'Opponent Error')
			   {
			   		a.team == team1name ? team2error++ : team1error++;
			   }
			   else if(a.wonMethod == 'Other')
			   {
			   		a.team == team1name ? team1other++ : team2other++;
			   }
			   else
			   {
			   		a.team == team1name ? team1finish++ : team2finish++;
			   }

			})


	    this.barChart = new Chart(this.getSetLineChartObj(set).nativeElement, {
        type: 'horizontalBar',
        data: {
            labels: [`${this.matchService.abbrTeam1}`,`${this.matchService.abbrTeam2}`],
            datasets: [{
            		label: 'Finishes',
                data: [team1finish, team2finish],
                backgroundColor: [
                  '#22cece',
                  '#22cece'
                ],
                borderColor: [
                  '#22cece',
                  '#22cece'
                ],
                borderWidth: 1
            },
            {                
                label: 'Errors',
                data: [team1error, team2error],
                backgroundColor: [
                  '#FF3D67',
                  '#FF3D67'
                ],
                borderColor: [
                  '#FF3D67',
                  '#FF3D67'
                ],
                borderWidth: 1
            },
            {                
                label: 'Other',
                data: [team1other, team2other],
                backgroundColor: [
                  '#CCCCCC',
                  '#CCCCCC'
                ],
                borderColor: [
                  '#CCCCCC',
                  '#CCCCCC'
                ],
                borderWidth: 1
            }]
        },
        options: {
        	responsive: true,
			    legend: {
			        position: 'bottom',
			    },
			    scales: {
			      yAxes: [{
			        stacked: true,
			        ticks: {
			          beginAtZero: true
			        }
			      }],
			      xAxes: [{
			        stacked: true,
			        ticks: {
			          beginAtZero: true
			        }
			      }]

			    }
			  }
      });
  	}
  }
}

