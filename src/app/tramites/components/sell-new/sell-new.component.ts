import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { checkError } from 'src/app/core/functions/checkError';
import { devicessell } from 'src/app/core/modelviews/devicessell.model';
import { SaecService } from 'src/app/core/services/saec.service';

@Component({
  selector: 'app-sell-new',
  templateUrl: './sell-new.component.html',
  styleUrls: ['./sell-new.component.scss']
})
export class SellNewComponent implements OnInit {

  frmEquipo: FormGroup;
  isDevice = false;
  isEmployed = false;
  displayedColumns: string[] = ['sSerie', 'sPlaca', 'sType', 'sBranch', 'sModel', 'uiEmployed', 'sEmployed', 'sEmail', 'dtFinish', 'actions'];
  dataSource: MatTableDataSource<devicessell> = new MatTableDataSource<devicessell>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  isLoadingResults = false;
  frmFilters: FormGroup;

  constructor(
    private builder: FormBuilder,
    private service: SaecService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.frmEquipo = this.builder.group({
      uiDevice: [Guid.createEmpty(), Validators.required],
      sSerie: ['', Validators.required],
      sPlaca: [''],
      sType: ['', Validators.required],
      sModel: ['', Validators.required],
      sBranch: ['', Validators.required],
      uiEmployed: [, Validators.required],
      sEmployed: ['', Validators.required],
      sEmail: ['', [Validators.required, Validators.email]],
      dtFinish: [,Validators.required]
    });

    this.frmFilters = this.builder.group({
      sSerie: ['']
    })
  }

  ngOnInit(): void {
  }

  SearchDevice(): void {
    this.isDevice = true;
    this.service.GetDiviceBySerie(this.frmEquipo.value.sSerie)
    .subscribe(device => {
      this.isDevice = false;
      this.frmEquipo.patchValue({
        uiDevice: device.uiDispositivo,
        sPlaca: device.sPlaca,
        sType: device.sTipo,
        sModel: device.sModelo,
        sBranch: device.sMarca
      });
      this.isEmployed = true;
      this.service.GetAssigmentByuiDevice(device.uiDispositivo)
      .subscribe(employed => {
        this.isEmployed = false;
        this.frmEquipo.patchValue({
          uiEmployed: employed.uiNumeroEmpleado,
          sEmployed: employed.sNombreUsuario,
          sEmail: employed.sCorreoUsuario
        });
      }, error => {
        this.isEmployed = false;
        checkError(error, this.router, this.snackBar);
      })
    }, error => {
      this.isDevice = false;
      checkError(error, this.router, this.snackBar);
    });
  }

  SearchEmployed(): void {
    this.isEmployed = true;
    this.service.GetEmployedByUi(this.frmEquipo.value.uiEmployed)
    .subscribe(employed => {
      this.isEmployed = false;
      this.frmEquipo.patchValue({
        uiEmployed: employed.uiNumeroEmpleado,
        sEmployed: employed.sNombreUsuario,
        sEmail: employed.sCorreoUsuario
      });
    }, error => {
      this.isEmployed = false;
      checkError(error, this.router, this.snackBar);
    });
  }

  AgregarEquipo(e: Event) {
    e.preventDefault();
    let find = this.dataSource.data.some(x=>x.sSerie === this.frmEquipo.value.sSerie);
    if(find) {
      alert('Este equipo ya se registro.')
    }

    else {
      this.dataSource.data.push(this.frmEquipo.value);
      this.dataSource._updateChangeSubscription();
      this.frmEquipo.reset();
    }
  }
}
