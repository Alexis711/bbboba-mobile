import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsuariosPageRoutingModule } from './usuarios-routing.module';
import { UsuariosPage } from './usuarios.page';
import { TablasModule } from '../component/tablas/tablas.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosPageRoutingModule,
    TablasModule
  ],
  declarations: [UsuariosPage]
})
export class UsuariosPageModule {}
