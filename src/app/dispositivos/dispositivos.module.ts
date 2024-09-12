import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DispositivosRoutingModule } from './dispositivos-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BodegaComponent } from './components/bodega/bodega.component';
import { EquiposComponent } from './components/equipos/equipos.component';
import { MaterialModule } from '../material/material.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ObsoletosComponent } from './components/obsoletos/obsoletos.component';
import { LiberacionComponent } from './components/liberacion/liberacion.component';
import { VentaEquiposComponent } from './components/venta-equipos/venta-equipos.component';
import { AltaComponent } from './components/alta/alta.component';
import { NewdevicesComponent } from './modals/newdevices/newdevices.component';
import { ViewdevicesComponent } from './modals/viewdevices/viewdevices.component';


@NgModule({
  declarations: [BodegaComponent, EquiposComponent, ObsoletosComponent, LiberacionComponent, VentaEquiposComponent, AltaComponent, NewdevicesComponent, ViewdevicesComponent],
  imports: [
    CommonModule,
    DispositivosRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    MatPaginatorModule,
    FormsModule
  ]
})
export class DispositivosModule { }
