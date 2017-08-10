import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Resources } from "../../models/resources";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

/**
 * Generated class for the NewsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {

  NewsRef$: FirebaseListObservable<Resources[]>
  VideosRef$: FirebaseListObservable<Resources[]>
  newsfeed = "";

  constructor(private browser: InAppBrowser, 
  	private afDatabase: AngularFireDatabase, 
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private modal: ModalController,
    private nativePageTransitions: NativePageTransitions) {

  	this.NewsRef$ = this.afDatabase.list('resources', {
	  query: {
	    orderByChild: "category",
	    equalTo: "News"
	  }

	})

	this.VideosRef$ = this.afDatabase.list('resources', {
	  query: {
	    orderByChild: "category",
	    equalTo: "Videos"
	  }
	})

	this.newsfeed = "cstlnews";
  }

  openWebPage(url: string) {
  	this.browser.create(url, '_self', {location: "no", });
  }

  openModal(news: Resources) {
    const newsModal = this.modal.create('NewsdetailPage', {news: news});
    
    newsModal.present();
  }

  ionViewWillLeave() {
     let options: NativeTransitionOptions = {
      duration: 500
     };

    this.nativePageTransitions.flip(options);
  }

}
