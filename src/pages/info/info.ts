import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, NavController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  dataSet: any;
  ongKir: any;
  nama: any;
  conv_harga_satuan: any;
  foto: any;
  nama_penyedia: any;
  alamat: any;
  kode_item: any;
  id_penyedia: any;
  kode:any;
  constructor(public viewCtrl: ViewController, 
    public authService: AuthService,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {    
    this.kode = this.navParams.get("pKode");
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      showBackdrop: true,
    })
    loading.present();
    setTimeout(() => { loading.dismiss(); }, 5000);
    this.authService.getAllOrderByKodeBelanja(this.kode).then(result=>{
      this.dataSet = result;
      this.ongKir = this.convertCurr(this.dataSet[0].biaya_kirim);
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