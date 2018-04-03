import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderPage } from '../order/order';

@IonicPage()
@Component({
  selector: 'page-sukses',
  templateUrl: 'sukses.html',
})
export class SuksesPage {
  PushOrder: any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams) {
      this.PushOrder = OrderPage;
  }

}
