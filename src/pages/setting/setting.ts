import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { DepositPage } from '../deposit/deposit';
import { BantuanPage } from '../bantuan/bantuan';
import { MapPage } from '../map/map';
import { LoginPage } from '../login/login';
import { OrderPage } from '../order/order';
import { PetaPage } from '../peta/peta';

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  pushDeposit: any;
  pushBantuan: any;
  pushMap: any;
  pushHistory: any;
  userDetails: any;
  pushOrder: any;
  userLokasi: any;
  userSaldos: any;
  vAlamat: any;
  userLocation: any;
  saldoNow: any;
  constructor(public navCtrl: NavController) {
      this.pushDeposit = DepositPage;
      this.pushBantuan = BantuanPage;
      this.pushMap = PetaPage;
      this.pushOrder = OrderPage;
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      const dataSaldo = JSON.parse(localStorage.getItem('userSaldo'));
      this.userSaldos = dataSaldo.userSaldo;
      this.saldoNow = this.convertCurr(this.userSaldos.saldo);
      const dataLokasi = JSON.parse(localStorage.getItem('userLocation'));
      this.userLokasi = dataLokasi.userLocation;
      this.vAlamat = this.userLokasi.address;
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

  logOut(){
    localStorage.clear();
    this.navCtrl.setRoot(LoginPage);
  }

}