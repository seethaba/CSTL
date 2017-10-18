import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController  } from 'ionic-angular';
import { AngularFireAuth} from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Profile } from "../../models/profile";
import { Subscription } from "rxjs/Subscription";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath, File } from 'ionic-native';
import firebase from 'firebase';

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
  profileRef$: FirebaseObjectObservable<Profile>;
  profileSubscription: Subscription;
  userUid = "";
  nativePath: any;
  imgSource: any;

  constructor(private camera: Camera, 
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase, 
    private toast: ToastController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private modal: ModalController,
    private fileChooser: FileChooser) {

      this.cities = ["Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kancheepuram", "Karur", "Krishnagiri", "Madurai", "Nagapattinam", "Kanyakumari", "Namakkal", "Perambalur", "Pudukottai", "Ramanathapuram", "Salem", "Sivagangai", "Thanjavur", "Theni", "Thiruvallur", "Thiruvarur", "Tuticorin", "Trichirappalli", "Thirunelveli", "Tiruppur", "Thiruvannamalai", "The Nilgiris", "Vellore", "Villupuram", "Virudhunagar"];
      this.userUid = this.afAuth.auth.currentUser.uid;

      this.profileRef$ = this.afDatabase.object(`profile/${this.userUid}`)
      this.profileSubscription = this.profileRef$.subscribe(profile => {
        this.profile = profile;
        this.profile.name = profile.name || profile.displayName;
      });
  }

  createProfile(profile: Profile) {
    if(profile.role && profile.city && profile.aboutMe)
    {
      this.profileRef$.update(profile)
        .then(() => { 
          this.navCtrl.setRoot('LoggedInHomePage');
        }).catch((e) => {
          // alert(e.message);
          this.toast.create({
            message: `There was an Error. Please try again.`,
            duration: 7000
          }).present();
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

  async takePhoto(sourceType) {
    try {
      const options: CameraOptions = {
        quality: 95,
        targetHeight: 100,
        targetWidth: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        allowEdit: true,
        sourceType: sourceType == 'Lib' ? this.camera.PictureSourceType.PHOTOLIBRARY : this.camera.PictureSourceType.CAMERA
      }
  
      const result = await this.camera.getPicture(options);

      const image = `data:image/jpeg;base64,${result}`;

      const pictures = firebase.storage().ref(`pictures/${this.userUid}/profilepic.jpg`);
      pictures.putString(image, 'data_url').then(savedPicture => {
        // Add code to remove the old profile picture from storage
        // let removePicUrl = this.profile.appPicUrl;
        // Check if this replaces the existing file

        // Save the new picture to the profile
        this.profilePictureUploadSuccess(savedPicture);
      });
    }
    catch(e) {
      this.profilePictureUploadFailure(e);
    }
  }

  ionViewWillLeave() {
  	this.profileSubscription.unsubscribe();
  }

  profilePictureUploadSuccess(savedPicture) {
    this.profileRef$.update({appPicUrl: savedPicture.downloadURL});
    
    this.toast.create({
      message: `Profile picture changed successfully`,
      duration: 5000
    }).present();
  }

  profilePictureUploadFailure(err) {
    console.error(err.message);

    this.toast.create({
      message: `Profile picture was not updated`,
      duration: 5000
    }).present();
  }

}
