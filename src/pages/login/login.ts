import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  PushSignup: any;
  responseData : any;
  userDetails: any;
  uLat: any;
  uLng: any;
  address: any;
  userData = {"username": "","password": ""};
  userPostData = {"id_user":""};
  dataSet: any;
  categoryData = {};
  password_type: string = 'password';
  splash = true;

  constructor(public navCtrl: NavController, 
    public authService: AuthService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
      this.PushSignup = SignupPage;
  }

  togglePasswordMode() {   
    this.password_type = this.password_type === 'text' ? 'password' : 'text';
  }

  ionViewDidLoad(){
    setTimeout(() => {
      this.splash = false;
    }, 4000);
    let userLogin = localStorage.getItem("userData");
		if(userLogin){
      this.navCtrl.setRoot(HomePage);
    }
  }

  presentToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }

  getRandom(length){
    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
  }

  logIn(){
    if(this.userData.username && this.userData.password){
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        showBackdrop: true
      })
      loading.present();
      setTimeout(() => { loading.dismiss(); }, 5000);
      this.authService.postData(this.userData,'login').then((result) => {
      this.responseData = result;
      if(this.responseData.userData){
        localStorage.setItem('userData', JSON.stringify(this.responseData));
        const data = JSON.parse(localStorage.getItem('userData'));
        this.userDetails = data.userData;
        this.uLat = this.userDetails.lat;
        this.uLng = this.userDetails.lng;
        this.address = this.userDetails.address;
        let saldo: any = this.userDetails.saldo;
        localStorage.setItem('userLocation','{"userLocation":{"lat":"'+this.uLat+'","lng":"'+this.uLng+'","address":"'+this.address+'"}}');  
        localStorage.setItem('userSaldo','{"userSaldo":{"saldo":"'+saldo+'"}}');
        localStorage.setItem('kodeBelanja','{"kodeBelanja":{"kode":"'+this.getRandom(12)+'"}}');
        localStorage.setItem('userBasket','{"userBasket":{"jml":"'+0+'","nominal":"'+0+'"}}');
        this.userPostData.id_user = this.userDetails.id;
        this.authService.postData(this.userPostData,'userOrder').then((result) => {
          this.responseData = result;
          if(this.responseData.userDataOrder){
            this.dataSet = this.responseData.userDataOrder;
            let totalOrder = parseInt(this.dataSet[0].items_total);
            localStorage.setItem('userOrder','{"userOrder":{"total":"'+totalOrder+'"}}');
            localStorage.setItem('userHistoryOrder','{"userHistoryOrder":{"total":"'+totalOrder+'"}}');
          }else{
            localStorage.setItem('userOrder','{"userOrder":{"total":"'+0+'"}}');
            localStorage.setItem('userHistoryOrder','{"userHistoryOrder":{"total":"'+0+'"}}');
          }
        })
        
        loading.dismiss();
        this.navCtrl.setRoot(HomePage);
      }else{
        loading.dismiss();
        this.presentToast("Nama pengguna yang Anda masukkan tidak cocok dengan akun mana saja.");
      }
    }, (err) => {
   });

  }else{
    this.presentToast("Inputan data tidak valid!");
  }}

}