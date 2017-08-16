import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController} from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Profile } from "../../models/profile";
import { Matchplayers } from "../../models/matchplayers";
import { AddMatchplayerPage } from '../../pages/add-matchplayer/add-matchplayer';
import { Subscription } from "rxjs/Subscription";

/**
 * Generated class for the ChooseplayersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chooseplayers',
  templateUrl: 'chooseplayers.html',
})
export class ChooseplayersPage {

  profileRef$: FirebaseListObservable<Profile[]>
  profileObjRef$: FirebaseObjectObservable<Profile>
  MatchplayersRef$: FirebaseListObservable<Matchplayers[]>
  MatchplayersSubscription: Subscription;
  
  teamName = "";
  teamUri = "";
  teamKey = "";
  profiles = [] as Profile[];
  matchplayers = [] as Matchplayers[];

  constructor(public navCtrl: NavController, 	
  	public navParams: NavParams, 
  	private afDatabase: AngularFireDatabase,
  	private actionSheetCtrl: ActionSheetController) {

  	this.teamName = this.navParams.get("teamName");
  	this.teamUri = this.navParams.get("teamUri");
  	this.teamKey = this.navParams.get("teamKey");

  	this.MatchplayersRef$ = this.afDatabase.list(`${this.teamUri}`);
  	// this.MatchplayersSubscription = this.MatchplayersRef$
   //  .take(1).subscribe(matchplayers => {
   //  	let i = 0;
   //  	this.matchplayers = matchplayers;
   //      this.matchplayers.forEach(matchplayer => {
   //      	this.profileObjRef$ = this.afDatabase.object(`profile/${matchplayer.profileKey}`);
   //      	this.profileObjRef$.take(1).subscribe(profile => {
   //      		this.profiles[i] = profile;
   //      	})
   //      	i++;
   //      });
   //  })
  }

  ionViewDidLoad() {
    
  }

  ionViewWillLeave() {
  	// this.MatchplayersSubscription.unsubscribe();
  }

  addMatchplayer() {
  	this.navCtrl.push('AddMatchplayerPage', {matchTeamUri: this.teamUri, teamKey: this.teamKey, teamName: this.teamName});
  }

  viewMatchplayers(matchplayer: Matchplayers){
    // this.navCtrl.push('ShowprofilePage', {teamName: team.name, teamKey: team.$key, teamLogoUrl: team.logoUrl});
  }

  selectTeam(matchplayer: Matchplayers){
  	this.actionSheetCtrl.create({
  		// title: `${matchplayer.name}`,
  		title: "Test",
  		buttons: [{
  			text: "Edit",
  			handler: () => {
  				// this.navCtrl.push('EditTeamPage', {teamId: team.$key})
  			}}, {
  			text: "Delete",
  			role: 'destructive',
  			handler: () => {
  			 	// this.TeamRef$.remove(team.$key);
  			}}, {
  			text: "Cancel",
  			role: 'cancel',
  			handler: () => {
  				console.log("Cancel Button")
  			},
  		}]
  	}).present();
  }

  returnToStartMatch() {
  	this.navCtrl.pop();
  }

}
