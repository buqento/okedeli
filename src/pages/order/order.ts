import { Component } from '@angular/core';
import { IonicPage, NavController, Events, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { InfoPage } from '../info/info';
import { UlasanPage } from '../ulasan/ulasan';

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  userDetails : any;
  responseData : any;
  dataSet : any;
  kodeBelanja: any;
  totalPembayaran: any;
  userPostData = {"id_user":""};
  empty:boolean = true;
  konten:boolean = true;
  pushUlasan: any;

  constructor(public events: Events, 
    public navCtrl: NavController, 
    public toastController:ToastController, 
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public authService: AuthService) {
    this.pushUlasan = UlasanPage;
    
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;
 
    this.getOrder();
  }

  gotoHome(){
    this.navCtrl.setRoot(HomePage);
  }

  openInfo(nama, conv_harga_satuan, foto, nama_penyedia, alamat, kode_item, id_penyedia) {
    let infoModal = this.modalCtrl.create(InfoPage, 
      { pNama: nama, 
        pHargaSatuan: conv_harga_satuan, 
        pFoto: foto,
        pNamaPenyedia: nama_penyedia,
        pAlamat: alamat,
        pKodeItem: kode_item,
        pIdPenyedia: id_penyedia
      })
    infoModal.present();
  }

  detailOrder(kode) {
    let data = {
      pKode:kode
    }
    this.navCtrl.push(InfoPage, data)
  }

  getOrder(){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      showBackdrop: true,
    })
    loading.present();
    setTimeout(() => { loading.dismiss(); }, 5000);
    this.authService.getAllOrder(this.userDetails.id).then(res=>{
      this.dataSet = res;
    })
    loading.dismiss();
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