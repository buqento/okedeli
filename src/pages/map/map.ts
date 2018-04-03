import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, Platform, AlertController, ActionSheetController, ToastController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { GoogleMaps, GoogleMap, GoogleMapsEvent } from '@ionic-native/google-maps';
import { HomePage } from '../home/home';

declare var google:any;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  peta: GoogleMap;
  userDetails: any;
  userLocation: any;
  lat: any;
  lng: any;
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
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public authService:AuthService, 
    private googleMaps: GoogleMaps, 
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      this.userPostData.id_user = this.userDetails.id;
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

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Alamat Pengiriman',
      message: this.vInfoAddress,
      buttons: [
        {
          text: 'Alamat lain',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Simpan',
          handler: () => {
            this.updateLokasi(this.vLat, this.vLng, this.vInfoAddress);
          }
        }
      ]
    })
    confirm.present();
  }

  updateLokasi(lat, lng, address){
    this.userPostData.coordLat = lat;
    this.userPostData.coordLng = lng;
    this.userPostData.address = address;
    this.authService.postData(this.userPostData,'updateLokasi').then((result) => {
    this.responseData = result;
    this.dataSet = this.responseData.lokasiData;
    localStorage.setItem('userLocation','{"userLocation":{"lat":"'+lat+'","lng":"'+lng+'","address":"'+address+'"}}');  
    this.navCtrl.setRoot(HomePage);
    }, (err) => {
      // Error log
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

}