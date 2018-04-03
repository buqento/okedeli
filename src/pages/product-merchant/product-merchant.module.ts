import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductMerchantPage } from './product-merchant';

@NgModule({
  declarations: [
    ProductMerchantPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductMerchantPage),
  ],
})
export class ProductMerchantPageModule {}
