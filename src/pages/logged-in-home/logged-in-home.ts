import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

/**
 * Generated class for the LoggedInHomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-logged-in-home',
  templateUrl: 'logged-in-home.html',
})
export class LoggedInHomePage {

  constructor(
    private afAuth: AngularFireAuth,
  	public navCtrl: NavController, 
    public navParams: NavParams,
    private nativePageTransitions: NativePageTransitions) {
    
  }

  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(data => {
    	if(data)
    	{
        // Do Nothing
    	}
    	else {
	    	this.navCtrl.push('LoginPage');
    	}
    	
    })
  }

  ionViewWillLeave() {
     let options: NativeTransitionOptions = {
      duration: 200
     };

    this.nativePageTransitions.fade(options);
  }

  logout() {
    this.afAuth.auth.signOut();
    this.navCtrl.setRoot("LoginPage");  
  }

  routeToPage(page) {
    this.navCtrl.push(page);
  }
}
