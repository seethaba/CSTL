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
  selector: 'page-matchstats',
  templateUrl: 'matchstats.html',
  providers: [Matchservice]
})
export class MatchstatsPage {
	lineChart: any;

	@ViewChild('lineset1Canvas') lineset1Canvas;
	@ViewChild('lineset2Canvas') lineset2Canvas;
	@ViewChild('lineset3Canvas') lineset3Canvas;

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
        return this.lineset1Canvas;
      case "set2":
        return this.lineset2Canvas;
      case "set3":
        return this.lineset3Canvas;
    }
  }
 
  ionViewDidLoad() {

    for(let set of ["set1", "set2", "set3"]) {
    	let pointsArr = []
    	let teampoints = this.matchService.getPointsBySet(set);

      let maxLength = teampoints.length
      for (var i = 1; i <= maxLength; i++) {
			   pointsArr.push(i);
			}

      this.lineChart = new Chart(this.getSetLineChartObj(set).nativeElement, {

          type: 'line',
					options: {
				    responsive: true,
				    legend: {
				        position: 'bottom',
				    },
				    scales: {
				        yAxes: [{
				                display: true,
				                ticks: {
				                    min: 0,
				                    max: 25,
				                    stepSize: 5
				                }
				            }]
				    }
					},
          data: {
              labels: pointsArr,
              datasets: [
                  {
                      label: `${this.matchService.abbrTeam1}`,
                      fill: false,
								      lineTension: 0.1,
								      backgroundColor: "rgba(225,0,0,0.4)",
								      borderColor: "red", // The main line color
								      borderCapStyle: 'square',
								      borderDash: [], // try [5, 15] for instance
								      borderDashOffset: 0.0,
								      borderJoinStyle: 'miter',
								      pointBorderColor: "black",
								      pointBackgroundColor: "white",
								      pointBorderWidth: 1,
								      pointHoverRadius: 3,
								      pointHoverBackgroundColor: "yellow",
								      pointHoverBorderColor: "brown",
								      pointHoverBorderWidth: 2,
								      pointRadius: 1,
								      pointHitRadius: 5,
                      data: teampoints.map(function(a) {return a.team1point}),
                      spanGaps: true,
                  },
                  {
                      label: `${this.matchService.abbrTeam2}`,
                      fill: false,
								      lineTension: 0.1,
								      backgroundColor: "rgba(167,105,0,0.4)",
								      borderColor: "rgb(167, 105, 0)",
								      borderCapStyle: 'butt',
								      borderDash: [],
								      borderDashOffset: 0.0,
								      borderJoinStyle: 'miter',
								      pointBorderColor: "white",
								      pointBackgroundColor: "black",
								      pointBorderWidth: 1,
								      pointHoverRadius: 3,
								      pointHoverBackgroundColor: "brown",
								      pointHoverBorderColor: "yellow",
								      pointHoverBorderWidth: 2,
								      pointRadius: 1,
								      pointHitRadius: 5,
                      data: teampoints.map(function(a) {return a.team2point}),
                      spanGaps: false,
                  }
              ]
          }

      });
    }
      
  }

}
