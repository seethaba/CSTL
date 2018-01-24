import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Resources } from "../../models/resources";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

/**
 * Generated class for the GalleryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gallery',
  templateUrl: 'gallery.html',
})
export class GalleryPage {

  galleryRef$: FirebaseListObservable<Resources[]>

  constructor(private browser: InAppBrowser, 
  	private afDatabase: AngularFireDatabase, 
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    private nativePageTransitions: NativePageTransitions) {

  	this.galleryRef$ = this.afDatabase.list(`${this.navParams.get('tournamentName')}/resources`, {
      query: {
        orderByChild: "category",
        equalTo: "Gallery"
      }
	  })
  }

  openWebPage(url: string) {
  	this.browser.create(url, '_self', {location: "no", });
  }

  ionViewWillLeave() {
     let options: NativeTransitionOptions = {
      duration: 200
     };

    this.nativePageTransitions.fade(options);
  }

}
