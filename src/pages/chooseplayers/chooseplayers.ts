import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController} from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Matchplayers } from "../../models/matchplayers";
import { AddMatchplayerPage } from '../../pages/add-matchplayer/add-matchplayer';

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

  MatchplayersRef$: FirebaseListObservable<Matchplayers[]>
  
  teamName = "";
  teamUri = "";
  teamKey = "";
  matchplayers = {};
  playerCount = 5;

  constructor(public navCtrl: NavController, 	
  	public navParams: NavParams, 
  	private afDatabase: AngularFireDatabase,
  	private actionSheetCtrl: ActionSheetController) {

  	this.teamName = this.navParams.get("teamName");
  	this.teamUri = this.navParams.get("teamUri");
  	this.teamKey = this.navParams.get("teamKey");
    this.playerCount = (this.navParams.get("eventType") == 'Doubles' ? 4 : 5);

	this.MatchplayersRef$ = this.afDatabase.list(`${this.teamUri}`);
	
  }

  ionViewDidLoad() {
    
  }

  addMatchplayer() {
  	this.navCtrl.push('AddMatchplayerPage', {tournamentName: this.navParams.get('tournamentName'), matchTeamUri: this.teamUri, teamKey: this.teamKey, teamName: this.teamName});
  }

  viewMatchplayers(matchplayer: Matchplayers){
    // this.navCtrl.push('ShowprofilePage', {teamName: team.name, teamKey: team.$key, teamLogoUrl: team.logoUrl});
  }

  selectMatchplayer(matchplayer: Matchplayers){
  	this.actionSheetCtrl.create({
  		title: `${matchplayer.name}`,
  		buttons: [{
  			text: "Edit",
  			handler: () => {
  				this.navCtrl.push('EditMatchplayerPage', {matchplayerId: matchplayer.$key, teamKey: this.teamKey, teamUri: this.teamUri})
  			}}, {
  			text: "Delete",
  			role: 'destructive',
  			handler: () => {
  			 	this.MatchplayersRef$.remove(matchplayer.$key);
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
