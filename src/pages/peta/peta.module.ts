import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PetaPage } from './peta';

@NgModule({
  declarations: [
    PetaPage,
  ],
  imports: [
    IonicPageModule.forChild(PetaPage),
  ],
})
export class PetaPageModule {}
