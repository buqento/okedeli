import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { SettingPage } from '../setting/setting';

@IonicPage()
@Component({
  selector: 'page-deposit',
  templateUrl: 'deposit.html',
})
export class DepositPage {
  userDetails: any;
  userDataSaldo: any;
  kodeVoucher: any;
  responseData: any;
  updateSaldo: any;
  valSaldo: any;
  vSaldo: any;
  dataSet: any;
  userPostData = {"kodeVoucher":"", "idUser":"", "userSaldo":"", "valSaldo":""}

  constructor(public alertCtrl: AlertController, 
    public navCtrl: NavController, 
    public authService: AuthService, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController) {
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;    
      const dataSaldo = JSON.parse(localStorage.getItem('userSaldo'));
      this.userDataSaldo = dataSaldo.userSaldo;
      this.vSaldo = this.convertCurr(this.userDataSaldo.saldo);
  }

  presentToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  showAlert(saldo) {
    let alert = this.alertCtrl.create({
      title: 'Yeah!',
      subTitle: 'Isi ulang deposit berhasil. Saldo anda sekarang <strong>Rp.'+this.convertCurr(saldo)+'</strong>',
      buttons: ['OK']
    });
    alert.present();
  }

  validasi(){
    if(this.kodeVoucher){
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        showBackdrop: true
      })
      loading.present();
      this.userPostData.kodeVoucher = this.kodeVoucher;
      this.userPostData.idUser = this.userDetails.id;
      this.userPostData.userSaldo = this.userDataSaldo.saldo;
      this.authService.postData(this.userPostData,'voucherData').then((result) => {
        this.responseData = result;
        this.dataSet = this.responseData.dataVoucher;
        if(this.responseData.dataVoucher){
          //update deposit database
          this.userPostData.valSaldo = this.dataSet[0].nominal;
          this.authService.postData(this.userPostData,'updateSaldoUser');
          //update deposit localstorage
          this.updateSaldo = parseInt(this.userDataSaldo.saldo) + parseInt(this.dataSet[0].nominal);
          localStorage.setItem('userSaldo','{"userSaldo":{"saldo":"'+this.updateSaldo+'"}}');
          this.vSaldo = this.convertCurr(this.updateSaldo);
          this.showAlert(this.updateSaldo);
          this.navCtrl.push(SettingPage, {saldo:this.vSaldo});
        }else{
          this.presentToast("Kode voucher tidak valid.")
        }
        loading.dismiss();
      });
    }else{
      this.presentToast("Masukkan kode voucher.")
    }

  }

  convertCurr(angka){
    var rev     = parseInt(angka, 10).toString().split('').reverse().join('');
    var rev2    = '';
    for(var i = 0; i < rev.length; i++){
        rev2  += rev[i];
        if((i + 1) % 3 === 0 && i !== (rev.length - 1)){
            rev2 += ',';
        }
    }
    return rev2.split('').reverse().join('');
  }

}