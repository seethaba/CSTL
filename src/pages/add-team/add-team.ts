import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Team } from "../../models/team";
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';



/**
 * Generated class for the AddTeamPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-team',
  templateUrl: 'add-team.html',
})
export class AddTeamPage {

  team = {} as Team;
  teamRef$: FirebaseListObservable<Team[]>

  constructor(private afDatabase: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, private nativePageTransitions: NativePageTransitions) {
  	this.teamRef$ = this.afDatabase.list('team');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTeamPage');
  }

  addTeam(team: Team) {
  	this.teamRef$.push({
  		name: this.team.name, 
  		logoUrl: this.team.logoUrl
  	})

  	this.team = {} as Team;
  	this.navCtrl.pop();
  }

  ionViewWillLeave() {
    let options: NativeTransitionOptions = {
      duration: 500
     };

    this.nativePageTransitions.flip(options)
     .then(function() {
       console.log("success");
     })
     .catch(function() {
       console.log("faill");
     });
  }

}
