import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Profile } from "../../models/profile";
import { Matchplayers } from "../../models/matchplayers";

/**
 * Generated class for the AddMatchplayerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-matchplayer',
  templateUrl: 'add-matchplayer.html',
})
export class AddMatchplayerPage {

  profileRef$: FirebaseListObservable<Profile[]>
  matchplayersRef$: FirebaseListObservable<Matchplayers[]>

  matchplayer = {} as Matchplayers;
  profile = {} as Profile;
  teamName = "";
  profileNames = [];


  constructor(private afDatabase: AngularFireDatabase, 
  	public navCtrl: NavController, 
  	public navParams: NavParams) {
  	this.profileRef$ = this.afDatabase.list('profile', {
  	  query: {
  	    orderByChild: "teamKey",
  	    equalTo: this.navParams.get('teamKey')
  	  }
  	});
  	
  	this.matchplayersRef$ = this.afDatabase.list(this.navParams.get('matchTeamUri'));
    
    this.matchplayersRef$.subscribe(matchplayers => {
      this.profileNames = matchplayers.map(function(a) {return a.name;});
    })
    
  	this.teamName = this.navParams.get('teamName');
  }

  addMatchplayer(matchplayer: Matchplayers) {
  	this.matchplayersRef$.push(this.matchplayer);
    this.navCtrl.pop();
  }

}
