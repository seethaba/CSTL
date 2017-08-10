import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import {User } from "../../models/user";
import {AngularFireAuth} from 'angularfire2/auth';


/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;

  constructor(private afAuth: AngularFireAuth, private toast: ToastController,
  	public navCtrl: NavController, public navParams: NavParams) {
  }

  
  backToLogin() {
    this.navCtrl.push("LoginPage");
  }

  async register(user: User) {
  	try {
  		const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);	
  		if(result){
  			this.toast.create({
  				message: "You have successfully registered to CSTL.",
  				duration: 3000
  			}).present();
  			this.navCtrl.push("LoginPage");
  		}
  	}
  	catch(e) {
  		this.toast.create({
  				message: `There was error with your registration. ${e.message.replace( /([A-Z])/g, " $1" ).charAt(0).toUpperCase() + e.message.replace( /([A-Z])/g, " $1" ).slice(1)}`,
  				duration: 10000
  			}).present();
  	}
  	
  }

}
