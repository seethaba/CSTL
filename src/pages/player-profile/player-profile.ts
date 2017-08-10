import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { Profile } from "../../models/profile";
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

/**
 * Generated class for the PlayerProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-player-profile',
  templateUrl: 'player-profile.html',
})
export class PlayerProfilePage {

  profile = {} as Profile;
  teamName = "";
  teamLogoUrl = "";

  constructor(private view: ViewController, private navParams: NavParams,
    private nativePageTransitions: NativePageTransitions) {
  }

  ionViewWillLoad() {
  	this.profile = this.navParams.get('profile');
  	this.teamName = this.navParams.get('teamName');
  	this.teamLogoUrl = this.navParams.get('teamLogoUrl');
  }

  closeModal() {
  	this.view.dismiss();
  }

  ionViewWillLeave() {
     let options: NativeTransitionOptions = {
      duration: 500
     };

    this.nativePageTransitions.flip(options);
  }

}
