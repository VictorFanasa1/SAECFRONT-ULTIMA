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
import { MarcasComponent } from './components/marcas/marcas.component';
import { EditmarcasComponent } from './modals/editmarcas/editmarcas.component';
import { AccesoriosComponent } from './components/accesorios/accesorios.component';
import { ModelosComponent } from './components/modelos/modelos.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { TipoequipoComponent } from './components/tipoequipo/tipoequipo.component';
import { EditaccesoriosComponent } from './modals/editaccesorios/editaccesorios.component';
import { EditmodelosComponent } from './modals/editmodelos/editmodelos.component';
import { EditproveedoresComponent } from './modals/editproveedores/editproveedores.component';
import { EditequipoComponent } from './modals/editequipo/editequipo.component';
import { NewremisionComponent } from './modals/newremision/newremision/newremision.component';


@NgModule({
  declarations: [EmpleadosComponent, RemisionComponent, OrdenesComponent, ContratosComponent, FacturasComponent, EditordenComponent, MovimientosComponent, MovimientoComponent, EditinvoiceComponent, NewinvoiceComponent, MarcasComponent, EditmarcasComponent, AccesoriosComponent, ModelosComponent, ProveedoresComponent, TipoequipoComponent, EditaccesoriosComponent, EditmodelosComponent, EditproveedoresComponent, EditequipoComponent, NewremisionComponent],
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
