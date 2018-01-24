import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Profile } from "../../models/profile";
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

/**
 * Generated class for the ShowprofilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-showprofile',
  templateUrl: 'showprofile.html',
})
export class ShowprofilePage {

  profileRef$: FirebaseListObservable<Profile[]>
  teamName = "";

  constructor(private afDatabase: AngularFireDatabase, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    private modal: ModalController,
    private nativePageTransitions: NativePageTransitions) {
  	
  	this.teamName = this.navParams.get("teamName");
  	this.profileRef$ = this.afDatabase.list('profile', {
	  query: {
      orderByChild: `${this.navParams.get('tournamentName')}`,
	    equalTo: this.navParams.get('teamKey')
	  }
	});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowprofilePage');
  }

  openModal(profile: Profile){
    const myModal = this.modal.create('PlayerProfilePage', {profile: profile, teamName: this.teamName, teamLogoUrl: this.navParams.get('teamLogoUrl')});
    
    myModal.present();

  }

  ionViewWillLeave() {
     let options: NativeTransitionOptions = {
      duration: 200
     };

    this.nativePageTransitions.fade(options);
  }

}
