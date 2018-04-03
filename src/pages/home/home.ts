import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { PenyediaPage } from '../penyedia/penyedia';
import { KategoriPage } from '../kategori/kategori';
import { OrderPage } from '../order/order';
import { BantuanPage } from '../bantuan/bantuan';
import { SettingPage } from '../setting/setting';
import { ProductMerchantPage } from '../product-merchant/product-merchant';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  PushBantuan: any;
  PushSetting: any;
  produk: string = "populer";
  isAndroid: boolean = false;
  userDetails: any;
  kodeBelanja: any;
  responseData: any;
  dataSet: any;
  dataSetPenyedia: any;
  dataKeranjang: any;
  jmlBasket: any;
  vJmlBasket: any;
  userLocation: any;
  productPostData = {"kategori":"", "id":"", "kodeBelanja":"", "id_user":"", "penyedia_id":""};
  slideData = {};
  productPenyedia = {};
  userData = {"user_lat":"", "user_lng":""};
  kategoriArray: any = [];
  imageArray: any = [];
  items: any;

  constructor(platform: Platform, 
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, 
    public navCtrl: NavController, 
    public geolocation: Geolocation,
    public authService: AuthService){
      this.PushSetting = SettingPage;
      this.PushBantuan = BantuanPage;
      this.isAndroid = platform.is('android');    
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      const dataKodeBelanja = JSON.parse(localStorage.getItem('kodeBelanja'));
      this.kodeBelanja = dataKodeBelanja.kodeBelanja;
      this.productPostData.kodeBelanja = this.kodeBelanja.kode;
      this.productPostData.id_user = this.userDetails.id;
      const dataKeranjang = JSON.parse(localStorage.getItem('userBasket'));
      this.jmlBasket = dataKeranjang.userBasket;
      this.vJmlBasket = this.jmlBasket.jml;  
      this.imageArray = 
      [{"id":"1","image_url":"https://okedeli.com/apps/slide/s1.png"},
      {"id":"2","image_url":"https://okedeli.com/apps/slide/s2.png"},
      {"id":"3","image_url":"https://okedeli.com/apps/slide/s3.png"},
      {"id":"4","image_url":"https://okedeli.com/apps/slide/s4.png"}]  
  }

  ionViewDidLoad(){
    this.getAllCategory();
    this.getProduct();
    this.getNearby();
    this.getAllPenyedia();
  }

  openProduct(idPenyedia, namaPenyedia, lat, lng){
    localStorage.setItem('penyediaInfo','{"penyediaInfo":{"id":"'+idPenyedia+'","nama":"'+namaPenyedia+'","lat":"'+lat+'","lng":"'+lng+'"}}');
    let data = {
      pIdPenyedia:idPenyedia,
      pNamaPenyedia:namaPenyedia,
      pLat:lat,
      pLng:lng
    }
    this.navCtrl.push(ProductMerchantPage, data)
  }
  
  getAllCategory(){
    this.authService.postData(this.productPostData,'getAllCategory').then((result)=>{
      this.responseData = result;
      this.kategoriArray = this.responseData.categoryData;
    })
  }

  doRefresh(refresher){
    this.getProduct();
    refresher.complete();
  }

  getProduct(){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      showBackdrop: true
    })
    loading.present();
    setTimeout(() => { loading.dismiss(); }, 5000);
    this.authService.postData(this.productPostData,'getNewProduct').then((result) => {
      this.responseData = result;
      this.dataSet = this.responseData.newproductData;
      loading.dismiss();
    });
  }

  getAllPenyedia(){
    this.authService.getPenyedia().then(result=>{
      this.items = result;
    })
  }

  getNearby(){
    const dataLocation = JSON.parse(localStorage.getItem('userLocation'));
    this.userLocation = dataLocation.userLocation;
    this.userData.user_lat = this.userLocation.lat; 
    this.userData.user_lng = this.userLocation.lng;
    this.authService.postData(this.userData,'getNearby').then((result) => {
        this.responseData = result;
        this.dataSetPenyedia = this.responseData.dataNearby;
    });
  }

  getProductCategory(kategori, judul){
    let data1 = { dt1: kategori, dt2: judul }
    this.navCtrl.push(KategoriPage, data1);
  }

  getProductPenyedia(id, nama){
    let data3 = { dt1: id, dt2: nama }
    this.navCtrl.push(PenyediaPage, data3);
  }

  openToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  openOrder(){
    this.navCtrl.push(OrderPage);
  }
  
}