import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AuthService } from '../providers/auth-service/auth-service';
import { Network } from '@ionic-native/network';
import { AllMerchantPage } from '../pages/all-merchant/all-merchant';
import { BantuanPage } from '../pages/bantuan/bantuan';
import { BasketPage } from '../pages/basket/basket';
import { DepositPage } from '../pages/deposit/deposit';
import { InfoPage } from '../pages/info/info';
import { KategoriPage } from '../pages/kategori/kategori';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { OrderPage } from '../pages/order/order';
import { PenyediaPage } from '../pages/penyedia/penyedia';
import { PilihItemPage } from '../pages/pilih-item/pilih-item';
import { ProductMerchantPage } from '../pages/product-merchant/product-merchant';
import { SettingPage } from '../pages/setting/setting';
import { SignupPage } from '../pages/signup/signup';
import { SuksesPage } from '../pages/sukses/sukses';
import { UlasanPage } from '../pages/ulasan/ulasan';
import { HttpModule } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';
import { KoneksiComponent } from '../components/koneksi/koneksi';
import { SQLite } from '@ionic-native/sqlite';
import { PetaPage } from '../pages/peta/peta';
import { AlamatPage } from '../pages/alamat/alamat';

@NgModule({
  declarations: [
    MyApp,
    AlamatPage,
    AllMerchantPage,
    BantuanPage,
    BasketPage,
    DepositPage,
    HomePage,
    InfoPage,
    KategoriPage,
    LoginPage,
    MapPage,
    OrderPage,
    PenyediaPage,
    PilihItemPage,
    ProductMerchantPage,
    SettingPage,
    SignupPage,
    SuksesPage,
    UlasanPage,
    PetaPage,
    KoneksiComponent
  ],
  imports: [
    BrowserModule, HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AlamatPage,
    AllMerchantPage,
    BantuanPage,
    BasketPage,
    DepositPage,
    HomePage,
    InfoPage,
    KategoriPage,
    LoginPage,
    MapPage,
    OrderPage,
    PenyediaPage,
    PilihItemPage,
    ProductMerchantPage,
    SettingPage,
    SignupPage,
    SuksesPage,
    UlasanPage,
    PetaPage,
    KoneksiComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    SQLite,
    Network,
    GoogleMaps,
    Geolocation
  ]
})
export class AppModule {}
