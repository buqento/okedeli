import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  userDetails: any;
  uLat: any;
  uLng: any;
  responseData : any;
  userData = {"username": "","password": "", "name": "","email": "", "phone":""};
  password_type: string = 'password';
  constructor(public navCtrl: NavController, 
    public authService: AuthService, 
    public toastController: ToastController,
    public loadingCtrl: LoadingController) {
  }

  togglePasswordMode() {   
    this.password_type = this.password_type === 'text' ? 'password' : 'text';
  }

  presentToast(msg) {
    let toast = this.toastController.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.onDidDismiss(() => {
      // console.log('Dismissed toast');
    });
    toast.present();
  }

  getRandom(length){
    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
  }

  signup(){
    if(this.userData.username && this.userData.password && this.userData.name && this.userData.email && this.userData.phone){
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        showBackdrop: true
      })
      loading.present();
      setTimeout(() => { loading.dismiss(); }, 5000);
      this.authService.postData(this.userData,'signup').then((result) => {
      this.responseData = result;
        if(this.responseData.userData){
            localStorage.setItem('userData', JSON.stringify(this.responseData));
            const data = JSON.parse(localStorage.getItem('userData'));
            this.userDetails = data.userData;
            this.uLat = this.userDetails.lat;
            this.uLng = this.userDetails.lng;
            let saldo: any = this.userDetails.saldo;
            localStorage.setItem('userLocation','{"userLocation":{"lat":"'+this.uLat+'","lng":"'+this.uLng+'"}}');
            localStorage.setItem('userSaldo','{"userSaldo":{"saldo":"'+saldo+'"}}');
            localStorage.setItem('kodeBelanja','{"kodeBelanja":{"kode":"'+this.getRandom(12)+'"}}');
            localStorage.setItem('userBasket','{"userBasket":{"jml":"'+0+'","nominal":"'+0+'"}}');
            localStorage.setItem('userOrder','{"userOrder":{"total":"'+0+'"}}');
            localStorage.setItem('userHistoryOrder','{"userHistoryOrder":{"total":"'+0+'"}}');
            this.navCtrl.setRoot(HomePage);
        }else{ 
          this.presentToast("Nama pengguna atau email yang Anda masukkan telah terdaftar.");
        }
        loading.dismiss();
      }, (err) => {
        // Error log
      })
    }else{
      this.presentToast("Inputan data tidak valid!");
    }
  }

  login(){
    this.navCtrl.pop();
  }

}