import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TramitesRoutingModule } from './tramites-routing.module';
import { SellComponent } from './components/sell/sell.component';
import { SellNewComponent } from './components/sell-new/sell-new.component';
import { SellQueryComponent } from './components/sell-query/sell-query.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [SellComponent, SellNewComponent, SellQueryComponent],
  imports: [
    CommonModule,
    TramitesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    MatPaginatorModule
  ]
})
export class TramitesModule { }
