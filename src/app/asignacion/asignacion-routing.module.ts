import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActualizarComponent } from './components/actualizar/actualizar.component';
import { AsignacionesComponent } from '../consulta/components/asignaciones/asignaciones.component';
import { AsignarComponent } from './components/asignar/asignar.component';
import { TraspasoComponent } from './components/traspaso/traspaso.component';

const routes: Routes = [
  {
    path: 'asignar',
    component: AsignarComponent
  },
  {
    path: 'asignaciones',
    component: AsignacionesComponent
  },
  {
    path: 'actualizar',
    component: ActualizarComponent
  },
  {
    path: 'traspaso',
    component: TraspasoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignacionRoutingModule { }
