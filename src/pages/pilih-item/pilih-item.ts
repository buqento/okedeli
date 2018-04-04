import { Component, ViewChild, ElementRef  } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Geolocation } from '@ionic-native/geolocation';
import { BasketPage } from '../basket/basket';
import { UlasanPage } from '../ulasan/ulasan';
import { ProductMerchantPage } from '../product-merchant/product-merchant';

@IonicPage()
@Component({
  selector: 'page-pilih-item',
  templateUrl: 'pilih-item.html',
})
export class PilihItemPage {
  userDataBasket:any;
  userDetails:any;
  userLocation:any;
  userSaldos:any;
  updateSaldo:any;
  kodeBelanja:any;
  penyediaData:any;
  idPenyedia:any;
  penyediaLat:any;
  penyediaLng:any;
  nama:any;
  hargaSatuan:any;
  vHargaSatuan:any;
  hargaItem:any;
  foto:any;
  hrg:any;
  menu_kode_item:any;
  dLat:any;
  dLng:any;
  alamatPenjual:any;
  namaPenyedia:any;
  minus:boolean = false;
  vQty:any = 1;
  data = { 
    qty:1, 
    keterangan:"",
  }

  @ViewChild('map') mapRef:ElementRef;
  constructor(public navCtrl: NavController,
    private sqlite: SQLite,
    public geolocation: Geolocation,
    public alertCtrl: AlertController,
    public navParams: NavParams) {

      //get data local
      const dataPenyedia = JSON.parse(localStorage.getItem('penyediaInfo'));
      this.penyediaData = dataPenyedia.penyediaInfo;
      this.idPenyedia = this.penyediaData.id;
      this.namaPenyedia = this.penyediaData.nama;
      this.penyediaLat = this.penyediaData.lat;
      this.penyediaLng = this.penyediaData.lng;

      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      const dataLocation = JSON.parse(localStorage.getItem('userLocation'));
      this.userLocation = dataLocation.userLocation;
      const dataKodeBelanja = JSON.parse(localStorage.getItem('kodeBelanja'));
      this.kodeBelanja = dataKodeBelanja.kodeBelanja;

      const dataSaldo = JSON.parse(localStorage.getItem('userSaldo'));
      this.userSaldos = dataSaldo.userSaldo;
      this.updateSaldo = this.convertCurr(this.userSaldos.saldo);

      this.nama = this.navParams.get('pNama');
      this.hargaSatuan = this.navParams.get('pHargaSatuan');
      this.vHargaSatuan = this.convertCurr(this.hargaSatuan);
      this.menu_kode_item = this.navParams.get('pKodeItem');
      this.dLat = this.navParams.get('pLat');
      this.dLng = this.navParams.get('pLng');      
      this.alamatPenjual = this.navParams.get('pAlamat');
      this.namaPenyedia = this.navParams.get('pNamaPenyedia');
      this.foto = this.navParams.get('pFoto');
      this.hitung(); 
  }

  getUlasan(kode_item, nama_produk, id_penyedia){
    let data = { kodeItem: kode_item, namaProduk: nama_produk, idPenyedia: id_penyedia}
    this.navCtrl.push(UlasanPage, data);
  }

  checkBasket(){
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      // memeriksa kode_item pada tabel
      db.executeSql('SELECT belanja_id_penyedia FROM basket WHERE belanja_id_penyedia=?', [this.idPenyedia])
      .then(res => {
        if(res.rows.length < 1) {
          db.executeSql('DELETE FROM basket', {});
          localStorage.setItem('userBasket','{"userBasket":{"jml":"'+0+'"}}');
          this.saveData();
        }else{
          this.saveData();
        }
      })
    })
  }

  saveData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      // memeriksa kode_item pada tabel
      db.executeSql('SELECT rowid FROM basket WHERE menu_kode_item=?', [this.menu_kode_item])
      .then(res => {
        if(res.rows.length>0) {
          this.presentAlert('Ups!','Anda telah memilih produk ini sebelumnya.');
          this.navCtrl.push(BasketPage);
        }else{
          db.executeSql('INSERT INTO basket VALUES(NULL,?,?,?,?,?,?,?,?,?,?,?,?)',
          [this.userDetails.id, this.nama, this.menu_kode_item, this.data.qty, this.hrg,
            this.data.keterangan, this.userLocation.lat, this.userLocation.lng, this.kodeBelanja.kode,
            this.idPenyedia, this.userLocation.address, 0])
            .then(() => {
              this.showConfirm();
              //Update jumlah data keranjang
              const dataBasket = JSON.parse(localStorage.getItem('userBasket'));
              this.userDataBasket = dataBasket.userBasket;
              let jmlBasket = parseInt(this.userDataBasket.jml) + 1;
              localStorage.setItem('userBasket','{"userBasket":{"jml":"'+jmlBasket+'"}}');
            })
        }
      })
    })
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Yeah!',
      message: 'Produk telah ditambahkan ke dalam keranjang.',
      buttons: [
        {
          text: 'Ok',          
          handler: () => {
            this.navCtrl.push(ProductMerchantPage);
          }
        },
        {
          text: 'Lihat Keranjang',
          handler: () => {
            this.navCtrl.push(BasketPage);
          }
        }
      ]
    });
    confirm.present();
  }

  presentAlert(tit,sub) {
    let alert = this.alertCtrl.create({
      title: tit,
      subTitle: sub,
      buttons: ['Ok']
    });
    alert.present();
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

  getRandom(length){
    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
  }

  tambah(){
    this.data.qty ++;
    let jml:any = this.data.qty;
    this.vQty = jml;
    if(jml > 1){
      this.minus = true;
    }
  }

  kurang(){
    this.data.qty --;
    let jml:any = this.data.qty;
    this.vQty = jml;
    if(jml < 2){
      this.minus = !this.minus;
    }
  }

  hitung(){
    let jml:any = this.data.qty;
    this.hrg = jml * parseInt(this.hargaSatuan);
    this.hargaItem = this.convertCurr(this.hrg);
  }

}