import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Team } from "../../models/team";
import { Match } from "../../models/match";
import { Profile } from "../../models/profile";
import { Setpoints } from "../../models/setpoints";
import { Subscription } from "rxjs/Subscription";

/*
  Generated class for the MatchserviceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class Matchservice {

	//Match Variables
  matchRef$: FirebaseObjectObservable<Match>;
  match = {} as Match;
  matchSubscription: Subscription;
  srcparam = "";
  
  // Team Variables
  team1Ref$: FirebaseObjectObservable<Team>;
  team2Ref$: FirebaseObjectObservable<Team>;
  team1 = {} as Team;
  team2 = {} as Team;
  team1Subscription: Subscription;
  team2Subscription: Subscription;
  abbrTeam1 = "";
  abbrTeam2 = "";
  abbrToss = ""
  upprTeam1 = "";
  upprTeam2 = "";

  //Team Players
  team1ProfileRef$: FirebaseListObservable<Profile[]>;
  team2ProfileRef$: FirebaseListObservable<Profile[]>;
  playerProfiles = {};
  private profiledataObserver: any;
  public profiledata: any;

  // Set Points Data
  team1set1pointsRef$: FirebaseListObservable<Setpoints[]>;
  team1set2pointsRef$: FirebaseListObservable<Setpoints[]>;
  team1set3pointsRef$: FirebaseListObservable<Setpoints[]>;
  team2set1pointsRef$: FirebaseListObservable<Setpoints[]>;
  team2set2pointsRef$: FirebaseListObservable<Setpoints[]>;
  team2set3pointsRef$: FirebaseListObservable<Setpoints[]>;
  team1set1points = 0;
  team1set2points = 0;
  team1set3points = 0;
  team2set1points = 0;
  team2set2points = 0;
  team2set3points = 0;
  set1points = [];
  set2points = [];
  set3points = [];

  constructor(private afDatabase: AngularFireDatabase) {
    // Constructor Code
    this.profiledataObserver = null;

    this.profiledata = Observable.create(observer => {
      this.profiledataObserver = observer;
    });
  }

  initializeMatchData(matchUrl: string) {
  	this.matchRef$ = this.afDatabase.object(matchUrl);
  }

  initializeTeamsInformation(tournamentName) {
  	this.matchSubscription = this.matchRef$.take(1).subscribe(match => {
    	this.match = match;
      
      // Get Player Profiles
      this.team1ProfileRef$ = this.afDatabase.list('profile', {
        query: {
          orderByChild: `${tournamentName}`,
          equalTo: match.team1Key
        }
      });

      this.team2ProfileRef$ = this.afDatabase.list('profile', {
        query: {
          orderByChild: `${tournamentName}`,
          equalTo: match.team2Key
        }
      });

      this.team1ProfileRef$.subscribe(profiles => {
        for(let p of profiles) {
          if(p.appPicUrl)
            p.photoURL = p.appPicUrl;
          else
            p.photoURL = 'https://image.ibb.co/hUx7Db/default_user.png';
          
            if(p.name)
            p.displayName = p.name

          this.playerProfiles[p.$key] = p;
        }
        
        if(this.profiledataObserver) 
          this.profiledataObserver.next(true);
        
      });

      this.team2ProfileRef$.subscribe(profiles => {
        for(let p of profiles) {
          if(p.appPicUrl)
            p.photoURL = p.appPicUrl;
          else
            p.photoURL = 'https://image.ibb.co/hUx7Db/default_user.png';

          if(p.name)
            p.displayName = p.name
            
          this.playerProfiles[p.$key] = p;
        }

        if(this.profiledataObserver) 
          this.profiledataObserver.next(true);
      })

      if(match.toss) {
        this.abbrToss = this.getAbbr(match.toss);
      }

      // Get Team Names
    	this.team1Ref$ = this.afDatabase.object(`${tournamentName}/team/${match.team1Key}`);
    	this.team2Ref$ = this.afDatabase.object(`${tournamentName}/team/${match.team2Key}`);

    	this.team1Subscription = this.team1Ref$.subscribe(team1 => {
    		this.team1 = team1;
        if(team1.name){
          this.abbrTeam1 = this.getAbbr(team1.name);  
          this.upprTeam1 = team1.name.toUpperCase();  
        }
    	});
    	this.team2Subscription = this.team2Ref$.subscribe(team2 => {
    		this.team2 = team2
        if (team2.name) {
          this.abbrTeam2 = this.getAbbr(team2.name);
          this.upprTeam2 = team2.name.toUpperCase();  
        }
    	});

      

    });
  }

  getMatchSetPoints(matchUrl, team1, team2) {
  	this.team1set1pointsRef$ = this.afDatabase.list(`${matchUrl}/set1/team1/points`);
    this.team1set2pointsRef$ = this.afDatabase.list(`${matchUrl}/set2/team1/points`);
    this.team1set3pointsRef$ = this.afDatabase.list(`${matchUrl}/set3/team1/points`);

    this.team2set1pointsRef$ = this.afDatabase.list(`${matchUrl}/set1/team2/points`);
    this.team2set2pointsRef$ = this.afDatabase.list(`${matchUrl}/set2/team2/points`);
    this.team2set3pointsRef$ = this.afDatabase.list(`${matchUrl}/set3/team2/points`);

    this.team1set1pointsRef$.subscribe(setpoints => {
      let setpointsmap = setpoints.map(a => {
        return this.getSetPointsHash(team1, a);
      });
      this.set1points = this.set1points.concat(setpointsmap);
      this.team1set1points = setpointsmap.length;
    })

    this.team1set2pointsRef$.subscribe(setpoints => {
      let setpointsmap = setpoints.map(a => {
        return this.getSetPointsHash(team1, a);
      });
      this.set2points = this.set2points.concat(setpointsmap);
      this.team1set2points = setpointsmap.length;
    })

    this.team1set3pointsRef$.subscribe(setpoints => {
      let setpointsmap = setpoints.map(a => {
        return this.getSetPointsHash(team1, a);
      });
      this.set3points = this.set3points.concat(setpointsmap);
      this.team1set3points = setpointsmap.length;
    })

    this.team2set1pointsRef$.subscribe(setpoints => {
      let setpointsmap = setpoints.map(a => {
        return this.getSetPointsHash(team2, a);
      });
      this.set1points = this.set1points.concat(setpointsmap);
      this.team2set1points = setpointsmap.length;
      this.set1points.sort(function(a,b) {return (a.$key > b.$key) ? 1 : ((b.$key > a.$key) ? -1 : 0);} );
      let team1point = 0, team2point = 0;
      this.set1points = this.set1points.map(function(a) {
        return {
          "team1point": `${((a.team == team1) ? ++team1point : team1point)}`,
          "team2point": `${((a.team == team2) ? ++team2point : team2point)}`,
          "teamLogo": `${((a.team == team2) ? team2.logoUrl : team1.logoUrl)}`,
          "team": a.team, 
          "wonBy": a.wonBy,
          "wonMethod": a.wonMethod,
          "assistBy": a.assistBy,
          "errorBy": a.errorBy,
          "errorMethod": a.errorMethod == 'Other' ? 'Service Error' : (a.errorMethod == 'Placement Error' && a.wonMethod == 'Placement' ? 'Receiving Error' : a.errorMethod),
          "$key": a.$key
        }
      })
    })

    this.team2set2pointsRef$.subscribe(setpoints => {
      let setpointsmap = setpoints.map(a => {
        return this.getSetPointsHash(team2, a);
      });
      this.set2points = this.set2points.concat(setpointsmap);
      this.team2set2points = setpointsmap.length;
      this.set2points.sort(function(a,b) {return (a.$key > b.$key) ? 1 : ((b.$key > a.$key) ? -1 : 0);} );
      let team1point = 0, team2point = 0;
      this.set2points = this.set2points.map(function(a) {
        return {
          "team1point": `${((a.team == team1) ? ++team1point : team1point)}`,
          "team2point": `${((a.team == team2) ? ++team2point : team2point)}`,
          "teamLogo": `${((a.team == team2) ? team2.logoUrl : team1.logoUrl)}`,
          "team": a.team, 
          "wonBy": a.wonBy,
          "wonMethod": a.wonMethod,
          "assistBy": a.assistBy,
          "errorBy": a.errorBy,
          "errorMethod": a.errorMethod == 'Other' ? 'Service Error' : (a.errorMethod == 'Placement Error' && a.wonMethod == 'Placement' ? 'Receiving Error' : a.errorMethod),
          "$key": a.$key
        }
      })
    })

    this.team2set3pointsRef$.subscribe(setpoints => {
      let setpointsmap = setpoints.map(a => {
        return this.getSetPointsHash(team2, a);
      });
      this.set3points = this.set3points.concat(setpointsmap);
      this.team2set3points = setpointsmap.length;
      this.set3points.sort(function(a,b) {return (a.$key > b.$key) ? 1 : ((b.$key > a.$key) ? -1 : 0);} );
      let team1point = 0, team2point = 0;
      this.set3points = this.set3points.map(a => {
        return {
          "team1point": `${((a.team == team1) ? ++team1point : team1point)}`,
          "team2point": `${((a.team == team2) ? ++team2point : team2point)}`,
          "teamLogo": `${((a.team == team2) ? team2.logoUrl : team1.logoUrl)}`,
          "team": a.team, 
          "wonBy": a.wonBy,
          "wonMethod": a.wonMethod,
          "assistBy": a.assistBy,
          "errorBy": a.errorBy,
          "errorMethod": this.getErrorMethod(a.errorMethod, a.wonMethod),
          "$key": a.$key
        }
      })
    })
  }

  getErrorMethod(method, wonMethod) {
    if(method == 'Other')
     return 'Service Error';

    if(method == 'Placement Error' && wonMethod == 'Placement')
      return 'Receiving Error';

    if(method)
      return method;
    else
      return 'Other';
  }

  getSetPointsHash(team, a) {
    return {
      "team": team, 
      "wonBy": a.wonBy,
      "wonMethod": a.wonMethod,
      "assistBy": a.assistBy,
      "errorBy": a.errorBy,
      "errorMethod": a.errorMethod,
      "$key": a.$key
    }
  }

  unSubscribeSubscriptions() {
  	this.matchSubscription.unsubscribe();
    this.team1Subscription.unsubscribe();
    this.team2Subscription.unsubscribe();
  }


  // Match Logic
  isSetCompleted(currentSet) {
    switch(currentSet) {
      case "set1":
          return this.isSetWon(this.team1set1points, this.team2set1points);
      case "set2":
          return this.isSetWon(this.team1set2points, this.team2set2points);
      case "set3":
          return this.isSetWon(this.team1set3points, this.team2set3points);
      default:
          return false;
    }
  }

  getPointsByTeamSet(team, currentSet) {
    switch(currentSet) {
      case "set1":
          return (team == 'team1') ? this.team1set1points : this.team2set1points;
      case "set2":
          return (team == 'team1') ? this.team1set2points : this.team2set2points;
      case "set3":
          return (team == 'team1') ? this.team1set3points : this.team2set3points;
      default:
          return false;
    }
  }

  getPointsBySet(currentSet) {
    switch(currentSet) {
      case "set1":
        return this.set1points;
      case "set2":
        return this.set2points;
      case "set3":
        return this.set3points;
    }
  }

  setWonBy(currentSet) {
    switch(currentSet) {
      case "set1":
          return this.team1set1points > this.team2set1points ? "team1" : "team2";
      case "set2":
          return this.team1set2points > this.team2set2points ? "team1" : "team2";
      case "set3":
          return this.team1set3points > this.team2set3points ? "team1" : "team2";
      default:
          return "";
    }
  }

  matchWonBy() {
    let team1Count = 0, team2Count = 0;
    (this.setWonBy("set1") == 'team1') ? team1Count++ : team2Count++;
    (this.setWonBy("set2") == 'team1') ? team1Count++ : team2Count++;
    (this.setWonBy("set3") == 'team1') ? team1Count++ : team2Count++;

    return ((team1Count > team2Count) ? this.team1.name : this.team2.name)
  }


  isMatchCompleted(currentSet) {
    switch(currentSet) {
      case "set2":
          return this.isSetCompleted(currentSet) && (this.setWonBy("set1") == this.setWonBy("set2"))
      case "set3":
          return this.isSetCompleted(currentSet)
      default:
          return false;
    }
  }

	isSetWon(team1points, team2points) {
    return ((team1points >= 21 && (team1points - team2points) >=2) || 
      (team2points >= 21 && (team2points - team1points) >=2) ||
      (team1points == 25) || (team2points == 25));
  }

  isSetPartofMatch(set) {
    let arr = (set == 'set3') ? ["set3"] : (set == 'set2' ? ['set2', 'set3'] : ['set1', 'set2', 'set3'])
    return arr.indexOf(this.match.currentSet) > -1
  }

  getNumberofSets() {
    switch(this.match.currentSet) {
      case "set2":
        return ['set1', 'set2'];
      case "set3":
        return ['set1', 'set2', 'set3'];
      case "set1":
        return ['set1'];
      default:
        return [];
    }
  }

  getAbbr(name) {
	    let data = name.split(' '), output = "";

		for ( var i = 0; i < data.length; i++) {
	    	output += data[i].substring(0,1);
		}

		return output;
  }

}
