import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController} from 'ionic-angular';
import { AddTeamPage } from '../../pages/add-team/add-team';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Team } from "../../models/team";
import { EditTeamPage } from "../../pages/edit-team/edit-team";
import { ShowprofilePage } from "../../pages/showprofile/showprofile";
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component({
  selector: 'page-teamlist',
  templateUrl: 'teamlist.html',
})
export class TeamlistPage {

  TeamRef$: FirebaseListObservable<Team[]>
  adminUser = false;

  constructor(private afAuth: AngularFireAuth, 
    private afDatabase: AngularFireDatabase, 
    public navCtrl: NavController, 
  	public navParams: NavParams, 
    private actionSheetCtrl: ActionSheetController,
    private nativePageTransitions: NativePageTransitions) {

  	this.TeamRef$ = this.afDatabase.list(`${this.navParams.get('tournamentName')}/team`);
    this.afAuth.authState.take(1).subscribe(data => {
      this.afDatabase.object(`profile/${data.uid}`).take(1).subscribe(profileData => {
        this.adminUser = profileData.admin;
      });
    });  

  }

  navigateToAddTeamPage() {
  	this.navCtrl.push('AddTeamPage', {'tournamentName': this.navParams.get('tournamentName')});
  }

  viewPlayers(team: Team){
    this.navCtrl.push('ShowprofilePage', {'tournamentName': this.navParams.get('tournamentName'), teamName: team.name, teamKey: team.$key, teamLogoUrl: team.logoUrl});
  }

  selectTeam(team: Team){
  	this.actionSheetCtrl.create({
  		title: `${team.name}`,
  		buttons: [{
  			text: "Edit",
  			handler: () => {
  				this.navCtrl.push('EditTeamPage', {teamId: team.$key, 'tournamentName': this.navParams.get('tournamentName')})
  			}}, {
  			text: "Delete",
  			role: 'destructive',
  			handler: () => {
  			 	this.TeamRef$.remove(team.$key);
  			}}, {
  			text: "Cancel",
  			role: 'cancel',
  			handler: () => {
  				console.log("Cancel Button")
  			},
  		}]
  	}).present();
  }

  ionViewWillLeave() {
    let options: NativeTransitionOptions = {
      duration: 200
     };

    this.nativePageTransitions.fade(options)
     .then(function() {
       console.log("success");
     })
     .catch(function() {
       console.log("faill");
     });
  }

}