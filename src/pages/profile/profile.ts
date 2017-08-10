import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController  } from 'ionic-angular';
import { AngularFireAuth} from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Profile } from "../../models/profile";
import { Team } from "../../models/team";

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  profile = {} as Profile;
  cities = [];  
  TeamRef$: FirebaseListObservable<Team[]>

  constructor(private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, private toast: ToastController,
  	public navCtrl: NavController, public navParams: NavParams,
    private modal: ModalController) {
    this.cities = ["Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kancheepuram", "Karur", "Krishnagiri", "Madurai", "Nagapattinam", "Kanyakumari", "Namakkal", "Perambalur", "Pudukottai", "Ramanathapuram", "Salem", "Sivagangai", "Thanjavur", "Theni", "Thiruvallur", "Thiruvarur", "Tuticorin", "Trichirappalli", "Thirunelveli", "Tiruppur", "Thiruvannamalai", "The Nilgiris", "Vellore", "Villupuram", "Virudhunagar"];
    this.TeamRef$ = this.afDatabase.list('team'); 
  }

  ionViewDidLoad() {
    this.toast.create({
			message: `Please complete your profile`,
			duration: 3000
		}).present();
  }

  createProfile() {
    if((this.profile.role != 'Player' && this.profile.city && this.profile.aboutMe) || (this.profile.role == 'Player' && this.profile.position && this.profile.city && this.profile.aboutMe && this.profile.teamKey))  
    {
      this.afAuth.authState.take(1).subscribe(auth => {
  
      this.afDatabase.object(`profile/${auth.uid}`).update(this.profile)
        .then(() => { 
          this.navCtrl.setRoot('LoggedInHomePage');
        }).catch((e) => {
          alert(e.message);
        })
      })
    } else {
      this.toast.create({
        message: `Please enter all the information before continuing to the homepage`,
        duration: 7000
      }).present();
    }
  	
  }

  openPrivacy() {
    const privacyModal = this.modal.create('PrivacyPage');
    
    privacyModal.present();
  }

}
