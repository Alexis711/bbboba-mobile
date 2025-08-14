import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablasComponent } from './tablas.component';

@NgModule({
  declarations: [TablasComponent],
  exports: [TablasComponent],     
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class TablasModule {}
