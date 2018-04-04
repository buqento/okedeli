import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ProductMerchantPage } from '../product-merchant/product-merchant';
import { SuksesPage } from '../sukses/sukses';
import { DepositPage } from '../deposit/deposit';
import { AlamatPage } from '../alamat/alamat';

@IonicPage()
@Component({
  selector: 'page-basket',
  templateUrl: 'basket.html',
})
export class BasketPage {
  pushMap:any;
  userDataBasket:any;
  userDetails:any;
  userLocation:any;
  penyediaData:any;
  updateSaldo:any;
  userSaldos:any;
  idPenyedia:any;
  namaPenyedia:any;
  vJmlBasket:any;
  jmlBasket:any;
  items:any;
  baskets:any = [];
  vLat:any;
  vLng:any;
  vAlamat:any;
  lat:any;
  penyediaLat:any;
  penyediaLng:any;
  google:any;
  metode:boolean = true;
  metodeBayar:boolean;
  empty:boolean = true;
  konten:boolean = true;
  footer: boolean = true;
  alamatPengiriman:any;
  mBayar:any;
  ongKir:any;
  vOngKir:any;
  totalBasket: any;
  vTotalBasket: any;
  totBayar:any;
  vTotBayar:any;
  kodeBelanja:any;
  saldoSekarang:any;
  userPostData = {
    "id_user":1, 
    "menu_kode_item":"001", 
    "qty":1, 
    "harga_item":0, 
    "keterangan":"ok deh", 
    "lat":"", 
    "lng":"", 
    "kode_belanja":0, 
    "belanja_id_penyedia":1, 
    "address":"",
    "metode_pembayaran":0
  }
  postSaldo = {
    "id_user":"",
    "saldo":0
  }
  userPostOngkir = {
    "ongkir_kode_belanja":"",
    "biaya_kirim":0
  }
  constructor(public navCtrl: NavController, 
    private sqlite: SQLite,
    public authService: AuthService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public navParams: NavParams) {

      this.pushMap = AlamatPage;
      //get data local
      const dataPenyedia = JSON.parse(localStorage.getItem('penyediaInfo'));
      this.penyediaData = dataPenyedia.penyediaInfo;
      this.idPenyedia = this.penyediaData.id;
      this.namaPenyedia = this.penyediaData.nama;
      this.penyediaLat = this.penyediaData.lat;
      this.penyediaLng = this.penyediaData.lng;

      const dataSaldo = JSON.parse(localStorage.getItem('userSaldo'));
      this.userSaldos = dataSaldo.userSaldo;
      this.updateSaldo = this.convertCurr(this.userSaldos.saldo);

      const dataKodeBelanja = JSON.parse(localStorage.getItem('kodeBelanja'));
      this.kodeBelanja = dataKodeBelanja.kodeBelanja;

      const dataLocation = JSON.parse(localStorage.getItem('userLocation'));
      this.userLocation = dataLocation.userLocation;
      this.vLat = this.userLocation.lat;
      this.vLng = this.userLocation.lng;
      this.vAlamat = this.userLocation.address;

  }

  ionViewDidLoad() {
    this.distance(this.vLat, this.vLng, parseFloat(this.penyediaLat), parseFloat(this.penyediaLng), "K").then(data=>{
      let biayaKirim: any;
      let jarak: any = data;
      if(jarak >= 2){
        biayaKirim = 2500 * parseInt(jarak);
      }else{
        biayaKirim = 5000;
      }
      this.ongKir = biayaKirim;
      this.vOngKir = this.convertCurr(this.ongKir);

    })

    const dataKeranjang = JSON.parse(localStorage.getItem('userBasket'));
    this.jmlBasket = dataKeranjang.userBasket;
    let jml = parseInt(this.jmlBasket.jml);  
    if(jml < 1){
      this.konten = !this.konten;
      this.footer = !this.footer;
    }else{
      this.empty = !this.empty;
      this.getAllProduct();
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      if(this.userDetails.metode_pembayaran != 2){
        this.metode = !this.metode;
      }


    }
  }

  ionViewWillEnter() {
    this.getData();
  }

  getRandom(length){
    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
  }

