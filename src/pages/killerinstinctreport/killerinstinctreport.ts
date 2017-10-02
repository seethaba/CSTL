import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { Matchservice } from '../../providers/matchservice/matchservice';
import { AngularFireDatabase } from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-killerinstinctreport',
  templateUrl: 'killerinstinctreport.html',
  providers: [Matchservice]
})
export class KillerinstinctreportPage {

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
  	for(let set of this.matchService.getNumberofSets()) {
    	let pointsArr = []
    	let teampoints = this.matchService.getPointsBySet(set);
    	let team1name = this.matchService.team1.name;
    	let team1Counter = 0, team1Highest = 0, team2Counter = 0, team2Highest = 0
    	let team1Gap = -21, team2Gap = -21, team1GapPoint = "", team2GapPoint = ""
    	
      teampoints.map(function(a) {
				if(a.team == team1name) {
					team1Counter++;
					team2Counter = 0;
					if(team1Counter > team1Highest)
						team1Highest = team1Counter;
				}
				else {
					team2Counter++;
					team1Counter = 0;
					if(team2Counter > team2Highest)
						team2Highest = team2Counter;
				}

				let gap = parseInt(a.team1point) - parseInt(a.team2point)
				if(gap > team1Gap) {
					team1Gap = gap
					team1GapPoint = `${a.team1point} - ${a.team2point}`
				}

				gap = -1*gap
				if(gap > team2Gap) {
					team2Gap = gap
					team2GapPoint = `${a.team2point} - ${a.team1point}`
				}
			})


	    this.barChart = new Chart(this.getSetLineChartObj(set).nativeElement, {
        type: 'horizontalBar',
        data: {
            labels: ['Winning Streak', 'Biggest Lead'],
            datasets: [{
            		label: `${this.matchService.abbrTeam1}`,
                data: [team1Highest, team1Gap],
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
                label: `${this.matchService.abbrTeam2}`,
                data: [team2Highest, team2Gap],
                backgroundColor: [
                  '#FF3D67',
                  '#FF3D67'
                ],
                borderColor: [
                  '#FF3D67',
                  '#FF3D67'
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
			        ticks: {
			          beginAtZero: true
			        }
			      }],
			      xAxes: [{
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