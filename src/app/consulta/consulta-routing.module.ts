import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpedienteComponent } from './components/expediente/expediente.component';
import { GeneralComponent } from './components/general/general.component';
import { PreliberadosComponent } from './components/preliberados/preliberados.component';
import { ReporteComponent } from './components/reporte/reporte.component';

const routes: Routes = [
  {
    path: 'expediente',
    component: ExpedienteComponent
  },
  {
    path: 'preliberado',
    component: PreliberadosComponent
  },
  {
    path: 'general',
    component: GeneralComponent
  },
  {
    path: 'reporte',
    component: ReporteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaRoutingModule { }
