import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { PilihItemPage } from '../pilih-item/pilih-item';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { HomePage } from '../home/home';
import { BasketPage } from '../basket/basket';

@IonicPage()
@Component({
  selector: 'page-product-merchant',
  templateUrl: 'product-merchant.html',
})
export class ProductMerchantPage {
  penyediaData: any;
  idPenyedia: any;
  namaPenyedia: any;
  penyediaLat: any;
  penyediaLng: any;
  items: any;
  totalBasket:any = 0;
  vTotalBasket:any;
  jmlBasket:any;
  vJmlBasket:any;
  dLat:any;
  dLng:any;
  constructor(public navCtrl: NavController, 
    private sqlite: SQLite,
    public authService: AuthService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
      //get data local
      const dataPenyedia = JSON.parse(localStorage.getItem('penyediaInfo'));
      this.penyediaData = dataPenyedia.penyediaInfo;
      this.idPenyedia = this.penyediaData.id;
      this.namaPenyedia = this.penyediaData.nama;
      this.penyediaLat = this.penyediaData.lat;
      this.penyediaLng = this.penyediaData.lng;

      const dataKeranjang = JSON.parse(localStorage.getItem('userBasket'));
      this.jmlBasket = dataKeranjang.userBasket;
      this.vJmlBasket = this.jmlBasket.jml;  
  }

  ionViewDidLoad() {
    this.getAllProduct();
    this.getData();
  }

  openKeranjang(){
    this.navCtrl.push(BasketPage);
  }

  gotoHome(){
    this.navCtrl.popToRoot();
  }

  confirmChangeMerchant() {
    let alert = this.alertCtrl.create({
      title: 'Keluar Resto?',
      message: 'Semua produk yang ada didalam keranjang Anda akan dikosongkan!',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ya',
          handler: () => {
            // this.kosongkanKeranjang();
            this.navCtrl.push(HomePage);
          }
        }
      ]
    });
    alert.present();
  }

  getAllProduct(){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      showBackdrop: true,
    })
    loading.present();
    setTimeout(() => { loading.dismiss(); }, 5000);
    this.authService.getProductPenyedia(this.idPenyedia).then(result=>{
      this.items = result;
    })
    loading.dismiss();
  }

  kosongkanKeranjang() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM basket', {})
        .then(res => {
          localStorage.setItem('userBasket','{"userBasket":{"jml":"'+0+'"}}');
          this.navCtrl.pop();
        })
    })
  }

  getData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      
      db.executeSql('CREATE TABLE IF NOT EXISTS basket(rowid INTEGER PRIMARY KEY, id_user INT, nama TEXT, menu_kode_item TEXT, qty INT, harga_item INT, keterangan TEXT, lat TEXT, lng TEXT, kode_belanja INT, belanja_id_penyedia INT, address TEXT, metode_pembayaran INT)', {})
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));

      db.executeSql('SELECT SUM(harga_item) AS totalBasket FROM basket', {})
      .then(res => {
        if(this.vJmlBasket == 0){
          this.totalBasket = 0;
        }else{
          this.totalBasket = parseInt(res.rows.item(0).totalBasket);
        }
        this.vTotalBasket = this.convertCurr(this.totalBasket);
      })
      .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  openPilihItem(nama, foto, lat, lng, suka, harga_satuan, nama_penyedia, alamat, kode_item, id, id_penyedia, jml){
    let data = { 
      pNama:nama,
      pFoto:foto, 
      pLat:lat, 
      pLng:lng, 
      pSuka:suka, 
      pHargaSatuan:harga_satuan, 
      pNamaPenyedia:nama_penyedia, 
      pAlamat:alamat, 
      pKodeItem:kode_item, 
      pId:id, 
      pIdPenyedia:id_penyedia,
      pJml:jml
    }
    this.navCtrl.push(PilihItemPage, data);
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

  presentAlert(tit,sub) {
    let alert = this.alertCtrl.create({
      title: tit,
      subTitle: sub,
      buttons: ['Ok']
    });
    alert.present();
  }
}
