import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { HeaderComponent } from './components/header/header.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { PlacaComponent } from './modals/placa/placa.component';
import { EditDeviceComponent } from './modals/edit-device/edit-device.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AssigmentsComponent } from './modals/assigments/assigments.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EmployedsComponent } from './modals/employeds/employeds.component';
import { UploaddocComponent } from './modals/uploaddoc/uploaddoc.component';
import { LiberarComponent } from '../administracion/components/liberar/liberar.component';
import { UploadcomercialComponent } from './modals/uploadcomercial/uploadcomercial.component';
import { SupportsComponent } from './bottoms/supports/supports.component';
import { AddicionalsComponent } from './modals/addicionals/addicionals.component';
import { EmployeduploadComponent } from './modals/employedupload/employedupload.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [LayoutComponent, HeaderComponent, NavigationComponent, PlacaComponent, EditDeviceComponent, AssigmentsComponent, EmployedsComponent, UploaddocComponent, LiberarComponent, UploadcomercialComponent, SupportsComponent, AddicionalsComponent, EmployeduploadComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    FormsModule
  ],
  exports: [
    LayoutComponent,
    HeaderComponent,
    NavigationComponent,
    FormsModule

  ]
})
export class SharedModule { }
