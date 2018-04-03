import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-penyedia',
  templateUrl: 'penyedia.html',
})
export class PenyediaPage {
  productPostData = {"penyedia_id":"", "nama":"", "id":""};
  public responseData: any;
  public dataSet: any;
  public nama: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public loadingCtrl: LoadingController, public authService: AuthService) {
  }

  ionViewDidLoad(){
    let penyedia_id = this.navParams.get('dt1');
    let nama = this.navParams.get('dt2');
    this.nama = nama;
    this.getPenyediaProduct(penyedia_id);   
  }

  getPenyediaProduct(penyedia_id){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      showBackdrop: true
    });
    loading.present();
    setTimeout(() => { loading.dismiss(); }, 5000);
    this.productPostData.penyedia_id = penyedia_id;
    this.authService.postData(this.productPostData,'productByPenyedia').then((result) => {
      this.responseData = result;
      this.dataSet = this.responseData.dataPenyedia;
      loading.dismiss();
    });
  }

}