import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { Matchservice } from '../../providers/matchservice/matchservice';
import { AngularFireDatabase } from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-scoremethodreport',
  templateUrl: 'scoremethodreport.html',
  providers: [Matchservice]
})

export class ScoremethodreportPage {

	barChart: any;
	
	@ViewChild('team1barset1Canvas') team1barset1Canvas;
	@ViewChild('team1barset2Canvas') team1barset2Canvas;
	@ViewChild('team1barset3Canvas') team1barset3Canvas;
	@ViewChild('team2barset1Canvas') team2barset1Canvas;
	@ViewChild('team2barset2Canvas') team2barset2Canvas;
	@ViewChild('team2barset3Canvas') team2barset3Canvas;

	matchUrl = '';

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

  getSetBarChartObj(currentSet, team) {
  	switch(currentSet) {
      case "set1":
        return team == "team1" ? this.team1barset1Canvas : this.team2barset1Canvas;
      case "set2":
        return team == "team1" ? this.team1barset2Canvas : this.team2barset2Canvas;
      case "set3":
        return team == "team1" ? this.team1barset3Canvas : this.team2barset3Canvas;
    }
  }

  ionViewDidLoad() {
  	for(let set of ["set1", "set2", "set3"]) {
    	let pointsArr = []
    	let teampoints = this.matchService.getPointsBySet(set);
    	let team1name = this.matchService.team1.name;
    	
    	let methodIndices = Object.create(null),
	    teamHash = Object.create(null),
	    reportData = { labels: [], datasets: [] };

			teampoints.forEach(function (o) {
		    if (!(o.wonMethod in methodIndices)) {
		        methodIndices[o.wonMethod] = reportData.labels.push(o.wonMethod) - 1;
		        reportData.datasets.forEach(function (a) { a.data.push(0); });
		    }
		    if (!teamHash[o.team]) {
		        teamHash[o.team] = { label: o.team, 
		        	data: reportData.labels.map(function () { return 0; }),
		        	backgroundColor: ['#22cece','#FF3D67','#059BFF','#FFC233','#FF9124','#8142FF'],
              borderColor: ['#22cece','#FF3D67','#059BFF','#FFC233','#FF9124','#8142FF'] 
		        };
		        reportData.datasets.push(teamHash[o.team]);
		    }
		    teamHash[o.team].data[methodIndices[o.wonMethod]] = ++(teamHash[o.team].data[methodIndices[o.wonMethod]]);
			});

			for(let i of [2,1]) {
				this.barChart = new Chart(this.getSetBarChartObj(set, `team${i}`).nativeElement, {
	        type: 'doughnut',
	        data: {
	        	labels: reportData.labels,
	        	datasets: [reportData.datasets[i-1]]
	        },
	        options: {
	        	title: {
		            display: true,
		            text: `${reportData.datasets[i-1].label} (${set})`,
		            fontSize: 16
		        },
	        	responsive: true,
				    legend: {
				        position: 'left',
				    }
				  }
	      });
	  	}
  	}
  }
}