  distance(lat1, lon1, lat2, lon2, unit) {
    return new Promise(resolve => {
      var radlat1 = Math.PI * lat1/180
      var radlat2 = Math.PI * lat2/180
      var theta = lon1-lon2
      var radtheta = Math.PI * theta/180
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist)
      dist = dist * 180/Math.PI
      dist = dist * 60 * 1.1515
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      resolve(dist);
    });
  }

  getAllProduct(){
    this.authService.getProductPenyedia(this.idPenyedia).then(result=>{
      this.items = result;
    })
  }

  confirmPay() {
    let alert = this.alertCtrl.create({
      title: 'Pembayaran',
      message: 'Lakukan pembayaran semua produk?',
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
            this.pay();
          }
        }
      ]
    });
    alert.present();
  }

  pay(){

    const dataLocation = JSON.parse(localStorage.getItem('userLocation'));
    this.userLocation = dataLocation.userLocation;
    this.lat = this.userLocation.lat;
    if(this.lat != 0){
      
      if(this.metodeBayar == true){
        this.mBayar = 2;
        this.saveData();
      }else{
        if(parseInt(this.userSaldos.saldo) < parseInt(this.totBayar)){
          this.navCtrl.push(DepositPage);
        }else{
          this.mBayar = 0;
          //update user saldo
          this.saldoSekarang = parseInt(this.userSaldos.saldo) - parseInt(this.totBayar);
          localStorage.setItem('userSaldo','{"userSaldo":{"saldo":"'+this.saldoSekarang+'"}}');
          this.postSaldo.saldo = this.saldoSekarang;
          this.postSaldo.id_user = this.userDetails.id;
          this.authService.postData(this.postSaldo,'updateSaldo');
          this.saveData();
        }
      }

    }else{
      this.navCtrl.push(AlamatPage);
    }
    
  }

  saveData(){
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM basket ORDER BY rowid DESC', {})
      .then(res => {
        //add data to table basket
        for(var i=0; i<res.rows.length; i++) {
          this.userPostData.id_user = res.rows.item(i).id_user;
          this.userPostData.menu_kode_item = res.rows.item(i).menu_kode_item;
          this.userPostData.qty = res.rows.item(i).qty;
          this.userPostData.harga_item = res.rows.item(i).harga_item;
          this.userPostData.keterangan = res.rows.item(i).keterangan;
          this.userPostData.lat = res.rows.item(i).lat;
          this.userPostData.lng = res.rows.item(i).lng;
          this.userPostData.kode_belanja = res.rows.item(i).kode_belanja;
          this.userPostData.belanja_id_penyedia = this.idPenyedia;
          this.userPostData.address = res.rows.item(i).address;
          this.userPostData.metode_pembayaran = this.mBayar;
          this.authService.postData(this.userPostData, 'addToBelanja');
        }
        //add data to table ongkir
        this.userPostOngkir.biaya_kirim = this.ongKir;
        this.userPostOngkir.ongkir_kode_belanja = this.kodeBelanja.kode;
        this.authService.postData(this.userPostOngkir,'addOngkir');
        this.prepareNewOrder();
        this.navCtrl.setRoot(SuksesPage);
      })
      .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  prepareNewOrder() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM basket', {})
        .then(() => {
            //generate kode belanja
            localStorage.setItem('kodeBelanja','{"kodeBelanja":{"kode":"'+this.getRandom(12)+'"}}');
            //update jumlah data keranjang
            localStorage.setItem('userBasket','{"userBasket":{"jml":"0"}}');
        })
    })
  }

  openProduct(){
    let data = {
      pIdPenyedia:this.idPenyedia,
      pNamaPenyedia:this.namaPenyedia,
    }
    this.navCtrl.push(ProductMerchantPage, data)
  }
  
  getData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('SELECT * FROM basket ORDER BY rowid DESC', {})
      .then(res => {
        this.baskets = [];
        for(var i=0; i<res.rows.length; i++) {
          this.baskets.push({rowid:res.rows.item(i).rowid,
            id_user: res.rows.item(i).id_user,
            nama: res.rows.item(i).nama,
            menu_kode_item: res.rows.item(i).menu_kode_item,
            qty: res.rows.item(i).qty,
            harga_item: this.convertCurr(res.rows.item(i).harga_item),
            keterangan: res.rows.item(i).keterangan,
            lat: res.rows.item(i).lat,
            lng: res.rows.item(i).lng,
            kode_belanja: res.rows.item(i).kode_belanja,
            belanja_id_penyedia: res.rows.item(i).belanja_id_penyedia,
            address: res.rows.item(i).address,
            metode_pembayaran: res.rows.item(i).metode_pembayaran})
        }
      })
      .catch(e => console.log(e));
      db.executeSql('SELECT SUM(harga_item) AS totalBasket FROM basket', {})
      .then(res => {
        if(res.rows.length>0) {
          this.totalBasket = parseInt(res.rows.item(0).totalBasket);
        }else{
          this.totalBasket = 0;
        }
        this.vTotalBasket = this.convertCurr(this.totalBasket);
        this.totBayar = this.totalBasket + this.ongKir;
        this.vTotBayar = this.convertCurr(this.totBayar);
      })
      .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  deleteData(rowid) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM basket WHERE rowid=?', [rowid])
      .then(res => {
          //Update jumlah data keranjang
          const dataBasket = JSON.parse(localStorage.getItem('userBasket'));
          this.userDataBasket = dataBasket.userBasket;
          let jmlBasket = parseInt(this.userDataBasket.jml) - 1;
          localStorage.setItem('userBasket','{"userBasket":{"jml":"'+jmlBasket+'"}}');
          if(jmlBasket < 1){
            this.openProduct();
          }else{
            this.getData();
          }
      })
      .catch(e => console.log(e));
    }).catch(e => console.log(e));
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
