import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultaRoutingModule } from './consulta-routing.module';
import { ExpedienteComponent } from './components/expediente/expediente.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DocumentsComponent } from './components/documents/documents.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ContratosComponent } from './components/contratos/contratos.component';
import { PreliberadosComponent } from './components/preliberados/preliberados.component';
import { LiberacionesComponent } from './components/liberaciones/liberaciones.component';
import { GeneralComponent } from './components/general/general.component';
import { AccesoriesComponent } from './modals/accesories/accesories.component';
import { ReporteComponent } from './components/reporte/reporte.component';


@NgModule({
  declarations: [ExpedienteComponent, DocumentsComponent, ContratosComponent, PreliberadosComponent, LiberacionesComponent, GeneralComponent, AccesoriesComponent, ReporteComponent],
  imports: [
    CommonModule,
    ConsultaRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    MatPaginatorModule
  ]
})
export class ConsultaModule { }
