import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpleadosComponent } from './components/empleados/empleados.component';
import { FacturasComponent } from './components/facturas/facturas.component';
import { LiberarComponent } from './components/liberar/liberar.component';
import { MovimientosComponent } from './components/movimientos/movimientos.component';
import { OrdenesComponent } from './components/ordenes/ordenes.component';

const routes: Routes = [
  {
    path: 'empleados',
    component: EmpleadosComponent
  },
  {
    path: 'orden',
    component: OrdenesComponent
  },
  {
    path: 'facturas',
    component: FacturasComponent
  },
  {
    path: 'movimientos',
    component: MovimientosComponent
  },
  {
    path: 'liberacion',
    component: LiberarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
