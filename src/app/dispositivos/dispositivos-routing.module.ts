import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BodegaComponent } from './components/bodega/bodega.component';
import { EquiposComponent } from './components/equipos/equipos.component';
import {ObsoletosComponent} from './components/obsoletos/obsoletos.component'
import { LiberacionComponent } from './components/liberacion/liberacion.component';
import {VentaEquiposComponent} from './components/venta-equipos/venta-equipos.component'

const routes: Routes = [
  {
    path: 'bodega',
    component: BodegaComponent
  },
  {
    path: 'divices',
    component: EquiposComponent
  },
  {
    path: 'obsoletos',
    component: ObsoletosComponent
  },
  {
    path: 'liberacion',
    component: LiberacionComponent
  },
  {
    path: 'ventaEquipo',
    component: VentaEquiposComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispositivosRoutingModule { }
