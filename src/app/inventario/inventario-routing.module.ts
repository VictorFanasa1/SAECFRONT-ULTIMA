import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventarioComponent } from './components/inventario/inventario.component';
import { RegistroequiposComponent } from './components/registroequipos/registroequipos.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

const routes: Routes = [
  {
    path: 'solicitudes',
    component: RegistroequiposComponent
  },
  {
    path: 'reportes',
    component: ReportesComponent
  },
  {
    path: 'usuarios',
    component: UsuariosComponent
  },
  {
    path: 'inventario',
    component: InventarioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
