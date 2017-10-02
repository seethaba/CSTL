import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController, LoadingController } from 'ionic-angular';
import {  User } from "../../models/user";
import { AngularFireAuth} from 'angularfire2/auth'; 
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Profile } from "../../models/profile";
import { Match } from "../../models/match";
import * as firebase from 'firebase/app';
import { Facebook } from "@ionic-native/facebook";



/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;
  profileRef$: FirebaseObjectObservable<Profile>;
  matchRef$: FirebaseListObservable<Match[]>;
  currentUserKey = "";

  constructor(private facebook: Facebook, 
    private afAuth: AngularFireAuth, 
    private afDatabase: AngularFireDatabase, 
    private toast: ToastController,
  	public navCtrl: NavController, 
    public navParams: NavParams,
    private modal: ModalController,
    private loader: LoadingController) {


  }

  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(data => {
      if(data)
      {
         this.navCtrl.setRoot('LoggedInHomePage');
      }
      else {
        this.toast.create({
          message: `Please login to continue`,
          duration: 3000
        }).present(); 
      }
    })
  }

  // async login(user: User) {
  // 	try {
  // 		const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  // 		if(result){
  // 			this.navCtrl.setRoot("LoggedInHomePage");
  // 		}
  // 	}
  // 	catch(e) {
  // 		this.toast.create({
		// 	message: `${e.message.replace( /([A-Z])/g, " $1" ).charAt(0).toUpperCase() + e.message.replace( /([A-Z])/g, " $1" ).slice(1)}`,
		// 	duration: 3000
		// }).present();
  // 	}
  	
  // }

  fLogin() {

    this.facebook.login(["email"]).then((loginResponse) => {

      let credential = firebase.auth.FacebookAuthProvider.credential(loginResponse.authResponse.accessToken);

      this.afAuth.auth.signInWithCredential(credential).then((res) => {
        if(res) {
          this.profileRef$ = this.afDatabase.object(`profile/${res.uid}`);
          this.profileRef$.update({
              "displayName": res.displayName, 
              "photoURL": res.photoURL, 
              "email": res.email
            }).then(() => { 
              this.profileRef$.take(1).subscribe(profileData => {
                if(profileData.role && profileData.city && profileData.aboutMe) {
                  this.navCtrl.setRoot('LoggedInHomePage');
                } else {
                  this.navCtrl.setRoot("ProfilePage");  
                }  
              })
            }).catch((e) => {
              this.toast.create({
                message: `Login not successful. Please login to continue`,
                duration: 3000
              }).present(); 
            })
        }
      }).catch((e) => {
        this.toast.create({
          message: `Login not successful. Please login to continue`,
          duration: 3000
        }).present(); 
      })
    }).catch((e) => {
        this.toast.create({
          message: `Login not successful. Please login to continue`,
          duration: 3000
        }).present(); 
      })
  }
    
  register() {
  	this.navCtrl.push('RegisterPage');
  }

  openPrivacy() {
    const privacyModal = this.modal.create('PrivacyPage');
    
    privacyModal.present();
  }

}
