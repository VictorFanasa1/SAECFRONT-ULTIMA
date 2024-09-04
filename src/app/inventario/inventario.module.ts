import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventarioRoutingModule } from './inventario-routing.module';
import { RegistroequiposComponent } from './components/registroequipos/registroequipos.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { MaterialModule } from '../material/material.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { InventarioComponent } from './components/inventario/inventario.component';


@NgModule({
  declarations: [RegistroequiposComponent, ReportesComponent, UsuariosComponent, InventarioComponent],
  imports: [
    CommonModule,
    InventarioRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    MatPaginatorModule,
  ]
})
export class InventarioModule { }
