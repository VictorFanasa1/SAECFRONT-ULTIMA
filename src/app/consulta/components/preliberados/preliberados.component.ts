import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { checkError } from 'src/app/core/functions/checkError';
import { admEmpleados } from 'src/app/core/models/admEmpleados.model';
import { admResponsables } from 'src/app/core/models/admResponsables.model';
import { catGeneral } from 'src/app/core/models/catGeneral.model';
import { viewPreLiberados } from 'src/app/core/models/viewPreLiberados.model';
import { datauploaddoc } from 'src/app/core/modelviews/datauploaddoc.model';
import { SaecService } from 'src/app/core/services/saec.service';
import { UploaddocComponent } from 'src/app/shared/modals/uploaddoc/uploaddoc.component';

@Component({
  selector: 'app-preliberados',
  templateUrl: './preliberados.component.html',
  styleUrls: ['./preliberados.component.scss']
})
export class PreliberadosComponent implements OnInit {

  displayedColumns: string[] = ['iEmpleado', 'sEmpleado', 'sResponsable', 'Ubicacion', 'Serie', 'Tipo', 'Marca', 'Modelo', 'dtPreLiberacion', 'iDias', 'actions'];
  isLoadingResults = false;
  dataSource: MatTableDataSource<viewPreLiberados> = new MatTableDataSource<viewPreLiberados>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild('empTbSort') empTbSort = new MatSort();
  responsables: admResponsables[] = [];
  tipos: catGeneral[] = [];
  data: string[] = [];
  employeds: admEmpleados[] = [];

  formFilters: FormGroup;
  filterValues: any = {
    uiResponsable: '',
    sTipo: '',
    sSerie: ''
  }

  constructor(
    private service: SaecService,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private titleservice: Title,
    private builder: FormBuilder
  ) {
    this.formFilters = this.builder.group({
      uiResponsable: [''],
      sTipo: [''],
      sSerie: ['']
    });
  }

  ngOnInit(): void {
    this.titleservice.setTitle('Pre Liberados');
    this.isLoadingResults = true;
    this.service.GetPreLiberados()
    .subscribe(result => {
      this.dataSource.data = result;
      this.isLoadingResults = false;
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.isLoadingResults = false;
    });

    this.service.ObtainData()
    .subscribe(result => {
      this.data = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.isLoadingResults = false;
    });

    this.service.GetResponsables()
    .subscribe(result => {
      this.responsables = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.isLoadingResults = false;
    });

    this.service.GetTipoByAF()
    .subscribe(result => {
      this.tipos = result;
    }, error => {
      checkError(error, this.router, this.snackBar);
      this.isLoadingResults = false;
    });

    this.formFilters.controls.uiResponsable.valueChanges
    .subscribe(
      status => {
        this.filterValues.uiResponsable = status;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    )
    this.formFilters.controls.sTipo.valueChanges
    .subscribe(
      source => {
        this.filterValues.sTipo = source;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    )

    this.formFilters.controls.sSerie.valueChanges
    .subscribe(
      source => {
        this.filterValues.sSerie = source;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    )
  }

  private createFilter(): (contact: viewPreLiberados, filter: string) => boolean {
    let filterFunction = function (contact: viewPreLiberados, filter: any): boolean {
      let searchTerms = JSON.parse(filter);
        return contact.uiResponsable.toString().indexOf(searchTerms.uiResponsable) !== -1
        && contact.sTipo.toString().indexOf(searchTerms.sTipo) !== -1
        && contact.sSerie.toString().indexOf(searchTerms.sSerie) !== -1;
    }
    return filterFunction;
  }

  CargarResponsiva(row: viewPreLiberados) {
    let data: datauploaddoc = new datauploaddoc();
    data.sSerie = row.sSerie;
    data.uiOrigen = row.uiLiberacion;
    data.sType = 'Liberación';
    data.bPre = 'NO';

    const dialogRef = this.dialog.open(UploaddocComponent, {
      maxWidth: '750px',
      maxHeight: '700px',
      hasBackdrop: false,
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  copytable(): string {
    let text = '<table><thead><tr><th># Empleado</th><th>Empleado</th><th>Responsable</th><th>Ubicación</th><th>Serie</th><th>Tipo</th><th>Marca</th><th>Modelo</th><th>Fecha</th><th>Días</th></tr></thead><tbody>';
    this.dataSource.filteredData.map(asg =>{
      if(asg.iDias > 14) {
        text += '<tr style="background-color: #a9281d; color: white">';
      }
      else if(asg.iDias > 7) {
        text += '<tr style="background-color: #d29922;">';
      }
      else{
        text += '<tr>';
      }
      text += `<td>${asg.iEmpleado}</td><td>${asg.sEmpleado}</td><td>${asg.sResponsable}</td><td>${asg.sUbicacion}</td><td>${asg.sSerie}</td><td>${asg.sTipo}</td><td>${asg.sMarca}</td><td>${asg.sModelo}</td><td>${asg.dtPreLiberacion.toString().replace('T00:00:00','')}</td><td>${asg.iDias}</td></tr>`;
    });
    text += '</tbody></table>';
    return text;
  }

  Dowload() {
    this.service.DownLoadPre(this.dataSource.filteredData)
    .subscribe(async result => {
      const base64Response = await fetch(`data:${result.sTypeContent};base64,${result.sFile}`);
      const blob = await base64Response.blob();
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = result.sFileName;
      link.click();
    }, error => {
      checkError(error, this.router, this.snackBar);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.createFilter();
    this.dataSource.sort = this.empTbSort;
  }
}
