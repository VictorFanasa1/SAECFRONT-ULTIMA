import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsignacionRoutingModule } from './asignacion-routing.module';
import { AsignarComponent } from './components/asignar/asignar.component';
import { AsignacionesComponent } from '../consulta/components/asignaciones/asignaciones.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import {MatStepperModule} from '@angular/material/stepper';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ActualizarComponent } from './components/actualizar/actualizar.component';
import { TraspasoComponent } from './components/traspaso/traspaso.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddicionalsComponent } from './modals/addicionals/addicionals.component';

@NgModule({
  declarations: [AsignarComponent, AsignacionesComponent, ActualizarComponent, TraspasoComponent, AddicionalsComponent],
  imports: [
    CommonModule,
    AsignacionRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatPaginatorModule,
    DragDropModule,
    FormsModule
  ]
})
export class AsignacionModule { }
