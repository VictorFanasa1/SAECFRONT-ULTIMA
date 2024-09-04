import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionRoutingModule } from './administracion-routing.module';
import { EmpleadosComponent } from './components/empleados/empleados.component';
import { RemisionComponent } from './components/remision/remision.component';
import { MaterialModule } from '../material/material.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { OrdenesComponent } from './components/ordenes/ordenes.component';
import { ContratosComponent } from './components/contratos/contratos.component';
import { FacturasComponent } from './components/facturas/facturas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditordenComponent } from './modals/editorden/editorden.component';
import { MovimientosComponent } from './components/movimientos/movimientos.component';
import { MovimientoComponent } from '../shared/modals/movimiento/movimiento.component';
import { MatFooterCell, MatFooterRowDef } from '@angular/material/table';
import { EditinvoiceComponent } from './modals/editinvoice/editinvoice.component';
import { NewinvoiceComponent } from './modals/newinvoice/newinvoice.component';


@NgModule({
  declarations: [EmpleadosComponent, RemisionComponent, OrdenesComponent, ContratosComponent, FacturasComponent, EditordenComponent, MovimientosComponent, MovimientoComponent, EditinvoiceComponent, NewinvoiceComponent],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    MaterialModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AdministracionModule { }
