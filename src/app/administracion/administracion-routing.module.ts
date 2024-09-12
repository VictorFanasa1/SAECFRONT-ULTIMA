import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpleadosComponent } from './components/empleados/empleados.component';
import { FacturasComponent } from './components/facturas/facturas.component';
import { LiberarComponent } from './components/liberar/liberar.component';
import { MovimientosComponent } from './components/movimientos/movimientos.component';
import { OrdenesComponent } from './components/ordenes/ordenes.component';
import { MarcasComponent } from './components/marcas/marcas.component';
import { AccesoriosComponent } from './components/accesorios/accesorios.component';
import { ModelosComponent } from './components/modelos/modelos.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { TipoequipoComponent } from './components/tipoequipo/tipoequipo.component';

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
  },
  {
    path: 'accesorios',
    component: AccesoriosComponent
  },
  {
    path: 'marcas',
    component: MarcasComponent
  },
  {
    path: 'modelos',
    component: ModelosComponent
  },
  {
    path: 'proveedores',
    component: ProveedoresComponent
  },
  {
    path: 'tipoequipo',
    component: TipoequipoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
