import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { Resources } from "../../models/resources";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';


/**
 * Generated class for the NewsdetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-newsdetail',
  templateUrl: 'newsdetail.html',
})
export class NewsdetailPage {

  news = {} as Resources;

  constructor(private browser: InAppBrowser, 
  	private view: ViewController, 
  	public navParams: NavParams,
    private nativePageTransitions: NativePageTransitions) {
  }

  ionViewWillLoad() {
    this.news = this.navParams.get('news');
  }

  closeModal() {
  	this.view.dismiss();
  }

  openWebPage(url: string) {
  	this.browser.create(url, '_self', {location: "no", });
  }

  ionViewWillLeave() {
     let options: NativeTransitionOptions = {
      duration: 500
     };

    this.nativePageTransitions.flip(options);
  }

}
