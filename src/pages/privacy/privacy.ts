import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PrivacyPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-privacy',
  templateUrl: 'privacy.html',
})
export class PrivacyPage {

  constructor(private view: ViewController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivacyPage');
  }

  closeModal()
  {
  	this.view.dismiss();
  }

}
