import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllMerchantPage } from './all-merchant';

@NgModule({
  declarations: [
    AllMerchantPage,
  ],
  imports: [
    IonicPageModule.forChild(AllMerchantPage),
  ],
})
export class AllMerchantPageModule {}
