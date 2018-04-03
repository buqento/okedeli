import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ProductMerchantPage } from '../product-merchant/product-merchant';

@IonicPage()
@Component({
  selector: 'page-kategori',
  templateUrl: 'kategori.html',
})
export class KategoriPage {

  productPostData = {"id":"", "kategori":"", "keyword":""};
  responseData : any;
  dataSet : any;
  judul: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public loadingCtrl: LoadingController, 
    public authService: AuthService) {
      this.initializeItems();
  }

  ionViewDidLoad() {
    let kategori = this.navParams.get('dt1');
    let judul = this.navParams.get('dt2');
    this.judul = judul;
    this.getProduct(kategori);
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

  getProduct(kategori){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      showBackdrop: true
    });
    loading.present();
    setTimeout(() => { loading.dismiss(); }, 5000);
    this.productPostData.kategori = kategori;
    this.authService.postData(this.productPostData,'productDetailKategori').then((result) => {
      this.responseData = result;
      this.dataSet = this.responseData.detailKategori;
      loading.dismiss();
    });
  }

  initializeItems() {
    this.authService.postData(this.productPostData,'productDetailKategori').then(data =>{
      this.responseData = data;
      this.dataSet = this.responseData.detailKategori;
    })
  }

  getItems(ev: any) {
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.productPostData.keyword = val;
      this.authService.postData(this.productPostData,'productCariKategori').then(data => {
        this.responseData = data;
        this.dataSet = this.responseData.cariKategori;
      });
    }else{
      this.initializeItems();
    }
  }
}