import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-ulasan',
  templateUrl: 'ulasan.html',
})
export class UlasanPage {
  productPostData = {"menu_kode_item":""};
  ulasanData = {"kode_item":"", "komentar":""};
  ulasanPostData = {"nama_pengguna":"", "menu_kode_item":"", "komentar":"", "diskusi_id_penyedia":""};
  responseData: any;
  dataSet: any;
  vNama_produk: any;
  userDetails: any;
  constructor(public navCtrl: NavController, 
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public authService: AuthService,
    public navParams: NavParams,) {
      let kode_item = this.navParams.get('kodeItem');
      let nama_produk = this.navParams.get('namaProduk');
      this.getUlasan(kode_item);
      this.vNama_produk = nama_produk;
  }

  getUlasan(kode_item){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      showBackdrop: true,
    })
    loading.present();
    setTimeout(() => { loading.dismiss(); }, 5000);
    this.ulasanPostData.menu_kode_item = this.navParams.get('kodeItem');
    this.authService.postData(this.ulasanPostData, 'productUlasan').then(result=>{
      this.responseData = result;
      this.dataSet = this.responseData.productUlasan;
    })
    loading.dismiss();
  }

  postUlasan(){
    if(this.ulasanPostData.komentar){
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      let menu_kode_item = this.navParams.get('kodeItem');
      this.ulasanPostData.menu_kode_item = menu_kode_item;
      this.ulasanPostData.diskusi_id_penyedia = this.navParams.get('idPenyedia');
      this.ulasanPostData.nama_pengguna = this.userDetails.full_name;
      this.authService.postData(this.ulasanPostData, 'addUlasan').then((result)=>{
        this.responseData = result;
        if(this.responseData.success){
          this.getUlasan(menu_kode_item);
          this.ulasanPostData.komentar = "";
        }
      })
    }else{
      let toast = this.toastCtrl.create({
        message: 'Masukkan ulasan Anda!',
        duration: 1000,
        position: 'top'
      })
      toast.present()
    }
  }

}
