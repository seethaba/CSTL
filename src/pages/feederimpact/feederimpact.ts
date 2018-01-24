// Player Statistics => Tekong Impact
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { Matchservice } from '../../providers/matchservice/matchservice';


@IonicPage()
@Component({
  selector: 'page-feederimpact',
  templateUrl: 'feederimpact.html',
  providers: [Matchservice]
})
export class FeederimpactPage {

  barChartSet1: any;
	barChartSet2: any;
	barChartSet3: any;
	
	playerPicturesSet1 = []
	playerPicturesSet2 = []
	playerPicturesSet3 = []
	
	@ViewChild('barset1Canvas') barset1Canvas;
	@ViewChild('barset2Canvas') barset2Canvas;
	@ViewChild('barset3Canvas') barset3Canvas;

	matchUrl = '';

	constructor(public navCtrl: NavController, 
  	public navParams: NavParams,
    public matchService: Matchservice) {
  	this.matchUrl = this.navParams.get('matchURL');
    

    // Call Provider Methods
    this.matchService.initializeMatchData(this.matchUrl);
    this.matchService.initializeTeamsInformation(this.navParams.get('tournamentName'));
    this.matchService.getMatchSetPoints(this.matchUrl, this.matchService.match.team1Name, this.matchService.match.team2Name);

    this.matchService.profiledata.subscribe((available) => {
	    if(this.matchService.isSetPartofMatch('set1')) {
		    this.barChartSet1.data.labels = this.barChartSet1.data.labels.map(key => {
			    if(this.matchService.playerProfiles[key])
			    	this.playerPicturesSet1[this.matchService.playerProfiles[key].teamKey] = (this.playerPicturesSet1[this.matchService.playerProfiles[key].teamKey] || []).concat([this.matchService.playerProfiles[key].photoURL]);
			    
			    return this.matchService.playerProfiles[key] ? this.matchService.playerProfiles[key].displayName : key
		    })
		    
		    this.barChartSet1.update();
	    }
	    
	    if(this.matchService.isSetPartofMatch('set2')) {
		    
		    this.barChartSet2.data.labels = this.barChartSet2.data.labels.map(key => {
		    	if(this.matchService.playerProfiles[key])
		    		if(this.matchService.playerProfiles[key])
			    	this.playerPicturesSet2[this.matchService.playerProfiles[key].teamKey] = (this.playerPicturesSet2[this.matchService.playerProfiles[key].teamKey] || []).concat([this.matchService.playerProfiles[key].photoURL])

		    	return this.matchService.playerProfiles[key] ? this.matchService.playerProfiles[key].displayName : key
	    	})

		    this.barChartSet2.update();
	    }
	    
	    if(this.matchService.isSetPartofMatch('set3')) {
	    	this.barChartSet3.data.labels = this.barChartSet3.data.labels.map(key => {
		    	if(this.matchService.playerProfiles[key])
		    		if(this.matchService.playerProfiles[key])
			    	this.playerPicturesSet3[this.matchService.playerProfiles[key].teamKey] = (this.playerPicturesSet3[this.matchService.playerProfiles[key].teamKey] || []).concat([this.matchService.playerProfiles[key].photoURL]);

		    	return this.matchService.playerProfiles[key] ? this.matchService.playerProfiles[key].displayName : key
	    	})
	    	
	    	this.barChartSet3.update();
	    }
    });
  }

  getSetBarChartObj(currentSet) {
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
    	
    	let teampoints = this.matchService.getPointsBySet(set);
    	    	
    	let playerIndices = Object.create(null),
	    methodHash = Object.create(null),
	    reportData = { labels: [], datasets: [] };

			teampoints.forEach(function (o) {
				if(o.assistBy) {
					let method = (o.wonMethod == 'Opponent Error' ? "Errors" : "Assists")
					let colors = { 
						"Assists": ['#22cece', '#22cece','#22cece', '#22cece','#22cece', '#22cece','#22cece', '#22cece', '#22cece', '#22cece'],
						"Errors": ['#FF3D67', '#FF3D67', '#FF3D67', '#FF3D67', '#FF3D67', '#FF3D67', '#FF3D67', '#FF3D67', '#FF3D67', '#FF3D67']
					}					

					let users = [o.assistBy].map(user => user)
					users = users.filter(element => element !== undefined)

					for (let user of users) {
						if (!(user in playerIndices)) {
			        playerIndices[user] = reportData.labels.push(user) - 1;
			        reportData.datasets.forEach(function (a) { a.data.push(0); });
			    	}

				    if (!methodHash[method]) {
				        methodHash[method] = { label: method, 
				        	data: reportData.labels.map(function () { return 0; }),
				        	backgroundColor: colors[method],
		              borderColor: colors[method]
				        };
				        reportData.datasets.push(methodHash[method]);
				    }

				    let finish_condition = (method == 'Assists' && (user == o.wonBy || user == o.assistBy))
				    let error_condition = (method == 'Errors' && user == o.errorBy)

				    if(finish_condition || error_condition ) {
				    	methodHash[method].data[playerIndices[user]] = ++(methodHash[method].data[playerIndices[user]]);
				    }
			  	}
			  }
		  });
			
		  if(set == "set1")
		  	this.barChartSet1 = this.createChart(set, reportData);

		  if(set == "set2")
		  	this.barChartSet2 = this.createChart(set, reportData);

		  if(set == "set3")
		  	this.barChartSet3 = this.createChart(set, reportData);
	  	
  	}
  }

  createChart(set, reportData) {
  	return new Chart(this.getSetBarChartObj(set).nativeElement, {
        type: 'horizontalBar',
        data: {
        	labels: reportData.labels.map(key => {return this.matchService.playerProfiles[key] ? this.matchService.playerProfiles[key].displayName : key}),
        	datasets: reportData.datasets.sort(function(a,b) {return (a.label > b.label ? -1 : ((b.label > a.label) ? 1 : 0))} )
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
