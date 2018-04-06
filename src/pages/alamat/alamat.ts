import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { AuthService } from '../../providers/auth-service/auth-service';
import { BasketPage } from '../basket/basket';
declare var google:any;
@IonicPage()
@Component({
  selector: 'page-alamat',
  templateUrl: 'alamat.html',
})
export class AlamatPage {
  map: GoogleMap;
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

  constructor(public navCtrl: NavController, 
    public toastCtrl: ToastController,
    public geolocation: Geolocation,
    public authService: AuthService,
    public navParams: NavParams) {
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    this.map = GoogleMaps.create('map_canvas');
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
          this.geolocation.getCurrentPosition().then(resp=>{
            this.map.animateCamera({
              target: {
                lat: resp.coords.latitude,
                lng: resp.coords.longitude
              },
              zoom: 16
            })
          })

          this.map.on(GoogleMapsEvent.MAP_DRAG_END).subscribe(()=>{
            let pos = this.map.getCameraTarget();
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
              this.map.on(GoogleMapsEvent.MAP_DRAG_START).subscribe(()=>{
                toast.dismiss();
              })
            })
          })
          this.map.setMyLocationEnabled(true);

      });
  }

  updateLokasi(lat, lng, address){
    this.userPostData.id_user = this.userDetails.id;
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
