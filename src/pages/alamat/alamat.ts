import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, Platform, ToastController, LoadingController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { GoogleMaps, GoogleMap, GoogleMapsEvent } from '@ionic-native/google-maps';
import { BasketPage } from '../basket/basket';

declare var google:any;

@IonicPage()
@Component({
  selector: 'page-alamat',
  templateUrl: 'alamat.html',
})
export class AlamatPage {
  nama:any;
  peta: GoogleMap;
  userDetails: any;
  userLocation: any;
  penyediaData: any;
  idPenyedia:any;
  namaPenyedia: any;
  penyediaLat: any;
  penyediaLng: any;
  id_user: any;
  responseData : any;
  dataSet : any;
  vLat: any;
  vLng: any;
  vInfoAddress: any;
  userPostData = {
    "id_user":"", 
    "coordLat":"", 
    "coordLng":"",
    "address":""
  };

  @ViewChild('map') mapRef:ElementRef;
  constructor(public navCtrl: NavController, 
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public toastCtrl: ToastController,
    public googleMaps: GoogleMaps,
    public authService: AuthService,
    public navParams: NavParams) {
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      this.userPostData.id_user = this.userDetails.id;

      //get data local
      const dataPenyedia = JSON.parse(localStorage.getItem('penyediaInfo'));
      this.penyediaData = dataPenyedia.penyediaInfo;
      this.idPenyedia = this.penyediaData.id;
      this.namaPenyedia = this.penyediaData.nama;
      this.penyediaLat = this.penyediaData.lat;
      this.penyediaLng = this.penyediaData.lng;
  }

  ionViewDidLoad() {
    this.platform.ready().then( () => {
      this.loadMap();
    });
  }

  loadMap(){
    let loading = this.loadingCtrl.create({
      showBackdrop: true,
      spinner: 'crescent'
    })
    loading.present();
    this.peta = this.googleMaps.create('map');
    this.peta.one(GoogleMapsEvent.MAP_READY)
      .then(()=>{
        this.peta.getMyLocation().then(pos=>{
          loading.dismiss();
          this.peta.animateCamera({
            target: pos.latLng,
            zoom: 16
          })
          this.geocodeLatLng(pos.latLng.lat, pos.latLng.lng).then(respon=>{
            this.vInfoAddress = respon;
            this.vLat = pos.latLng.lat;
            this.vLng = pos.latLng.lng;
          })
        })

        this.peta.on(GoogleMapsEvent.MAP_DRAG_END).subscribe(()=>{
          let pos = this.peta.getCameraTarget();
          this.geocodeLatLng(pos.lat, pos.lng).then(respon=>{
            this.vInfoAddress = respon;
            this.vLat = pos.lat;
            this.vLng = pos.lng;
            let toast = this.toastCtrl.create({
              message: respon+'.',
              position: 'top',
              dismissOnPageChange: true,
            })
            toast.present();
            this.peta.on(GoogleMapsEvent.MAP_DRAG_START).subscribe(()=>{
              toast.dismiss();
            })
          })
        })
        this.peta.setMyLocationEnabled(true);
      })
  }

  geocodeLatLng(lat, lng) {
    var geocoder = new google.maps.Geocoder;
    var latlng = {lat: lat, lng: lng};
    return new Promise(resolve => {
      geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
          if (results[0]) {
            resolve(results[0].formatted_address);
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      });
    });
  }

  updateLokasi(lat, lng, address){
    this.userPostData.coordLat = lat;
    this.userPostData.coordLng = lng;
    this.userPostData.address = address;
    this.authService.postData(this.userPostData,'updateLokasi').then((result) => {
    this.responseData = result;
    this.dataSet = this.responseData.lokasiData;
    localStorage.setItem('userLocation','{"userLocation":{"lat":"'+lat+'","lng":"'+lng+'","address":"'+address+'"}}');  
    this.navCtrl.setRoot(BasketPage);
    }, (err) => {
      // Error log
    })
  }

}
